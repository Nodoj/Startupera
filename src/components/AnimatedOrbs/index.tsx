"use client";

import Image from 'next/image';
import './orbs.css';

const AnimatedOrbs = () => {
  return (
    <div className="orbs-container">
      <div className="orbs-wrapper">
        {/* Large Center Orb */}
        <div className="orb orb-center">
          <div className="orb-inner">
            <div className="orb-glow"></div>
            <div className="orb-logo">
              <Image 
                src="/images/logo/logosphere.svg" 
                alt="Logo" 
                width={80} 
                height={80}
                className="logo-image"
              />
            </div>
          </div>
        </div>

        {/* Orbital Rings - Reversed order so inner rings are on top */}
        <div className="orbit orbit-4">
          {/* Small spheres on orbit 4 */}
          <div className="orbit-sphere sphere-4-1"></div>
          <div className="orbit-sphere sphere-4-2"></div>
          <div className="orbit-sphere sphere-4-3"></div>
        </div>

        <div className="orbit orbit-3">
          {/* Small spheres on orbit 3 */}
          <div className="orbit-sphere sphere-3-1"></div>
          <div className="orbit-sphere sphere-3-2"></div>
        </div>
        
        <div className="orbit orbit-2">
          {/* Small spheres on orbit 2 */}
          <div className="orbit-sphere sphere-2-1"></div>
          <div className="orbit-sphere sphere-2-2"></div>
          <div className="orbit-sphere sphere-2-3"></div>
        </div>
        
        <div className="orbit orbit-1">
          {/* Small spheres on orbit 1 */}
          <div className="orbit-sphere sphere-1-1"></div>
          <div className="orbit-sphere sphere-1-2"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedOrbs;
