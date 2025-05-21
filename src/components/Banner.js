"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Import dot images
import dot1 from '../assets/dot1.png';
import dot2 from '../assets/dot2.png';
import dot3 from '../assets/dot3.png';
import dot4 from '../assets/dot4.png';
import dot5 from '../assets/dot5.png';

const Banner = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [snakePosition, setSnakePosition] = useState({ x: 100, y: 100 });
  const [snakeBody, setSnakeBody] = useState([]);
  const [dots, setDots] = useState([]);
  const [score, setScore] = useState(0);
  const bannerRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Array of dot images
  const dotImages = [dot1, dot2, dot3, dot4, dot5];
  
  // Initialize dots
  useEffect(() => {
    const generateDots = () => {
      const newDots = [];
      for (let i = 0; i < 12; i++) {
        newDots.push({
          id: i,
          x: Math.random() * (bannerRef.current?.offsetWidth - 20) || 100,
          y: Math.random() * (bannerRef.current?.offsetHeight - 20) || 100,
          imageIndex: Math.floor(Math.random() * dotImages.length)
        });
      }
      setDots(newDots);
    };
    
    if (bannerRef.current) {
      generateDots();
    }
  }, []);
  
  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = bannerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    const banner = bannerRef.current;
    if (banner) {
      banner.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (banner) {
        banner.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  // Snake movement animation
  useEffect(() => {
    const moveSnake = () => {
      // Calculate direction vector
      const dx = mousePosition.x - snakePosition.x;
      const dy = mousePosition.y - snakePosition.y;
      
      // Normalize and scale for speed
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 5;
      
      if (distance > 5) {
        const newX = snakePosition.x + (dx / distance) * speed;
        const newY = snakePosition.y + (dy / distance) * speed;
        
        // Update snake body
        setSnakeBody(prevBody => {
          const newBody = [{ x: snakePosition.x, y: snakePosition.y }, ...prevBody];
          // Limit the body length based on score (minimum 5 segments)
          return newBody.slice(0, Math.max(5, score + 5));
        });
        
        setSnakePosition({ x: newX, y: newY });
      }
      
      // Check for collisions with dots
      setDots(prevDots => {
        let newDots = [...prevDots];
        let scoreIncrement = 0;
        
        newDots = newDots.filter(dot => {
          const dotDistance = Math.sqrt(
            Math.pow(dot.x - snakePosition.x, 2) + 
            Math.pow(dot.y - snakePosition.y, 2)
          );
          
          if (dotDistance < 20) {
            scoreIncrement++;
            return false;
          }
          return true;
        });
        
        // Add new dots if some were eaten
        if (newDots.length < prevDots.length) {
          for (let i = 0; i < prevDots.length - newDots.length; i++) {
            newDots.push({
              id: Math.random(),
              x: Math.random() * (bannerRef.current?.offsetWidth - 20) || 100,
              y: Math.random() * (bannerRef.current?.offsetHeight - 20) || 100,
              imageIndex: Math.floor(Math.random() * dotImages.length)
            });
          }
          setScore(prev => prev + scoreIncrement);
        }
        
        return newDots;
      });
      
      animationFrameRef.current = requestAnimationFrame(moveSnake);
    };
    
    animationFrameRef.current = requestAnimationFrame(moveSnake);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition, snakePosition, score]);
  
  return (
    <div 
      ref={bannerRef} 
      className="relative w-screen h-[90vh] overflow-hidden m-0 p-0"
      style={{ 
        cursor: 'none',
        margin: 0,
        padding: 0
      }}
    >
      {/* Centered Text Box */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg text-black text-center z-30 w-[40vw] h-[40vh] flex flex-col justify-center animate-fadeIn" 
           style={{ 
             backgroundColor: 'rgba(255, 255, 255, 0.6)',
             animation: 'fadeIn 2.5s ease-out'
           }}>
        <h2 className="text-5xl font-bold mb-2 animate-pulse text-purple-500 glow-text animate-slideDown">NOM!</h2>
        <style jsx>{`
          .glow-text {
            text-shadow: 0 0 10px #a855f7, 0 0 20px #a855f7, 0 0 30px #a855f7;
            animation: glow 1.5s ease-in-out infinite alternate;
          }
          
          @keyframes glow {
            from {
              text-shadow: 0 0 10px #a855f7, 0 0 20px #a855f7;
            }
            to {
              text-shadow: 0 0 15px #a855f7, 0 0 25px #a855f7, 0 0 35px #a855f7;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes slideDown {
            from {
              transform: translateY(-50px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 2.5s ease-out;
          }
          
          .animate-slideDown {
            animation: slideDown 2.5s ease-out;
          }
        `}</style>
        <br/>
        <br/>

        <p>Bought & Hodling Dead Coins? </p>
        <br/>
        <p>NOM NOM! Hedge Risks, Ride the MEME Wave with proection!</p>
        
        {/* Social Media Icons */}
        <div className="flex justify-center mt-6 space-x-4">
          <a href="https://x.com/NOMME_sol" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
            <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
            </svg>
          </a>
          <a href="https://t.me/+lKGrybYSJmk1ZDVl" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.832.953z"></path>
            </svg>
          </a>
        </div>
      </div>
      
      {/* Score display */}
      {/* <div className="absolute top-2 right-2 text-white z-10">
        Score: {score}
      </div> */}
      
      {/* Snake body segments */}
      {snakeBody.map((segment, index) => (
        <div 
          key={index}
          className="absolute rounded-full bg-green-500"
          style={{ 
            left: `${segment.x - 8}px`, 
            top: `${segment.y - 8}px`,
            width: `${16 - index * 0.5}px`,
            height: `${16 - index * 0.5}px`,
            opacity: 1 - (index * 0.02),
            zIndex: 10 - index
          }}
        />
      ))}
      
      {/* Snake head */}
      <div 
        className="absolute z-20"
        style={{ 
          left: `${snakePosition.x - 12}px`, 
          top: `${snakePosition.y - 12}px`,
          transform: `rotate(${Math.atan2(
            mousePosition.y - snakePosition.y,
            mousePosition.x - snakePosition.x
          ) * (180 / Math.PI)}deg)`
        }}
      >
        <div className="w-24 h-24 relative">
          {/* Snake head shape */}
          <div className="absolute w-16 h-16 bg-green-400 rounded-full left-0 top-0"></div>
          {/* Snake eyes */}
          <div className="absolute w-4 h-4 bg-white rounded-full" style={{ left: '4px', top: '4px' }}></div>
          <div className="absolute w-4 h-4 bg-white rounded-full" style={{ left: '4px', top: '12px' }}></div>
          {/* Snake pupils */}
          <div className="absolute w-2 h-2 bg-black rounded-full" style={{ left: '6px', top: '6px' }}></div>
          <div className="absolute w-2 h-2 bg-black rounded-full" style={{ left: '6px', top: '14px' }}></div>
        </div>
      </div>
      
      {/* Dots with random images */}
      {dots.map(dot => (
        <div 
          key={dot.id}
          className="absolute w-12 h-12"
          style={{ 
            left: `${dot.x - 12}px`, 
            top: `${dot.y - 12}px`,
            zIndex: 5
          }}
        >
          <Image 
            src={dotImages[dot.imageIndex]} 
            alt="Dot" 
            width={24} 
            height={24}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default Banner; 