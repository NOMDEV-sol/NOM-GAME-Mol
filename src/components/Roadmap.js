"use client";

import React, { useState } from 'react';

const Roadmap = () => {
  const [activePhase, setActivePhase] = useState(1);
  
  const phases = [
    {
      id: 1,
      title: "Phase 1",
      timeframe: "2-4 Weeks",
      status: "In Progress",
      description: "Token Deployment & Community Building",
      milestones: [
        "Smart contract deployment and audit",
        "Website and social media launch",
        "Community building on Twitter and Telegram",
        "Initial liquidity provision",
        "Meme contest to establish brand identity"
      ],
      icon: "🚀"
    },
    {
      id: 2,
      title: "Phase 2",
      timeframe: "3-4 Weeks",
      status: "Upcoming",
      description: "Burn DApp Launch & First Airdrop",
      milestones: [
        "Launch of NOM burn DApp interface",
        "First community airdrop to early supporters",
        "Marketing campaign focused on the burn mechanism",
      ],
      icon: "🔥"
    },
    {
      id: 3,
      title: "Phase 3",
      timeframe: "5-8 Weeks",
      status: "Planned",
      description: "Cross-Chain Burn Protocol Deployment",
      milestones: [
        "Cross-chain bridge integration",
        "Multi-chain burn verification system",
        "Enhanced burn multiplier implementation",
        "Be ready for Bear or Doom Day's coming campaign"
      ],
      icon: "🌉"
    }
  ];

  return (
    <section className="w-full min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-16 text-gray-800 dark:text-white">
          NOM Development Roadmap
        </h2>

        {/* Phase Navigation */}
        <div className="flex justify-center mb-8 sm:mb-12 overflow-x-auto pb-2">
          <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`px-3 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activePhase === phase.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {phase.title}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Visualization - Desktop */}
        <div className="relative mb-12 hidden sm:block">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2"></div>
          <div className="flex justify-between relative">
            {phases.map((phase) => (
              <div key={phase.id} className="flex flex-col items-center relative">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center z-10 text-xl ${
                    phase.id < activePhase 
                      ? "bg-green-500 text-white" 
                      : phase.id === activePhase 
                        ? "bg-purple-600 text-white ring-4 ring-purple-200 dark:ring-purple-900" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {phase.id < activePhase ? "✓" : phase.icon}
                </div>
                <div className={`mt-2 text-sm font-medium ${
                  phase.id === activePhase ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {phase.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {phase.timeframe}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Visualization - Mobile */}
        <div className="flex justify-center mb-8 sm:hidden">
          <div className="flex flex-col items-center">
            {phases.map((phase) => (
              <div 
                key={phase.id} 
                className={`flex items-center mb-4 ${
                  phase.id === activePhase ? "opacity-100" : "opacity-60"
                }`}
                onClick={() => setActivePhase(phase.id)}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    phase.id < activePhase 
                      ? "bg-green-500 text-white" 
                      : phase.id === activePhase 
                        ? "bg-purple-600 text-white ring-2 ring-purple-200 dark:ring-purple-900" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {phase.id < activePhase ? "✓" : phase.icon}
                </div>
                <div>
                  <div className={`text-sm font-medium ${
                    phase.id === activePhase ? "text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-gray-300"
                  }`}>
                    {phase.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {phase.timeframe}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Phase Details */}
        {phases.map((phase) => (
          <div 
            key={phase.id}
            className={`transition-all duration-500 ${
              activePhase === phase.id ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-0">
                    {phase.title}: {phase.description}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                    phase.status === "Completed" ? "bg-green-500 text-white" :
                    phase.status === "In Progress" ? "bg-yellow-500 text-white" :
                    "bg-gray-200 text-gray-800"
                  }`}>
                    {phase.status}
                  </span>
                </div>
                <p className="text-purple-200 mt-1">{phase.timeframe}</p>
              </div>
              
              <div className="p-4 sm:p-6">
                <h4 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white">Key Milestones</h4>
                <ul className="space-y-3">
                  {phase.milestones.map((milestone, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mt-1 mr-3">
                        <span className="text-purple-600 dark:text-purple-400 text-xs">{index + 1}</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{milestone}</span>
                    </li>
                  ))}
                </ul>
                
                {phase.id === 1 && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <h5 className="font-medium text-green-800 dark:text-green-400">Current Focus</h5>
                    <p className="mt-1 text-green-700 dark:text-green-300 text-sm sm:text-base">
                      Building a strong foundation with community-driven growth and establishing NOM&apos;s unique identity in the meme coin space.
                    </p>
                  </div>
                )}
                
                {phase.id === 2 && (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-400">Technical Development</h5>
                    <p className="mt-1 text-yellow-700 dark:text-yellow-300 text-sm sm:text-base">
                      Our 2 man development team is currently building the burn DApp interface that will allow users to easily participate in the NOM ecosystem. The DApp will be eventually an automated AI Agent who is open-sourced and community-driven on meme coin diagnosis while handling the Nom&apos;s burn mechanism and liquidity. Dev team BuidL only. 
                    </p>
                  </div>
                )}
                
                {phase.id === 3 && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <h5 className="font-medium text-blue-800 dark:text-blue-400">Expansion Strategy</h5>
                    <p className="mt-1 text-blue-700 dark:text-blue-300 text-sm sm:text-base">
                      The cross-chain functionality will dramatically expand NOM&apos;s utility and reach, allowing integration with multiple blockchain ecosystems.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Future Phases */}
        <div className="mt-12 sm:mt-16">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-800 dark:text-white">
            Future Development
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-dashed border-gray-300 dark:border-gray-700">
            <div className="text-center space-y-4">
              <div className="inline-block p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                <span className="text-2xl sm:text-3xl">🔮</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Beyond Phase 3</h4>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Our roadmap will continue to evolve based on community feedback and market conditions. 
                Future developments may include governance mechanisms, additional utility features, 
                and expansion to more blockchain networks.
              </p>
              <div className="pt-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                    href="https://t.me/+lKGrybYSJmk1ZDVl" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-block text-center"
                  >
                    Join Our Community
                  </a>
                  <div className="flex space-x-4 mt-4 sm:mt-0">
                    <a href="https://x.com/NOMME_sol" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                    <a href="https://t.me/+lKGrybYSJmk1ZDVl" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.832.953z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap; 