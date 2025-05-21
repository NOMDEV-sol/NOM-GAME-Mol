"use client";

import axios from 'axios';

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

export const blockchainService = {
  getOnChainData: async (address, chain) => {
    if (chain === "Solana") {
      try {
        // console.log(`[blockchainService] Getting data for ${address}`);
        
        // Use Jupiter API to get token information
        let tokenData = {};
        try {
        //   console.log(`[blockchainService] Fetching from Jupiter API for ${address}`);
          const jupiterResponse = await axios.get(`https://lite-api.jup.ag/tokens/v1/token/${address}`);
          tokenData = jupiterResponse.data;
        //   console.log(`[blockchainService] Jupiter data received for ${address}:`, tokenData);
        } catch (jupiterError) {
          console.error(`[blockchainService] Jupiter API error for ${address}:`, jupiterError);
          // Continue with empty tokenData
        }
        
        // Use DexScreener API to get token pairs information
        let dexScreenerData = { pairs: [] };
        try {
        //   console.log(`[blockchainService] Fetching from DexScreener API for ${address}`);
          const dexScreenerResponse = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
          dexScreenerData = dexScreenerResponse.data;
        //   console.log(`[blockchainService] DexScreener data received for ${address}:`, 
        //     dexScreenerData.pairs ? `${dexScreenerData.pairs.length} pairs found` : 'No pairs found');
        } catch (dexScreenerError) {
          console.error(`[blockchainService] DexScreener API error for ${address}:`, dexScreenerError);
          // Continue with empty pairs array
        }
        
        // Get the most liquid pair for the token
        const pairs = dexScreenerData.pairs || [];
        
        if (pairs.length === 0) {
          console.log(`[blockchainService] No pairs found for ${address}, returning default data`);
          // If no pairs found, return default data with token info from Jupiter
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
            supply: tokenData?.supply ? parseFloat(tokenData.supply) / Math.pow(10, tokenData.decimals || 9) : 0,
            price: 0,
            name: tokenData?.name || '',
            symbol: tokenData?.symbol || '',
            decimals: tokenData?.decimals || 9,
            logoURI: tokenData?.logoURI || null,
            tags: tokenData?.tags || [],
            allPairs: []
          };
        }
        
        // Sort pairs by liquidity (highest first) to get the most representative pair
        const sortedPairs = pairs.sort((a, b) => {
          const liquidityA = a.liquidity?.usd || 0;
          const liquidityB = b.liquidity?.usd || 0;
          return liquidityB - liquidityA;
        });
        
        const pairData = sortedPairs.length > 0 ? sortedPairs[0] : null;
        // console.log(`[blockchainService] Most liquid pair for ${address}:`, 
        //   pairData ? `${pairData.dexId} with $${pairData.liquidity?.usd} liquidity` : 'None');
        
        // Correctly access liquidity.usd
        const currentLiquidity = pairData?.liquidity?.usd || 0;
        
        // Calculate market cap using data from DexScreener
        const currentMarketCap = pairData?.marketCap || 0;
        
        // Get transaction data
        const txns24h = pairData?.txns?.h24 || { buys: 0, sells: 0 };
        const totalTxns24h = (txns24h.buys || 0) + (txns24h.sells || 0);
        
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
        
        // 估算流动性峰值
        const peakLiquidity = estimatePeakLiquidity(currentLiquidity, (pairData?.priceChange?.h24 || 0) / 100, tokenAge, marketCapRatio);
        
        // 确保流动性峰值至少比当前流动性高10%
        const finalPeakLiquidity = Math.max(peakLiquidity, currentLiquidity * 1.1);
        
        // 获取交易量
        const dailyVolume = pairData?.volume?.h24 || 0;
        
        const result = {
          currentMarketCap: currentMarketCap,
          peakMarketCap: peakMarketCap,
          liquidityUSD: currentLiquidity,
          peakLiquidity: finalPeakLiquidity,
          dailyVolume: dailyVolume,
          priceChange24h: (pairData?.priceChange?.h24 || 0) / 100, // Convert to decimal
          txCount24h: totalTxns24h,
          holders: 0,
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
        
        // console.log(`[blockchainService] Processed data for ${address}:`, {
        //   liquidity: result.liquidityUSD,
        //   marketCap: result.currentMarketCap,
        //   volume: result.dailyVolume
        // });
        
        return result;
      } catch (error) {
        console.error(`[blockchainService] Error fetching Solana data for ${address}:`, error);
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
      // Handle other chains
      return {
        // Default data for other chains
      };
    }
  }
}; 