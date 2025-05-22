"use client";

import React, { useState } from 'react';
import styled from "styled-components";
import { motion } from "framer-motion";
// Remove direct imports for GIFs
// import dumpGif from "../assets/go.gif";
// import buildStation from "../assets/buildstation.gif";
// import pvp from "../assets/pvp.gif";
// import dispose from "../assets/dispose.gif";

// Define public paths to images
const gameImages = {
  dumpGif: '/images/game/go.gif',
  buildStation: '/images/game/buildstation.gif',
  pvp: '/images/game/pvp.gif',
  dispose: '/images/game/dispose.gif'
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3
    }
  }
};

const GameContainer = styled.div`
    width: 100%;
    padding: 2rem 0;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    
    @media (max-width: 768px) {
        padding: 4rem 0;
        width: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
    }
`;

const ContentWrapper = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    gap: 2rem;
    
    @media (max-width: 1024px) {
        width: 95%;
        gap: 1.5rem;
    }
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 3rem;
    }
`;

const LeftSection = styled(motion.div)`
    flex: 1;
    text-align: left;
    display: flex;
    flex-direction: column;
    
    @media (max-width: 768px) {
        width: 100%;
        text-align: center;
    }
`;

const RightSection = styled(motion.div)`
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 1rem;
    max-height: 80vh;
    width: 100%;
    
    @media (max-width: 768px) {
        width: 100%;
        max-width: 90vw;
        margin: 0 auto;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }
    
    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(4, 1fr);
    }
`;

const Heading = styled(motion.h2)`
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #333;
    font-weight: 700;
    
    @media (max-width: 1024px) {
        font-size: 2rem;
    }
    
    @media (max-width: 768px) {
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 480px) {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
`;

const Description = styled(motion.div)`
    font-size: 1.1rem;
    line-height: 1.8;
    color: #666;
    
    @media (max-width: 1024px) {
        font-size: 1rem;
    }
    
    @media (max-width: 768px) {
        font-size: 0.95rem;
        line-height: 1.7;
    }
    
    @media (max-width: 480px) {
        font-size: 0.9rem;
        line-height: 1.6;
    }
`;

const PreHeading = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    color: #8b5cf6;
    
    @media (max-width: 768px) {
        justify-content: center;
        margin-bottom: 0.8rem;
    }
`;

const StepItem = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const StepNumber = styled.div`
    background-color: #8b5cf6;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 12px;
    flex-shrink: 0;
`;

const StepText = styled.div`
    flex: 1;
`;

const Image = styled(motion.img)`
    max-width: 100%;
    max-height: 85%; /* Limit height to prevent overlap with caption */
    border-radius: 8px;
    object-fit: contain;
    opacity: ${props => props.isLoaded ? 1 : 0};
    transition: opacity 0.3s ease-in-out;
    
    @media (max-width: 768px) {
        max-height: 80%;
    }
`;

const Line = styled.div`
    width: 48px;
    height: 3px;
    background-color: #8b5cf6;
`;

const GetStartedText = styled.span`
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    
    @media (max-width: 1024px) {
        font-size: 0.95rem;
    }
    
    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
    
    @media (max-width: 480px) {
        font-size: 0.85rem;
    }
`;

const CTAButton = styled(motion.button)`
    background-color: #8b5cf6;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 2rem;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #7c3aed;
        transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
        margin: 2rem auto 0;
    }
`;

const Game = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section id="game" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            NOM Recycling Game
          </h2>
          <div className="w-20 h-1 bg-purple-600 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Turn your worthless tokens into valuable assets through our innovative recycling game
          </p>
        </div>
        
        <GameContainer className="dark:bg-gray-900 bg-white">
          <ContentWrapper
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <LeftSection variants={fadeInUp}>
              <PreHeading variants={fadeInUp}>
                <Line />
                <GetStartedText>PLAY-TO-EARN</GetStartedText>
              </PreHeading>
              <Heading variants={fadeInUp} className="dark:text-white">Dead Coin Disposal & Recycling</Heading>
              <Description variants={fadeInUp} className="dark:text-gray-300">
                <StepItem>
                  <StepNumber>1</StepNumber>
                  <StepText>Find the Recycle station on the interactive map.</StepText>
                </StepItem>
                <StepItem>
                  <StepNumber>2</StepNumber>
                  <StepText>Select the dead meme coins you want to dispose of.</StepText>
                </StepItem>
                <StepItem>
                  <StepNumber>3</StepNumber>
                  <StepText>Choose reward packages - different tranches of rewards based on token quality.</StepText>
                </StepItem>
                <StepItem>
                  <StepNumber>4</StepNumber>
                  <StepText>Get XP, NOM rewards, and special NFTs for your participation.</StepText>
                </StepItem>
              </Description>
              <CTAButton 
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open("https://github.com/orgs/NomSol/repositories", "_blank")}
              >
                Track development progress by monitoring this GitHub repository
              </CTAButton>
            </LeftSection>
            <RightSection variants={fadeInUp}>
              <div className="relative overflow-hidden rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
                    <Image 
                      src={gameImages.dumpGif} 
                      alt="Find & Go to the recycle station"
                      variants={fadeInUp}
                      onLoad={handleImageLoad}
                      isLoaded={imageLoaded}
                      className="dark:opacity-90"
                      unoptimized={true}
                    />
                  </div>
                  <div className="bg-black bg-opacity-60 text-white text-xs p-2 text-center z-10 mt-auto">
                    Find Station
                  </div>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
                    <Image 
                      src={gameImages.buildStation} 
                      alt="Build the recycle station"
                      variants={fadeInUp}
                      onLoad={handleImageLoad}
                      isLoaded={imageLoaded}
                      className="dark:opacity-90"
                      unoptimized={true}
                    />
                  </div>
                  <div className="bg-black bg-opacity-60 text-white text-xs p-2 text-center z-10 mt-auto">
                    Build Station
                  </div>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
                    <Image 
                      src={gameImages.dispose} 
                      alt="Dispose your dead coins"
                      variants={fadeInUp}
                      onLoad={handleImageLoad}
                      isLoaded={imageLoaded}
                      className="dark:opacity-90"
                      unoptimized={true}
                    />
                  </div>
                  <div className="bg-black bg-opacity-60 text-white text-xs p-2 text-center z-10 mt-auto">
                    Dispose Coins
                  </div>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
                    <Image 
                      src={gameImages.pvp} 
                      alt="PVP to win other's dead coins"
                      variants={fadeInUp}
                      onLoad={handleImageLoad}
                      isLoaded={imageLoaded}
                      className="dark:opacity-90"
                      unoptimized={true}
                    />
                  </div>
                  <div className="bg-black bg-opacity-60 text-white text-xs p-2 text-center z-10 mt-auto">
                    PVP Battles
                  </div>
                </div>
              </div>
            </RightSection>
          </ContentWrapper>
        </GameContainer>
{/*         
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Real-time Rewards</h3>
            <p className="text-gray-600 dark:text-gray-300">Instantly receive NOM tokens as you recycle dead coins, with transparent reward calculations.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Secure Transactions</h3>
            <p className="text-gray-600 dark:text-gray-300">All recycling operations are secured by Solana blockchain, ensuring transparency and immutability.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Deflationary Mechanics</h3>
            <p className="text-gray-600 dark:text-gray-300">Every recycling action burns NOM tokens, creating a deflationary pressure that increases token value over time.</p>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Game; 