"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, RefreshCw, TrendingUp, TrendingDown, Zap, AlertCircle } from 'lucide-react';
import _ from 'lodash';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import axios from 'axios';
import defaultchain from '../assets/default-chain.jpg';

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// 添加一个工具函数来估算流动性峰值
const estimatePeakLiquidity = (currentLiquidity, priceChange, tokenAge, marketCapRatio) => {
  // 如果代币存在一段时间，假设它曾经有更高的流动性
  const ageInDays = tokenAge ? Math.max(1, Math.floor(tokenAge / (24 * 60 * 60 * 1000))) : 30;
  
  // 对于较新的代币（< 30天），使用较小的乘数
  // 对于较老的代币，假设它们经历过市场周期，使用较大的乘数
  const ageMultiplier = Math.min(2.5, 1 + (ageInDays / 60));
  
  // 如果价格大幅下跌，历史流动性可能高得多
  const priceChangeMultiplier = priceChange < 0 
    ? 1 + Math.min(3, Math.abs(priceChange) * 8) // 对于下跌50%+的代币，最高4倍
    : 1.2; // 对于上涨的代币，小幅缓冲
  
  // 考虑市值比率（当前市值与峰值市值的比率）
  // 如果市值比率大，说明代币从高点下跌很多，流动性可能也下跌很多
  const marketCapMultiplier = marketCapRatio > 1 ? Math.min(2, Math.sqrt(marketCapRatio)) : 1;
  
  // 综合考虑这些因素
  return currentLiquidity * ageMultiplier * priceChangeMultiplier * marketCapMultiplier;
};

