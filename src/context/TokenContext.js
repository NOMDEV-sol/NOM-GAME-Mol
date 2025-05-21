"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Import your blockchain service
import { blockchainService } from '../services/blockchainService';

// Create the context
const TokenContext = createContext();

// Custom hook to use the token context
export const useTokens = () => useContext(TokenContext);

// Provider component
export const TokenProvider = ({ children }) => {
  const [tokens, setTokens] = useState([]);
  const [tokensByChain, setTokensByChain] = useState({ Solana: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Function to fetch token data
  const fetchTokenData = async () => {
    try {
      setLoading(true);
      setError(null);
      
    //   console.log("Starting token data fetch...");
      
      // Fetch all tokens from Jupiter API
      const jupiterResponse = await axios.get('https://lite-api.jup.ag/tokens/v1/all', {
        headers: { 'Accept': 'application/json' }
      });
      
    //   console.log("Total tokens from Jupiter API:", jupiterResponse.data.length);
      
      // Filter tokens that have "pump" in their address or are tagged as "meme"
      const filteredTokens = jupiterResponse.data.filter(token => 
        token.address.toLowerCase().includes('pump') || 
        (token.tags && token.tags.includes('meme'))
      );
      
    //   console.log("Filtered tokens:", filteredTokens.length);
      
      if (filteredTokens.length === 0) {
        // console.log("No tokens matched the filter criteria. Showing first 10 tokens instead.");
        // If no tokens match our filter, take the first 10 tokens for testing
        filteredTokens.push(...jupiterResponse.data.slice(0, 10));
      }
      
      // Process Solana tokens
      const processedSolanaTokens = [];
      
      // Process tokens in batches to avoid overwhelming the API
      const batchSize = 3; // Reduced batch size for debugging
      for (let i = 0; i < Math.min(filteredTokens.length, 20); i += batchSize) { // Reduced total tokens for debugging
        const batch = filteredTokens.slice(i, i + batchSize);
        
        // console.log(`Processing batch ${i/batchSize + 1} with ${batch.length} tokens`);
        
        // Process tokens in parallel within each batch
        const batchPromises = batch.map(async (token) => {
          try {
            // console.log(`Processing token: ${token.symbol} (${token.address})`);
            
            // Create token object with basic info
            const tokenObj = {
              name: token.name || token.symbol,
              symbol: token.symbol,
              address: token.address,
              chain: "Solana",
              logoURI: token.logoURI,
              tags: token.tags || [],
              onChainData: {}, // Will be populated later
              socialData: {
                twitterSearchVolume24h: Math.floor(Math.random() * 100),
                telegramMessages24h: Math.floor(Math.random() * 200),
                sentimentData: {
                  positive: Math.random() * 0.4 + 0.1,
                  neutral: Math.random() * 0.3 + 0.2,
                  negative: Math.random() * 0.4 + 0.1
                }
              },
              deathScore: Math.floor(Math.random() * 100),
              recoveryValue: 0.2 // Static 1/5 recovery value
            };
            
            // Get on-chain data
            console.log(`Fetching on-chain data for ${token.address}`);
            const onChainData = await blockchainService.getOnChainData(token.address, "Solana");
            console.log(`On-chain data received for ${token.address}:`, onChainData);
            
            tokenObj.onChainData = onChainData;
            
            // TEMPORARILY RELAXED CRITERIA FOR DEBUGGING
            // Check if token meets our criteria (low liquidity or low volume)
            // const lowLiquidity = onChainData.liquidityUSD < 50000;
            // const lowVolume = onChainData.dailyVolume < 2000;
            
            // // Only add tokens that meet our criteria and have at least $1000 liquidity
            // if ((lowLiquidity || lowVolume)) {
            //   return tokenObj;
            // }
            
            // For debugging, accept all tokens with any liquidity
            // if (onChainData.liquidityUSD > 0) {
            //   console.log(`Token ${token.symbol} accepted with liquidity $${onChainData.liquidityUSD}`);
            //   return tokenObj;
            // } else {
            //   console.log(`Token ${token.symbol} rejected: no liquidity`);
            // }
            
            return null;
          } catch (error) {
            console.error(`Error processing token ${token.address}:`, error);
            return null;
          }
        });
        
        try {
          const batchResults = await Promise.all(batchPromises);
          const validResults = batchResults.filter(token => token !== null);
        //   console.log(`Batch completed. Valid tokens: ${validResults.length}/${batch.length}`);
          
          processedSolanaTokens.push(...validResults);
          
          // Update state after each batch to show progress
          setTokensByChain(prev => ({ ...prev, Solana: [...processedSolanaTokens] }));
          setTokens([...processedSolanaTokens]);
          
          // Add a small delay between batches to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (batchError) {
          console.error("Error processing batch:", batchError);
        }
      }
      
      // Final update
    //   console.log(`Total processed tokens: ${processedSolanaTokens.length}`);
      setTokensByChain({ Solana: processedSolanaTokens });
      setTokens(processedSolanaTokens);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error("Error fetching token data:", error);
      setError("Failed to fetch token data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh token data
  const refreshTokenData = () => {
    fetchTokenData();
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchTokenData();
    
    // Set up a refresh interval (e.g., every 15 minutes)
    const intervalId = setInterval(() => {
      fetchTokenData();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Value to be provided by the context
  const value = {
    tokens,
    tokensByChain,
    loading,
    error,
    lastUpdated,
    refreshTokenData
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
}; 