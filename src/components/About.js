"use client";

import React from 'react';
import Image from 'next/image';
import nomSnake from '../assets/nom-hat.png';

const About = () => {
  return (
    <section className="w-full min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-20 text-gray-800 dark:text-white">About NOM</h2>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-sm h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
              <Image 
                src={nomSnake} 
                alt="NOM Snake"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-purple-600 dark:text-purple-400">What is NOM?</h3>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
              NOM is born for one purpose - it eats up all the dead shitcoins 
              in your wallet! Our hungry snake disposes of worthless tokens, 
              protecting your portfolio from the crypto wasteland.
            </p>
            
            <div className="py-8"></div>

<h3 className="text-xl sm:text-2xl font-semibold text-purple-600 dark:text-purple-400">NOM System Architecture</h3>
<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-4">
  <h4 className="text-xl font-bold text-center mb-6">
    AI-Driven for Dead Meme Token Recycling
  </h4>
  
  <div className="mb-8 text-center">
    <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
      NOM operates on a sophisticated system architecture that combines AI technology and an
      interactive real world gamified mechanism to create a sustainable 
      ecosystem for recycling dead meme tokens.
    </p>
  </div>
  
  {/* Architecture Diagram - Interactive Tabs */}
  <div className="mb-10">
    <div className="flex flex-wrap justify-center mb-4 gap-2">
      <button 
        id="ai-tab-btn"
        className="arch-tab-btn px-4 py-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium 
        hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500
        transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
        flex items-center space-x-2 border border-blue-200 dark:border-blue-800"
        onClick={() => {
          document.querySelectorAll('.arch-content').forEach(el => el.classList.add('hidden'));
          document.getElementById('ai-system').classList.remove('hidden');
          document.querySelectorAll('.arch-tab-btn').forEach(el => el.classList.remove('ring-2', 'ring-offset-2'));
          document.getElementById('ai-tab-btn').classList.add('ring-2', 'ring-offset-2');
        }}
      >
        <span className="text-blue-600 dark:text-blue-300">🧠</span>
        <span>AI Processing Agent</span>
      </button>
      
      <button 
        id="map-tab-btn"
        className="arch-tab-btn px-4 py-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium 
        hover:bg-green-200 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500
        transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
        flex items-center space-x-2 border border-green-200 dark:border-green-800"
        onClick={() => {
          document.querySelectorAll('.arch-content').forEach(el => el.classList.add('hidden'));
          document.getElementById('map-system').classList.remove('hidden');
          document.querySelectorAll('.arch-tab-btn').forEach(el => el.classList.remove('ring-2', 'ring-offset-2'));
          document.getElementById('map-tab-btn').classList.add('ring-2', 'ring-offset-2');
        }}
      >
        <span className="text-green-600 dark:text-green-300">🗺️</span>
        <span>Map Gamified System</span>
      </button>
      
      <button 
        id="token-tab-btn"
        className="arch-tab-btn px-4 py-2 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 font-medium 
        hover:bg-orange-200 dark:hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500
        transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
        flex items-center space-x-2 border border-orange-200 dark:border-orange-800"
        onClick={() => {
          document.querySelectorAll('.arch-content').forEach(el => el.classList.add('hidden'));
          document.getElementById('token-system').classList.remove('hidden');
          document.querySelectorAll('.arch-tab-btn').forEach(el => el.classList.remove('ring-2', 'ring-offset-2'));
          document.getElementById('token-tab-btn').classList.add('ring-2', 'ring-offset-2');
        }}
      >
        <span className="text-orange-600 dark:text-orange-300">💰</span>
        <span>Token Economy</span>
      </button>
      
      <button 
        id="user-tab-btn"
        className="arch-tab-btn px-4 py-2 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-medium 
        hover:bg-purple-200 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500
        transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
        flex items-center space-x-2 border border-purple-200 dark:border-purple-800"
        onClick={() => {
          document.querySelectorAll('.arch-content').forEach(el => el.classList.add('hidden'));
          document.getElementById('user-system').classList.remove('hidden');
          document.querySelectorAll('.arch-tab-btn').forEach(el => el.classList.remove('ring-2', 'ring-offset-2'));
          document.getElementById('user-tab-btn').classList.add('ring-2', 'ring-offset-2');
        }}
      >
        <span className="text-purple-600 dark:text-purple-300">👤</span>
        <span>User Participation</span>
      </button>
      
      <button 
        id="station-tab-btn"
        className="arch-tab-btn px-4 py-2 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 font-medium 
        hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500
        transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
        flex items-center space-x-2 border border-red-200 dark:border-red-800"
        onClick={() => {
          document.querySelectorAll('.arch-content').forEach(el => el.classList.add('hidden'));
          document.getElementById('station-system').classList.remove('hidden');
          document.querySelectorAll('.arch-tab-btn').forEach(el => el.classList.remove('ring-2', 'ring-offset-2'));
          document.getElementById('station-tab-btn').classList.add('ring-2', 'ring-offset-2');
        }}
      >
        <span className="text-red-600 dark:text-red-300">🏢</span>
        <span>Disposal Station System</span>
      </button>
      
      <button 
        id="blockchain-tab-btn"
        className="arch-tab-btn px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 font-medium 
        hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500
        transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
        flex items-center space-x-2 border border-indigo-200 dark:border-indigo-800"
        onClick={() => {
          document.querySelectorAll('.arch-content').forEach(el => el.classList.add('hidden'));
          document.getElementById('blockchain-system').classList.remove('hidden');
          document.querySelectorAll('.arch-tab-btn').forEach(el => el.classList.remove('ring-2', 'ring-offset-2'));
          document.getElementById('blockchain-tab-btn').classList.add('ring-2', 'ring-offset-2');
        }}
      >
        <span className="text-indigo-600 dark:text-indigo-300">⛓️</span>
        <span>Blockchain Layer</span>
      </button>
    </div>
    
    {/* Add this helper text */}
    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6 italic">
      Click on any button above to explore different aspects of the NOM system
    </p>
    
    {/* AI System Content */}
    <div id="ai-system" className="arch-content bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
      <h5 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-4">AI Agent Processing Engine</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Token Value Assessment</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              An AI Agent automatically analyzes token metrics, market data, and social signals to determine 
              the true value of dead meme tokens, identifying those with minimal recovery potential.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Recycling Decision Logic</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Algorithms determine which tokens qualify for recycling based on 
              liquidity, trading volume, holder distribution, and market sentiment.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Exchange Ratio Calculation</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              The system calculates fair exchange rates for dead tokens to NOM, 
              ensuring users receive appropriate value while maintaining ecosystem balance.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Data Collection & Analysis</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Agent continuously monitors of on-chain data, market trends, and social metrics 
              to improve assessment accuracy and adapt to changing market conditions.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Model Optimization</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Self-improving AI models that learn from transaction history and market 
              responses to refine token valuation and exchange rate calculations.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Market Dynamics Adjustment</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Real-time adjustments to recycling parameters based on NOM token price, 
              market liquidity, and overall ecosystem health.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Map Game System Content */}
    <div id="map-system" className="arch-content hidden bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
      <h5 className="text-lg font-bold text-green-700 dark:text-green-300 mb-4">Map Game Interaction System</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-green-600 dark:text-green-400 mb-2">Recycling Station Map Interface</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Interactive global map showing recycling stations where users can exchange 
              their dead tokens, with real-time status and activity indicators.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-green-600 dark:text-green-400 mb-2">User Interaction Module</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Intuitive interface for users to locate stations, submit tokens, track 
              recycling and walking-to-station history, and claim rewards through gamified experiences.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-green-600 dark:text-green-400 mb-2">Station Management Panel</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Tools for station owners to monitor activity, adjust parameters, and 
              optimize operations within their assigned territories.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-green-600 dark:text-green-400 mb-2">Regional Governance System</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Decentralized governance mechanisms allowing station owners to collaborate 
              on regional strategies and participate in ecosystem decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Token Economy Content */}
    <div id="token-system" className="arch-content hidden bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
      <h5 className="text-lg font-bold text-orange-700 dark:text-orange-300 mb-4">Token Economy System</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-orange-600 dark:text-orange-400 mb-2">NOM Token Distribution</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Strategic allocation of NOM tokens across user rewards, station owner incentives, 
              ecosystem development, and liquidity provisions to ensure sustainable growth.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-orange-600 dark:text-orange-400 mb-2">Token Burning Mechanism</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Automated burning of NOM tokens during recycling transactions, creating 
              deflationary pressure and increasing scarcity over time.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-orange-600 dark:text-orange-400 mb-2">Station Owner Revenue</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Revenue sharing model that rewards station owners with a percentage of 
              recycling ecosystem growth, aligned with performance metrics.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-orange-600 dark:text-orange-400 mb-2">Deflationary Model</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Economic design that reduces NOM supply over time through burning mechanisms, 
              creating natural price support and rewarding long-term holders.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    {/* User Participation Content */}
    <div id="user-system" className="arch-content hidden bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
      <h5 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-4">User Participation System</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-purple-600 dark:text-purple-400 mb-2">User Registration & Login</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Seamless onboarding with wallet connection, profile creation, and 
              personalized dashboard setup for tracking recycling activities.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Token Submission Interface</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              User-friendly interface for submitting dead tokens, viewing exchange rates, 
              and completing recycling transactions with minimal friction.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-purple-600 dark:text-purple-400 mb-2">User Dashboard</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Comprehensive dashboard showing recycling history, rewards earned, 
              station interactions, and personalized recommendations.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Points System</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Gamified points system rewarding active participation, with tiers, 
              achievements, and special privileges for consistent contributors.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Airdrop Reward Mechanism</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Strategic airdrops of NOM tokens to active users based on recycling volume, 
              frequency, and ecosystem contributions.
            </p>
          </div>
          
        </div>
      </div>
    </div>
    
    {/* Station Owner System Content */}
    <div id="station-system" className="arch-content hidden bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
      <h5 className="text-lg font-bold text-red-700 dark:text-red-300 mb-4">Recycling Station Owner System</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-red-600 dark:text-red-400 mb-2">Owner Application & Verification</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Structured process for applying to become a station owner, with verification 
              steps, NOM staking requirements, and capability assessment.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-red-600 dark:text-red-400 mb-2">Regional Management Rights</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Territorial rights assigned to station owners, with defined boundaries, 
              responsibilities, and performance expectations.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-red-600 dark:text-red-400 mb-2">Revenue Dashboard</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Detailed analytics on station performance, revenue generation, user activity, 
              and comparative metrics against other regions.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-red-600 dark:text-red-400 mb-2">Strategy Adjustment Panel</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Tools for station owners to adjust parameters, implement marketing strategies, 
              and optimize operations to maximize recycling volume and revenue.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Blockchain Layer Content */}
    <div id="blockchain-system" className="arch-content hidden bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
      <h5 className="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-4">Blockchain Interaction Layer</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Solana Chain Integration</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Seamless integration with Solana blockchain for high-throughput, low-cost 
              transactions, enabling efficient token recycling at scale.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Smart Contract Calls</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Optimized smart contract architecture for token exchanges, burning mechanisms, 
              reward distributions, and governance functions.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h6 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">On-chain Data Storage</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Efficient on-chain storage of critical transaction data, ownership records, 
              and system parameters, with off-chain solutions for extended analytics.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h6 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Transaction Verification</h6>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Robust verification mechanisms ensuring transaction integrity, preventing 
              fraud, and maintaining system security across all operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {/* System Integration Visualization */}
  <div className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h5 className="text-lg font-bold text-center mb-6">System Integration Flow</h5>
    
    <div className="relative flex flex-col items-center">
      {/* Flow diagram with animated connections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-lg text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-xl">🧠</span>
          </div>
          <h6 className="font-bold text-blue-700 dark:text-blue-300">AI Agent Engine</h6>
        </div>
        
        <div className="bg-purple-100 dark:bg-purple-900/40 p-4 rounded-lg text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-xl">👤</span>
          </div>
          <h6 className="font-bold text-purple-700 dark:text-purple-300">User System</h6>
        </div>
        
        <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-xl">🗺️</span>
          </div>
          <h6 className="font-bold text-green-700 dark:text-green-300">Map System</h6>
        </div>
        
        <div className="bg-orange-100 dark:bg-orange-900/40 p-4 rounded-lg text-center">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-xl">💰</span>
          </div>
          <h6 className="font-bold text-orange-700 dark:text-orange-300">Token Economy</h6>
        </div>
        
        <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-lg text-center">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-xl">🏢</span>
          </div>
          <h6 className="font-bold text-red-700 dark:text-red-300">Station Owners</h6>
        </div>
        
        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-lg text-center">
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-xl">⛓️</span>
          </div>
          <h6 className="font-bold text-indigo-700 dark:text-indigo-300">Blockchain</h6>
        </div>
      </div>
      
      {/* Animated connection lines would be added with CSS/JS in a real implementation */}
    </div>
    
    <div className="mt-8 text-center">
      <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
        All components work together in a seamless ecosystem, creating a sustainable 
        platform for recycling dead meme tokens while generating value for all participants.
      </p>
    </div>
  </div>
  
  {/* Call to Action */}
  <div className="mt-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center">
    <h5 className="text-xl font-bold text-white mb-4">Ready to Recycle Your Dead Meme Tokens?</h5>
    <p className="text-white/90 mb-6 max-w-2xl mx-auto">
      Join the NOM ecosystem today and transform your worthless tokens into something valuable. 
      Early adopters benefit the most from our deflationary model.
    </p>
    <button className="bg-white text-purple-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors">
      Connect Wallet to Start
    </button>
  </div>
</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 