// Blockchain service
const blockchainService = {
  getOnChainData: async (address, chain) => {
    if (chain === "Solana") {
      try {
        // Use Jupiter API to get token information
        const jupiterResponse = await axios.get(`https://lite-api.jup.ag/tokens/v1/token/${address}`);
        const tokenData = jupiterResponse.data;
        
        // console.log(`Jupiter data for ${address}:`, tokenData);
        
        // Use DexScreener API to get token pairs information
        const dexScreenerResponse = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
        
        // console.log(`DexScreener data for ${address}:`, dexScreenerResponse.data);
        
        // Get the most liquid pair for the token
        const pairs = dexScreenerResponse.data.pairs || [];
        
        // Sort pairs by liquidity (highest first) to get the most representative pair
        const sortedPairs = pairs.sort((a, b) => {
          const liquidityA = a.liquidity?.usd || 0;
          const liquidityB = b.liquidity?.usd || 0;
          return liquidityB - liquidityA;
        });
        
        const pairData = sortedPairs.length > 0 ? sortedPairs[0] : null;
        
        // Correctly access liquidity.usd
        const currentLiquidity = pairData?.liquidity?.usd || 0;
        
        // Calculate market cap using data from DexScreener
        const currentMarketCap = pairData?.marketCap || 0;
        
        // Get transaction data
        const txns24h = pairData?.txns?.h24 || { buys: 0, sells: 0 };
        const totalTxns24h = (txns24h.buys || 0) + (txns24h.sells || 0);
        
        // Get holder count - with error handling
        let holdersCount = 0;
        try {
          const holdersResponse = await axios.get(`https://public-api.solscan.io/token/holders?tokenAddress=${address}&limit=10`);
          holdersCount = holdersResponse.data?.total || 0;
        //   console.log(`Holder count for ${address}:`, holdersCount);
        } catch (holderError) {
        //   console.log(`Could not fetch holder count for ${address}: ${holderError.message}`);
        }
        
        // Calculate supply based on market cap and price
        const price = pairData?.priceUsd || 0;
        const supply = price > 0 ? currentMarketCap / price : 
                      tokenData?.supply ? parseFloat(tokenData.supply) / Math.pow(10, tokenData.decimals || 9) : 0;
        
        // 计算代币年龄
        const createdAtTimestamp = pairData?.pairCreatedAt 
          ? pairData.pairCreatedAt * 1000 
          : (tokenData?.created_at ? new Date(tokenData.created_at).getTime() : null);
        
        const tokenAge = createdAtTimestamp ? (Date.now() - createdAtTimestamp) : null;
        
        // 估算市值峰值
        let peakMarketCap = 0;
        
        // 方法1：如果有fdv（完全稀释价值），使用它作为峰值市值的近似值
        if (pairData?.fdv && pairData.fdv > currentMarketCap) {
          peakMarketCap = pairData.fdv;
        } 
        // 方法2：检查所有交易对，找出最高值
        else {
          const highestMarketCap = Math.max(
            currentMarketCap,
            ...pairs.map(p => p.marketCap || 0)
          );
          
          // 如果在交易对中找到更高的值，使用它们
          if (highestMarketCap > currentMarketCap) {
            peakMarketCap = highestMarketCap;
          } else {
            // 方法3：使用估算函数
            peakMarketCap = currentMarketCap * 1.5; // 简化的估算
          }
        }
        
        // 确保峰值至少比当前值高10%
        peakMarketCap = Math.max(peakMarketCap, currentMarketCap * 1.1);
        
        // 计算市值比率（峰值/当前）
        const marketCapRatio = currentMarketCap > 0 ? (peakMarketCap / currentMarketCap) : 1.5;
        
        // 估算流动性峰值 - 使用简化的估算
        // 检查所有交易对中的最高流动性
        const highestLiquidity = Math.max(
          currentLiquidity,
          ...pairs.map(p => p.liquidity?.usd || 0)
        );
        
        // 如果找到更高的流动性，使用它；否则估算
        let peakLiquidity = highestLiquidity > currentLiquidity ? 
          highestLiquidity : 
          currentLiquidity * Math.max(1.5, Math.sqrt(marketCapRatio));
        
        // 确保流动性峰值至少比当前流动性高10%
        peakLiquidity = Math.max(peakLiquidity, currentLiquidity * 1.1);
        
        // console.log(`估算的历史峰值 ${address}:`, {
        //   currentMarketCap,
        //   peakMarketCap,
        //   currentLiquidity,
        //   peakLiquidity,
        //   marketCapRatio
        // });
        
        // 获取交易量 - 确保正确访问volume.h24
        const dailyVolume = pairData?.volume?.h24 || 0;
        
        const onChainData = {
          currentMarketCap: currentMarketCap,
          peakMarketCap: peakMarketCap,
          liquidityUSD: currentLiquidity,
          peakLiquidity: peakLiquidity,
          dailyVolume: dailyVolume,
          priceChange24h: (pairData?.priceChange?.h24 || 0) / 100, // Convert to decimal
          txCount24h: totalTxns24h,
          holders: holdersCount,
          holderChangeRate: 0,
          createdAt: pairData?.pairCreatedAt ? new Date(pairData.pairCreatedAt * 1000).toISOString() : 
                    tokenData?.created_at || new Date().toISOString(),
          lastActiveTimestamp: new Date().toISOString(),
          supply: supply,
          price: price,
          name: tokenData?.name || pairData?.baseToken?.name || '',
          symbol: tokenData?.symbol || pairData?.baseToken?.symbol || '',
          decimals: tokenData?.decimals || 9,
          logoURI: tokenData?.logoURI || null,
          tags: tokenData?.tags || [],
          allPairs: pairs
        };
        
        // console.log(`Processed onChainData for ${address}:`, onChainData);
        
        return onChainData;
      } catch (error) {
        console.error("Error fetching Solana data:", error);
        // Return default data
        return {
          currentMarketCap: 0,
          peakMarketCap: 0,
          liquidityUSD: 0,
          peakLiquidity: 0,
          dailyVolume: 0,
          priceChange24h: 0,
          txCount24h: 0,
          holders: 0,
          holderChangeRate: 0,
          createdAt: new Date().toISOString(),
          lastActiveTimestamp: new Date().toISOString(),
          supply: 0,
          price: 0,
          name: '',
          symbol: '',
          decimals: 9,
          logoURI: null,
          tags: [],
          allPairs: []
        };
      }
    } else {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return {
        currentMarketCap: Math.random() * 10000000,
        peakMarketCap: Math.random() * 100000000,
        liquidityUSD: Math.random() * 1000000,
        dailyVolume: Math.random() * 500000,
        priceChange24h: (Math.random() * 2 - 1) * 0.5, // -50% to +50%
        txCount24h: Math.floor(Math.random() * 100),
        holders: Math.floor(Math.random() * 10000),
        holderChangeRate: (Math.random() * 2 - 1) * 0.3, // -30% to +30%
        createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Random date within last year
        lastActiveTimestamp: new Date(Date.now() - Math.random() * 2592000000).toISOString(), // Random date within last month
      };
    }
  },
  
  getSocialData: async (name) => {
    try {
      // Use CryptoCompare API to get social data
      const cryptoCompareResponse = await axios.get(`https://min-api.cryptocompare.com/data/social/coin/latest?coinId=${name}`);
      const socialStats = cryptoCompareResponse.data.Data;
      
      return {
        twitterSearchVolume24h: socialStats?.Twitter?.followers || Math.floor(Math.random() * 1000),
        redditPosts24h: socialStats?.Reddit?.posts_per_day || Math.floor(Math.random() * 10),
        discordMessages24h: Math.floor(Math.random() * 100),
        telegramMessages24h: socialStats?.Telegram?.subscribers || Math.floor(Math.random() * 200),
        sentimentData: {
          positive: Math.random() * 0.5,
          neutral: Math.random() * 0.3,
          negative: Math.random() * 0.5,
        }
      };
    } catch (error) {
      console.error("Error fetching social data:", error);
      // Return default data
      return {
        twitterSearchVolume24h: Math.floor(Math.random() * 1000),
        redditPosts24h: Math.floor(Math.random() * 10),
        discordMessages24h: Math.floor(Math.random() * 100),
        telegramMessages24h: Math.floor(Math.random() * 200),
        sentimentData: {
          positive: Math.random() * 0.5,
          neutral: Math.random() * 0.3,
          negative: Math.random() * 0.5,
        }
      };
    }
  },
  
  getSolanaPumpTokens: async () => {
    try {
      // Use Jupiter API to get all tokens
      const jupiterResponse = await axios.get('https://lite-api.jup.ag/tokens/v1/all');
      
      // Filter tokens that have "pump" in their address or are tagged as "meme"
      const pumpTokens = jupiterResponse.data
        .filter(token => 
          token.address.toLowerCase().includes('pump') || 
          (token.tags && token.tags.includes('meme'))
        )
        .map(token => ({
          name: token.symbol || token.name || 'Unknown',
          address: token.address,
          chain: "Solana",
          source: "Jupiter",
          logoURI: token.logoURI || null,
          tags: token.tags || []
        }));
      
    //   console.log("Found pump tokens:", pumpTokens.length);
      
      // If we don't find enough tokens, try getting trending tokens
      if (pumpTokens.length < 10) {
        try {
          const trendingResponse = await axios.get('https://lite-api.jup.ag/tokens/v1/tagged/birdeye-trending');
          const trendingTokens = trendingResponse.data
            .map(token => ({
              name: token.symbol || token.name || 'Unknown',
              address: token.address,
              chain: "Solana",
              source: "Jupiter-Trending",
              logoURI: token.logoURI || null,
              tags: token.tags || []
            }));
          
          // Add trending tokens that aren't already in our list
          const allTokens = [...pumpTokens];
          trendingTokens.forEach(token => {
            if (!allTokens.some(t => t.address === token.address)) {
              allTokens.push(token);
            }
          });
          
          return allTokens;
        } catch (error) {
          console.error("Error fetching trending tokens:", error);
          return pumpTokens;
        }
      }
      
      return pumpTokens;
    } catch (error) {
      console.error("Error fetching Jupiter tokens:", error);
      
      // Fallback to using a different endpoint
      try {
        const tradableResponse = await axios.get('https://lite-api.jup.ag/tokens/v1/mints/tradable');
        const allTokensResponse = await Promise.all(
          tradableResponse.data.slice(0, 20).map(async (mint) => {
            try {
              const tokenInfo = await axios.get(`https://lite-api.jup.ag/tokens/v1/token/${mint}`);
              return {
                name: tokenInfo.data.symbol || tokenInfo.data.name || 'Unknown',
                address: tokenInfo.data.address,
                chain: "Solana",
                source: "Jupiter-Tradable",
                logoURI: tokenInfo.data.logoURI || null,
                tags: tokenInfo.data.tags || []
              };
            } catch {
              return null;
            }
          })
        );
        
        return allTokensResponse.filter(token => token !== null);
      } catch (error) {
        console.error("Error with fallback token fetch:", error);
        
        // Return some known tokens as a last resort
        return [
          { name: "PUMP", address: "pumpiLBcRm9QEZa1kNsYPqKZhiPxdyv97bxBzXyNfKdM", chain: "Solana", source: "pump.fun" },
          { name: "BERN", address: "berNKbrJfGWWz7XwQUDKQeNcZmP3GJkaXj7NMxKDf9x", chain: "Solana", source: "pump.fun" },
          { name: "SLERF", address: "4LLAcZSPE9sFmcHvfuHTByEYkM8WBYRJzQGBvTnqvQmC", chain: "Solana", source: "pump.fun" },
          { name: "POPCAT", address: "A98UDy7z8MfmWnTQt6cKjje7UfqV3pTLf4yEbuwL2HrH", chain: "Solana", source: "pump.fun" },
          { name: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", chain: "Solana", source: "pump.fun" },
        ];
      }
    }
  }
};

// Rating system for calculating scores
const ratingSystem = {
  calculateOnChainDeathScore: (onChainData) => {
    // Higher score = more "dead"
    let score = 0;
    
    // Market cap decline from peak
    const marketCapDecline = 1 - (onChainData.currentMarketCap / onChainData.peakMarketCap);
    score += marketCapDecline * 40; // Up to 40 points
    
    // Low liquidity relative to market cap
    const liquidityRatio = onChainData.liquidityUSD / onChainData.currentMarketCap;
    score += (1 - Math.min(liquidityRatio * 10, 1)) * 20; // Up to 20 points
    
    // Low trading volume
    const volumeRatio = onChainData.dailyVolume / onChainData.currentMarketCap;
    score += (1 - Math.min(volumeRatio * 50, 1)) * 20; // Up to 20 points
    
    // Holder change rate (negative = losing holders)
    score += Math.max(-onChainData.holderChangeRate, 0) * 20; // Up to 20 points
    
    return Math.min(Math.max(score, 0), 100);
  },
  
  calculateSocialDeathScore: (socialData) => {
    // Higher score = more "dead"
    let score = 0;
    
    // Low Twitter search volume
    score += (1 - Math.min(socialData.twitterSearchVolume24h / 1000, 1)) * 30; // Up to 30 points
    
    // Low Reddit activity
    score += (1 - Math.min(socialData.redditPosts24h / 10, 1)) * 20; // Up to 20 points
    
    // Low Discord activity
    score += (1 - Math.min(socialData.discordMessages24h / 100, 1)) * 20; // Up to 20 points
    
    // Low Telegram activity
    score += (1 - Math.min(socialData.telegramMessages24h / 200, 1)) * 10; // Up to 10 points
    
    // Negative sentiment
    score += socialData.sentimentData.negative * 20; // Up to 20 points
    
    return Math.min(Math.max(score, 0), 100);
  },
  
  calculateTotalScore: (onChainScore, socialScore, onChainData) => {
    // Combined death score (weighted average)
    const deathScore = onChainScore * 0.7 + socialScore * 0.3;
    
    // Recovery value calculation
    // Higher value = better recovery potential
    const marketCapRatio = onChainData.peakMarketCap / onChainData.currentMarketCap;
    const liquidityRatio = onChainData.liquidityUSD / onChainData.currentMarketCap;
    
    // Recovery value is higher when:
    // 1. Token had a high peak market cap compared to current (fallen giant)
    // 2. Has good liquidity relative to current market cap (easy to trade)
    // 3. Death score is high but not too extreme (sweet spot around 70-80)
    
    let recoveryValue = (Math.min(marketCapRatio, 100) / 50) * 0.5; // Up to 1.0 from market cap ratio
    recoveryValue += Math.min(liquidityRatio * 5, 1) * 0.3; // Up to 0.3 from liquidity
    
    // Bonus for tokens in the "sweet spot" of death score
    const deathScoreBonus = deathScore > 60 && deathScore < 90 
      ? 0.2 * (1 - Math.abs(75 - deathScore) / 15) 
      : 0;
    recoveryValue += deathScoreBonus; // Up to 0.2 bonus
    
    return {
      deathScore,
      recoveryValue: Math.max(recoveryValue, 0.1) // Minimum 0.1
    };
  }
};

// 定义"死亡代币"的标准，专注于低流动性或低交易量
const isDeadCoin = (token) => {
    //  console.log(token)
  // 金融指标 - 专注于这些关键指标
  const lowLiquidity = token.onChainData.liquidityUSD < 200000; // 流动性低于$50,000
//   const lowVolume = token.onChainData.dailyVolume < 20000;     // 日交易量低于$20,000
  
  // 如果代币满足任一条件，则被视为"死亡代币"
  return lowLiquidity;
};

function Dashboard() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('deathScore');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedChain, setSelectedChain] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 20;
  
  // Debounced search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Use client-side only initialization to avoid hydration errors
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    fetchTokenData();
  }, []);
  
  const fetchTokenData = async () => {
    try {
      setLoading(true);
      const processedTokens = [];
      
      // Fetch all tokens from Jupiter API
      const jupiterResponse = await axios.get('https://lite-api.jup.ag/tokens/v1/all', {
        headers: { 'Accept': 'application/json' }
      });
      
    //   console.log("Total tokens from Jupiter API:", jupiterResponse.data.length);
      
      // Filter tokens that have "pump" in their address
      const pumpTokens = jupiterResponse.data.filter(token => 
        token.address.toLowerCase().includes('pump')
      );
      
    //   console.log("Tokens with 'pump' in address:", pumpTokens.length);
    //   console.log("Pump tokens:", pumpTokens);
      
      // Create a dictionary of tokens by chain
      const tokensByChain = {
        Solana: pumpTokens // Only process pump tokens
      };
      
      // Process tokens in batches to avoid UI freezing
      const batchSize = 10;
      const maxTokens = 100; // Limit to 100 tokens for performance
      
      // Process Solana tokens
      const solanaTokens = tokensByChain.Solana.slice(0, maxTokens);
      
      for (let i = 0; i < solanaTokens.length; i += batchSize) {
        const batch = solanaTokens.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (token) => {
          try {
            // Get additional on-chain data
            const onChainData = await blockchainService.getOnChainData(token.address, "Solana");
            
            // Get social data
            const socialData = await blockchainService.getSocialData(token.symbol);
            
            // Calculate scores
            const deathScore = ratingSystem.calculateOnChainDeathScore(onChainData);
            const recoveryValue = ratingSystem.calculateSocialDeathScore(socialData);
            
            return {
              name: token.name || token.symbol,
              symbol: token.symbol,
              address: token.address,
              chain: "Solana",
              logoURI: token.logoURI,
              tags: token.tags || [],
              onChainData,
              socialData,
              deathScore,
              recoveryValue
            };
          } catch (error) {
            console.error(`Error processing token ${token.name || token.symbol}:`, error);
            return null;
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter(result => result !== null);
        processedTokens.push(...validResults);
        
        // Update tokens state after each batch to show progress
        if (i === 0) {
          setTokens(validResults); // Set initial results quickly
          setLoading(false);
        } else {
          setTokens(prev => [...prev, ...validResults]);
        }
      }
      
    } catch (error) {
      console.error("Error fetching token data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Memoize filtered and sorted tokens to prevent recalculation on every render
  const filteredAndSortedTokens = useMemo(() => {
    return tokens
      .filter(token => {
        // 应用死亡代币过滤器 - 只显示流动性低或交易量低的代币
        if (!isDeadCoin(token)) return false;
        
        // 确保代币至少有一些流动性，以便可交易
        if (token.onChainData.liquidityUSD < 1000) return false;
        
        // 然后应用用户过滤器
        if (selectedChain !== 'all' && token.chain !== selectedChain) return false;
        if (debouncedSearchTerm.trim() !== '') {
          const term = debouncedSearchTerm.toLowerCase();
          return (
            token.name.toLowerCase().includes(term) ||
            token.address.toLowerCase().includes(term) ||
            token.chain.toLowerCase().includes(term)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let aValue, bValue;
        
        switch (sortField) {
          case 'name': aValue = a.name; bValue = b.name; break;
          case 'chain': aValue = a.chain; bValue = b.chain; break;
          case 'liquidity': aValue = a.onChainData.liquidityUSD; bValue = b.onChainData.liquidityUSD; break;
          case 'volume': aValue = a.onChainData.dailyVolume; bValue = b.onChainData.dailyVolume; break;
          case 'holders': aValue = a.onChainData.holders; bValue = b.onChainData.holders; break;
          case 'priceChange': aValue = a.onChainData.priceChange24h; bValue = b.onChainData.priceChange24h; break;
          case 'deathScore': aValue = a.deathScore; bValue = b.deathScore; break;
          case 'recoveryValue': aValue = a.recoveryValue; bValue = b.recoveryValue; break;
          default: aValue = a.deathScore; bValue = b.deathScore;
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [tokens, selectedChain, debouncedSearchTerm, sortField, sortDirection]);
  
  // Memoize current page tokens
  const currentTokens = useMemo(() => {
    const indexOfLastToken = currentPage * tokensPerPage;
    const indexOfFirstToken = indexOfLastToken - tokensPerPage;
    return filteredAndSortedTokens.slice(indexOfFirstToken, indexOfLastToken);
  }, [filteredAndSortedTokens, currentPage, tokensPerPage]);
  
  // Memoize total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedTokens.length / tokensPerPage);
  }, [filteredAndSortedTokens.length, tokensPerPage]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedChain, sortField, sortDirection]);
  
  // Memoize pagination handlers
  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);
  
  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);
  
  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);
  
  // Memoize render functions
  const renderSortIcon = useCallback((field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  }, [sortField, sortDirection]);
  
  const renderPriceChange = useCallback((change) => {
    const isPositive = change > 0;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    const Icon = isPositive ? TrendingUp : TrendingDown;
    
    return (
      <div className={`flex items-center ${colorClass}`}>
        <Icon size={16} className="mr-1" />
        <span>{(change * 100).toFixed(2)}%</span>
      </div>
    );
  }, []);
  
  const renderDeathScore = useCallback((score) => {
    let colorClass = 'text-green-600';
    if (score > 80) colorClass = 'text-red-600';
    else if (score > 60) colorClass = 'text-orange-500';
    else if (score > 30) colorClass = 'text-yellow-500';
    
    return (
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
          <div 
            className={`h-2.5 rounded-full ${score > 80 ? 'bg-red-600' : score > 60 ? 'bg-orange-500' : score > 30 ? 'bg-yellow-500' : 'bg-green-600'}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <span className={colorClass}>{score.toFixed(0)}</span>
      </div>
    );
  }, []);
  
  const renderRecoveryValue = useCallback((value) => {
    const stars = Math.round(value * 5);
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          // Set static value - only the first star is filled
          const isFilled = i === 0; // Only first star (1/5) is filled
          return (
            <svg 
              key={i} 
              className={`w-6 h-6 ${isFilled ? 'text-yellow-500' : 'text-gray-300'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
    );
  }, []);
  
  // Format number helper
  const formatNumber = useCallback((num) => {
    if (num === undefined || num === null) return '0';
    if (num === 0) return '0';
    
    if (num < 1) {
      return num.toFixed(6);
    }
    
    if (num < 1000) {
      return num.toFixed(2);
    }
    
    if (num < 1000000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    
    if (num < 1000000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    
    return (num / 1000000000).toFixed(2) + 'B';
  }, []);
  
  // Pagination component
  const Pagination = useCallback(() => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6 mt-4">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium ${
              currentPage === 1 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Previous
          </button>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
          </div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium ${
              currentPage === totalPages ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{(currentPage - 1) * tokensPerPage + 1}</span> to 
              <span className="font-medium"> {Math.min(currentPage * tokensPerPage, filteredAndSortedTokens.length)}</span> of 
              <span className="font-medium">{filteredAndSortedTokens.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                  currentPage === 1 
                    ? 'text-gray-300 dark:text-gray-600' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-offset-0`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === pageNum
                        ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-offset-0'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                  currentPage === totalPages 
                    ? 'text-gray-300 dark:text-gray-600' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-offset-0`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  }, [currentPage, totalPages, goToPrevPage, goToNextPage, paginate, filteredAndSortedTokens.length, tokensPerPage]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    fetchTokenData();
  }, [refreshing]);
  
  // Handle sort
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField, sortDirection]);
  
  // Handle token details
  const openTokenDetails = useCallback((token) => {
    setSelectedToken(token);
  }, []);
  
  const closeTokenDetails = useCallback(() => {
    setSelectedToken(null);
  }, []);

  // Only render client-side to avoid hydration errors
  if (!isClient) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw size={40} className="text-blue-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Dead Memecoin Rank <span className="text-sm font-medium text-white bg-yellow-500 px-2 py-1 rounded-md ml-2 align-middle">Under development</span>
              </h1>
              <p className="text-gray-600 mt-1">Still holding any of the following tokens? We shall build a Titan from these ashes together.</p>
            </div>
            <button 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-blue-400"
            >
              <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-grow min-w-[250px]">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for a token by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="mr-2 text-gray-700">Chain:</label>
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['all', 'Solana'].map(chain => (
                  <option key={chain} value={chain}>
                    {chain === 'all' ? 'All' : chain}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Token Table */}
          <div className="overflow-x-auto">
            {loading && tokens.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw size={40} className="text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading tokens...</p>
              </div>
            ) : filteredAndSortedTokens.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle size={40} className="text-yellow-500 mb-4" />
                <p className="text-gray-600 text-lg mb-2">No results found</p>
                <p className="text-gray-500">Try changing the search criteria or refreshing the data</p>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                        <div className="flex items-center">
                          Token
                          {renderSortIcon('name')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('chain')}>
                        <div className="flex items-center">
                          Chain
                          {renderSortIcon('chain')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('liquidity')}>
                        <div className="flex items-center">
                          Liquidity
                          {renderSortIcon('liquidity')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('priceChange')}>
                        <div className="flex items-center">
                          24h Change
                          {renderSortIcon('priceChange')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('deathScore')}>
                        <div className="flex items-center">
                          Death Score
                          {renderSortIcon('deathScore')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('recoveryValue')}>
                        <div className="flex items-center">
                          Recovery Potential
                          {renderSortIcon('recoveryValue')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentTokens.map((token, index) => (
                      <tr key={token.address} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              {token.logoURI ? (
                                /* eslint-disable @next/next/no-img-element */
                                <img className="h-10 w-10 rounded-full" src={token.logoURI} alt={token.name} />
                                /* eslint-enable @next/next/no-img-element */
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                  {token.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{token.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}</div>
                            </div>
                          </div>
                          {token.tags && token.tags.length > 0 && (
                            <span className="px-2 py-1 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {token.tags[0]}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            {token.chain}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${formatNumber(token.onChainData.liquidityUSD)}</div>
                          <div className="text-xs text-gray-500">Peak ${formatNumber(token.onChainData.peakLiquidity)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(token.onChainData.priceChange24h)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderDeathScore(token.deathScore)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderRecoveryValue(token.recoveryValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openTokenDetails(token)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Details
                          </button>
                          {/* <button className="text-green-600 hover:text-green-900">
                            兑换
                          </button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {loading && tokens.length > 0 && (
                  <div className="flex justify-center items-center py-4">
                    <RefreshCw size={24} className="text-blue-500 animate-spin mr-2" />
                    <p className="text-gray-600">Loading more tokens...</p>
                  </div>
                )}
                
                <Pagination />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Token Details Modal */}
      {selectedToken && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-12 w-12 relative mr-4">
                    {selectedToken.logoURI ? (
                      /* eslint-disable @next/next/no-img-element */
                      <img className="h-12 w-12 rounded-full" src={selectedToken.logoURI} alt={selectedToken.name} />
                      /* eslint-enable @next/next/no-img-element */
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl">
                        {selectedToken.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {/* eslint-disable @next/next/no-img-element */}
                      <img 
                        src={`/images/${selectedToken.chain.toLowerCase()}.png`} 
                        alt={selectedToken.chain} 
                        className="h-5 w-5 rounded-full"
                        onError={(e) => {e.target.src = "/images/default-chain.png"}}
                      />
                      {/* eslint-enable @next/next/no-img-element */}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedToken.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{selectedToken.address}</p>
                  </div>
                </div>
                <button 
                  onClick={closeTokenDetails}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">On-chain Data</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current Market Cap:</span>
                      <span className="font-medium text-gray-900 dark:text-white">${formatNumber(selectedToken.onChainData.currentMarketCap)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Highest Market Cap:</span>
                      <span className="font-medium text-gray-900 dark:text-white">${formatNumber(selectedToken.onChainData.peakMarketCap)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Liquidity:</span>
                      <span className="font-medium text-gray-900 dark:text-white">${formatNumber(selectedToken.onChainData.liquidityUSD)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">24h Volume:</span>
                      <span className="font-medium text-gray-900 dark:text-white">${formatNumber(selectedToken.onChainData.dailyVolume)}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Holder Count:</span>
                      <span className="font-medium">{formatNumber(selectedToken.onChainData.holders)}</span>
                    </div> */}
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Date Created:</span>
                      <span className="font-medium">{new Date(selectedToken.onChainData.createdAt).toLocaleDateString()}</span>
                    </div> */}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Active:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{new Date(selectedToken.onChainData.lastActiveTimestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Social Data</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Twitter Search Volume:</span>
                      <span className="font-medium">{formatNumber(selectedToken.socialData.twitterSearchVolume24h)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telegram Search Volume:</span>
                      <span className="font-medium">{formatNumber(selectedToken.socialData.telegramMessages24h)}</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-gray-600 block mb-2">Sentiment Analysis:</span>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="flex h-2.5 rounded-full">
                          <div 
                            className="bg-green-500 h-2.5 rounded-l-full" 
                            style={{ width: `${selectedToken.socialData.sentimentData.positive * 100}%` }}
                          ></div>
                          <div 
                            className="bg-gray-400 h-2.5" 
                            style={{ width: `${selectedToken.socialData.sentimentData.neutral * 100}%` }}
                          ></div>
                          <div 
                            className="bg-red-500 h-2.5 rounded-r-full" 
                            style={{ width: `${selectedToken.socialData.sentimentData.negative * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-green-500">Positive {(selectedToken.socialData.sentimentData.positive * 100).toFixed(0)}%</span>
                        <span className="text-gray-500">Neutral {(selectedToken.socialData.sentimentData.neutral * 100).toFixed(0)}%</span>
                        <span className="text-red-500">Negative {(selectedToken.socialData.sentimentData.negative * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Score</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Death Score (Higher is more dangerous)</p>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-2">
                        <div 
                          className={`h-4 rounded-full ${
                            selectedToken.deathScore > 80 ? 'bg-red-600' : 
                            selectedToken.deathScore > 60 ? 'bg-orange-500' : 
                            selectedToken.deathScore > 30 ? 'bg-yellow-500' : 
                            'bg-green-600'
                          }`}
                          style={{ width: `${selectedToken.deathScore}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{selectedToken.deathScore.toFixed(0)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Recovery Potential (Higher is better)</p>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => {
                          // Set static value - only the first star is filled
                          const isFilled = i === 0; // Only first star (1/5) is filled
                          return (
                            <svg 
                              key={i} 
                              className={`w-6 h-6 ${isFilled ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          );
                        })}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">1.0/5</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeTokenDetails}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 mr-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  View Transactions
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;