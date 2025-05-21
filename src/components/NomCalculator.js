"use client";

import React, { useState, useEffect } from 'react';

const NomCalculator = () => {
  const [inputValue, setInputValue] = useState(300);
  const [exchangeRate, setExchangeRate] = useState(6.3);
  const [isCrossChain, setIsCrossChain] = useState(true);
  const [crossChainMultiplier, setCrossChainMultiplier] = useState(3); // Cross-chain multiplier (up to 3x)
  const [marketCapBelow50M, setMarketCapBelow50M] = useState(true); // Assuming market cap < 50M
  
  // Calculated values
  const [nomReceived, setNomReceived] = useState(0);
  const [instantBurn, setInstantBurn] = useState(0);
  const [liquidityBuyback, setLiquidityBuyback] = useState(0);
  const [burnPool, setBurnPool] = useState(0);
  const [extraDeflationTax, setExtraDeflationTax] = useState(0);
  const [crossChainBonus, setCrossChainBonus] = useState(0);
  const [totalBurn, setTotalBurn] = useState(0);
  const [circulationDecrease, setCirculationDecrease] = useState(0);
  const [burnAcceleration, setBurnAcceleration] = useState(0);
  const [priceSupport, setPriceSupport] = useState(0);
  const [burnProgressWidth, setBurnProgressWidth] = useState(0);
  
  // Calculate all values when input changes
  useEffect(() => {
    // Basic calculations
    const baseNomReceived = inputValue * exchangeRate;
    setNomReceived(baseNomReceived);
    
    // Transaction tax calculations (4% total)
    const txValue = baseNomReceived;
    const instantBurnAmount = txValue * 0.02; // 2% instant burn
    setInstantBurn(instantBurnAmount);
    
    const liquidityBuybackAmount = txValue * 0.01; // 1% liquidity buyback
    setLiquidityBuyback(liquidityBuybackAmount);
    
    const burnPoolAmount = txValue * 0.01; // 1% burn pool
    setBurnPool(burnPoolAmount);
    
    // Extra deflation tax when market cap < 50M
    const extraTaxAmount = marketCapBelow50M ? txValue * 0.02 : 0; // 2% extra burn tax
    setExtraDeflationTax(extraTaxAmount);
    
    // Cross-chain bonus
    const crossChainBonusAmount = isCrossChain ? inputValue * crossChainMultiplier : 0;
    setCrossChainBonus(crossChainBonusAmount);
    
    // Total burn calculation
    const totalBurnAmount = instantBurnAmount + burnPoolAmount + extraTaxAmount + crossChainBonusAmount;
    setTotalBurn(totalBurnAmount);
    
    // Effects calculations
    setCirculationDecrease((totalBurnAmount / 1000000000) * 100);
    setBurnAcceleration(totalBurnAmount / 100);
    setPriceSupport((totalBurnAmount / 1000000000) * 0.001);
    
    // Progress bar width calculation (capped at 100%)
    setBurnProgressWidth(Math.min((totalBurnAmount / 1e7) * 100, 100));
  }, [inputValue, exchangeRate, isCrossChain, crossChainMultiplier, marketCapBelow50M]);
  
  return (
    <div className="w-screen p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        🐍 Shitcoin to $NOM Conversion Calculator
      </h3>

      <div className="space-y-4">
        {/* Input field */}
        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
          <div className="mb-4">
            <label htmlFor="usdtInput" className="block text-sm font-medium mb-1">
              Enter USDT value of your shitcoins:
            </label>
            <div className="flex">
              <input
                id="usdtInput"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(Math.max(0, Number(e.target.value)))}
                className="w-full p-2 border rounded-l-lg dark:bg-gray-800 dark:border-gray-600"
              />
              <span className="bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-r-lg flex items-center">
                USDT
              </span>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <input
              id="crossChainCheckbox"
              type="checkbox"
              checked={isCrossChain}
              onChange={(e) => setIsCrossChain(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="crossChainCheckbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Cross-chain conversion (3x burn boost)
            </label>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">🔥 Your Input</span>
            <span className="text-sm text-gray-500">{inputValue} USDT Shitcoin</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">🎁 NOM Received</span>
            <div>
              <span className="text-green-500">{nomReceived.toFixed(0)} NOM</span>
              <span className="text-xs ml-2">(Base rate 1:{exchangeRate})</span>
            </div>
          </div>
        </div>

        {/* Burn effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
            <h4 className="font-semibold mb-2">🔥 Burn Mechanism</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>2% Instant Burn</span>
                <span className="font-mono">{instantBurn.toFixed(0)} NOM</span>
              </div>
              <div className="flex justify-between">
                <span>1% Burn Pool</span>
                <span className="font-mono">{burnPool.toFixed(0)} NOM</span>
              </div>
              <div className="flex justify-between">
                <span>1% Liquidity Buyback</span>
                <span className="font-mono">{liquidityBuyback.toFixed(0)} NOM</span>
              </div>
              {marketCapBelow50M && (
                <div className="flex justify-between">
                  <span>Extra Deflation Tax (2%)</span>
                  <span className="font-mono">{extraDeflationTax.toFixed(0)} NOM</span>
                </div>
              )}
              {isCrossChain && (
                <div className="flex justify-between">
                  <span>Cross-chain 3x Bonus</span>
                  <span className="font-mono">{crossChainBonus.toFixed(0)} NOM</span>
                </div>
              )}
              <div className="pt-2 border-t border-red-200 dark:border-red-700">
                <div className="flex justify-between font-bold">
                  <span>Total Burn</span>
                  <span>{totalBurn.toFixed(0)} NOM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
            <h4 className="font-semibold mb-2">🚀 Deflation Effect</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Circulation Decrease</span>
                <span className="font-mono">-{circulationDecrease.toFixed(7)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Burn Acceleration</span>
                <span className="font-mono">+{burnAcceleration.toFixed(1)} sec/block</span>
              </div>
              <div className="flex justify-between">
                <span>Price Support</span>
                <span className="font-mono">+{priceSupport.toFixed(7)} ETH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization formula */}
        <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
          <div className="font-mono text-sm">
            <div>Initial Supply: 1,000,000,000 × (1 - </div>
            <div className="pl-4">(<span className="text-red-500">{totalBurn.toFixed(0)}</span> + existing burns)/1B )<sup>n</sup></div>
          </div>
          <div className="mt-2 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full">
            <div 
              className="h-full bg-white rounded-full shadow-lg"
              style={{ width: `${burnProgressWidth}%` }}
            ></div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        * Market cap currently below $50M, triggering additional 2% deflation tax<br/>
        * Each $100 burn increases all holders' wealth by 0.0008%
      </p>
    </div>
  );
};

export default NomCalculator; 