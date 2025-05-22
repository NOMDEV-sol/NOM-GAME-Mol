"use client";

import React from 'react';

const Tokenomics = () => {
  // Tokenomics data
  const tokenDistribution = [
    { name: 'Liquidity Pool', value: 40, color: '#4F46E5' },
    { name: 'Community Airdrops', value: 30, color: '#10B981' },
    { name: 'Burn Mechanism Fund', value: 20, color: '#EF4444' },
    { name: 'Development', value: 10, color: '#F59E0B' },
  ];

  // Burn mechanism data
  

  return (
    <section className="w-full min-h-screen bg-white dark:bg-gray-900 pt-20" id="tokenomics-section">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-16 text-gray-800 dark:text-white">
          NOM Tokenomics
        </h2>

        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Total Supply</h3>
            <p className="text-2xl sm:text-3xl font-bold">1,000,000,000</p>
            <p className="mt-2 text-sm sm:text-base text-purple-200">Fixed supply, no minting function</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Deflationary</h3>
            <p className="text-2xl sm:text-3xl font-bold">No Tax</p>
            <p className="mt-2 text-sm sm:text-base text-green-200">Burn will not be relied on the tax.</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-4 sm:p-6 text-white shadow-lg sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">LP Status</h3>
            <p className="text-2xl sm:text-3xl font-bold">Burned</p>
            <p className="mt-2 text-sm sm:text-base text-red-200">Liquidity locked forever, no rug possible</p>
          </div>
        </div>

        {/* Token Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">Token Distribution</h3>
            
            {/* Pie chart visualization */}
            <div className="relative h-64 sm:h-80 flex items-center justify-center">
              <div className="w-48 sm:w-56 h-48 sm:h-56 rounded-full relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {tokenDistribution.map((segment, index) => {
                    // Calculate the start and end angles for the pie slice
                    const startPercent = index > 0 
                      ? tokenDistribution.slice(0, index).reduce((sum, item) => sum + item.value, 0) 
                      : 0;
                    const endPercent = startPercent + segment.value;
                    
                    // Convert percentages to coordinates on the circle
                    const startX = 50 + 50 * Math.cos(2 * Math.PI * (startPercent / 100));
                    const startY = 50 + 50 * Math.sin(2 * Math.PI * (startPercent / 100));
                    const endX = 50 + 50 * Math.cos(2 * Math.PI * (endPercent / 100));
                    const endY = 50 + 50 * Math.sin(2 * Math.PI * (endPercent / 100));
                    
                    // Determine if the arc should be drawn as a large arc (more than 180 degrees)
                    const largeArcFlag = segment.value > 50 ? 1 : 0;
                    
                    // Create the SVG path for the pie slice
                    const path = [
                      `M 50 50`, // Move to center
                      `L ${startX} ${startY}`, // Line to start point
                      `A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc to end point
                      `Z` // Close path
                    ].join(' ');
                    
                    return (
                      <path 
                        key={segment.name}
                        d={path}
                        fill={segment.color}
                      />
                    );
                  })}
                  <circle cx="50" cy="50" r="20" fill="white" className="dark:fill-gray-900" />
                </svg>
              </div>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-4 max-w-sm mx-auto">
              {tokenDistribution.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-sm mr-2 flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-1 text-gray-600 dark:text-gray-400">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-800 dark:text-white">No Revenue Extraction</h3>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
              Unlike most tokens that direct transaction taxes to team wallets or marketing funds, 
              NOM&apos;s entire tax structure is designed for one purpose: <span className="font-bold text-red-500">burning tokens</span>.
            </p>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
              This creates a truly community-owned token where the value accrues to holders through 
              increasing scarcity, not to developers through fee extraction.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">
                &quot;NOM is designed to be the ultimate deflationary meme token - every transaction makes your 
                holdings more valuable through automatic supply reduction.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Burn Mechanism */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Hyperdeflation Engine
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl mb-8">
            <h4 className="text-lg font-bold text-center mb-4 text-purple-600 dark:text-purple-400">
              The Pizza Sharing Rule: NOM Burn Mechanism
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h5 className="font-bold text-gray-800 dark:text-white mb-3">🍕 Core Formula Visualization</h5>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <p><strong>[Total Burn Amount]</strong> = [Value of submitted dead tokens] × [Burn ratio]</p>
                  <p><strong>[Your NOM Reward]</strong> = [Dead token value] × (1 - [Burn ratio])</p>
                  <br />
                  <br />
                  <br />
                  {/* Pizza Visualization */}
                  <div className="mt-4 mb-6 flex flex-col items-center">
                    <div className="relative w-48 h-48">
                      {/* Pizza Base */}
                      <div className="absolute inset-0 rounded-full bg-yellow-200 dark:bg-yellow-700 shadow-inner overflow-hidden">
                        {/* Pizza Texture */}
                        <div className="absolute inset-0 opacity-30">
                          <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-yellow-600 dark:bg-yellow-300"></div>
                          <div className="absolute top-1/3 left-1/2 w-1 h-1 rounded-full bg-yellow-600 dark:bg-yellow-300"></div>
                          <div className="absolute top-2/3 left-1/3 w-1 h-1 rounded-full bg-yellow-600 dark:bg-yellow-300"></div>
                          <div className="absolute top-1/2 left-3/4 w-1 h-1 rounded-full bg-yellow-600 dark:bg-yellow-300"></div>
                          <div className="absolute top-3/4 left-2/3 w-1 h-1 rounded-full bg-yellow-600 dark:bg-yellow-300"></div>
                        </div>
                        
                        {/* Pizza Crust */}
                        <div className="absolute inset-0 rounded-full border-4 border-yellow-400 dark:border-yellow-600"></div>
                        
                        {/* Pizza Slice Divider */}
                        <div className="absolute top-1/2 left-1/2 h-px w-full bg-gray-700 dark:bg-gray-300 transform -translate-y-1/2"></div>
                        
                        {/* Burn Portion (70%) - with pizza-burn-portion class added */}
                        <div id="pizza-burn-portion" className="pizza-burn-portion absolute top-0 right-0 w-[70%] h-full bg-red-500 dark:bg-red-700 opacity-70">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold text-xs sm:text-sm transform rotate-90 whitespace-nowrap">BURNED</span>
                          </div>
                        </div>
                        
                        {/* Reward Portion (30%) - with pizza-reward-portion class added */}
                        <div id="pizza-reward-portion" className="pizza-reward-portion absolute top-0 left-0 w-[30%] h-full bg-green-500 dark:bg-green-700 opacity-70">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold text-xs transform -rotate-90 whitespace-nowrap">YOUR REWARD</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Pizza Labels */}
                      <div className="absolute -top-12 right-0 text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm text-right w-24">
                        <span id="burn-percentage">70</span>% Burned
                      </div>
                      <div className="absolute -top-12 left-0 text-green-600 dark:text-green-400 font-bold text-xs sm:text-sm text-left w-24">
                        <span id="reward-percentage">30</span>% Reward
                      </div>
                    </div>
                    
                    {/* Interactive Slider for Burn Ratio - Fixed to properly update the pizza visualization */}
                    <div className="mt-6 w-full max-w-xs">
                      <label htmlFor="burn-ratio" className="block text-center mb-2 font-medium text-sm">
                        Adjust Burn Ratio: <span id="burn-ratio-value">70%</span>
                      </label>
                      <input 
                        type="range" 
                        id="burn-ratio" 
                        min="60" 
                        max="95" 
                        defaultValue="70"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const rewardValue = 100 - value;
                          
                          // Update the displayed percentages
                          document.getElementById('burn-ratio-value').textContent = `${value}%`;
                          document.getElementById('burn-percentage').textContent = value;
                          document.getElementById('reward-percentage').textContent = rewardValue;
                          
                          // Update the pizza visualization
                          const burnPortion = document.getElementById('pizza-burn-portion');
                          const rewardPortion = document.getElementById('pizza-reward-portion');
                          
                          if (burnPortion && rewardPortion) {
                            burnPortion.style.width = `${value}%`;
                            rewardPortion.style.width = `${rewardValue}%`;
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
                    <p className="italic">Imagine a pizza being cut in two pieces: 60-95% is thrown into a black hole (burned), while 5-40% is given to you as a reward</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h5 className="font-bold text-gray-800 dark:text-white mb-3">🔢 Key Parameters</h5>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <div>
                      <p><strong>Burn Ratio</strong> = 70%-95% (determined by AI based on the &quot;decay level&quot; of dead tokens)</p>
                      <p className="text-xs italic mt-1">Like fruit: the less fresh it is, the less edible portion remains</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <div>
                      <p><strong>Station Owner Reward</strong> = Total burn amount × 5%</p>
                      <p className="text-xs italic mt-1">Regional managers automatically receive a &quot;pizza box fragment&quot; reward</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h5 className="font-bold text-gray-800 dark:text-white mb-3">📉 Scarcity Accelerator</h5>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p><strong>Remaining NOM supply</strong> = Initial supply × (0.9)^number of burns</p>
                  <p className="mt-2 italic">Each burn increases the value of remaining NOM by approximately 10% (similar to limited edition sneakers price appreciation)</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h5 className="font-bold text-gray-800 dark:text-white mb-3">📊 User Benefit Model</h5>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p><strong>Your NOM value</strong> = Holdings × (Total burned/Remaining circulation)</p>
                  <p className="mt-2 italic">When burned NOM exceeds 50% of circulation, your asset value automatically doubles</p>
                </div>
              </div>
            </div>
          </div>
          
          
          
          <div className="mt-8 bg-gradient-to-r from-purple-100 to-red-100 dark:from-purple-900/30 dark:to-red-900/30 p-5 rounded-lg">
            <h5 className="font-bold text-center mb-4 text-gray-800 dark:text-white">💡 Quick Value Guide</h5>
            <p className="text-center text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4">
              Every time you burn $1 worth of dead tokens:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg">
                <p className="font-medium text-gray-800 dark:text-white">You receive</p>
                <p className="text-green-600 dark:text-green-400 font-bold">$0.3-0.5 in NOM</p>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg">
                <p className="font-medium text-gray-800 dark:text-white">Permanently burn</p>
                <p className="text-red-600 dark:text-red-400 font-bold">$0.5-0.7 in NOM</p>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg">
                <p className="font-medium text-gray-800 dark:text-white">Increase NOM value by</p>
                <p className="text-blue-600 dark:text-blue-400 font-bold">~0.8%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Supply Reduction Visualization */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 sm:p-8 shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800 dark:text-white">
            Supply Reduction Over Time
          </h3>
          <div className="relative h-12 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3 sm:mb-4">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full">
              <div className="absolute top-0 left-0 h-full bg-white dark:bg-gray-900 transition-all duration-1000" 
                   style={{ width: '100%', animation: 'reduceWidth 10s ease-in-out infinite alternate' }}>
              </div>
            </div>
            <style jsx>{`
              @keyframes reduceWidth {
                from { width: 100%; }
                to { width: 30%; }
              }
            `}</style>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <span>Launch</span>
            <span>6 Months</span>
            <span>1 Year</span>
            <span>2 Years</span>
          </div>
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300">
              With our hyperdeflationary model, NOM&apos;s circulating supply is projected to decrease by up to 70% 
              within the first two years, creating significant value for long-term holders.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics; 