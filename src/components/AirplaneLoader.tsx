import React, { useEffect, useState } from "react";
import "./AirplaneLoader.css";

interface AirplaneLoaderProps {
  visible: boolean;
  onComplete?: () => void;
}

export default function AirplaneLoader({ visible = true, onComplete }: AirplaneLoaderProps) {
  const [show, setShow] = useState(visible);
  const [animationPhase, setAnimationPhase] = useState<'loading' | 'exiting' | 'completed'>('loading');

  useEffect(() => {
    if (visible) {
      setShow(true);
      setAnimationPhase('loading');
      
      // Start exit animation after 5.5 seconds (just before animation completes)
      const exitTimer = setTimeout(() => {
        setAnimationPhase('exiting');
      }, 5500);

      // Complete animation and hide after full 6 seconds
      const completeTimer = setTimeout(() => {
        setAnimationPhase('completed');
        setShow(false);
        if (onComplete) {
          onComplete();
        }
      }, 6000);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [visible, onComplete]);

  if (!show && animationPhase === 'completed') return null;

  return (
    <div 
      className={`pre-loader loader2 ${
        animationPhase === 'loading' ? "active" : 
        animationPhase === 'exiting' ? "exiting" : "exit"
      }`}
    >
      <div className="loader-inner wdt__start">
        <div className="loader-motion">
          <div className="loader-icon">
            <div className="airplane-container">
              <div className="wdt-planebody">
                <div className="wdt-planetail"></div>
                <div className="wdt-wingleft"></div>
                <div className="wdt-wingright"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}