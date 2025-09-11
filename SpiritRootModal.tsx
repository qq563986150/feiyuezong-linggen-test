import React from 'react';

type TestStatus = 'idle' | 'testing' | 'complete';

interface SpiritRootModalProps {
  isOpen: boolean;
  status: TestStatus;
}

const SpiritRootModal: React.FC<SpiritRootModalProps> = ({ isOpen, status }) => {
  if (!isOpen) return null;

  const getStatusMessage = () => {
    switch (status) {
      case 'testing':
        return '灵力汇聚中，请稍候...';
      case 'complete':
        return '检测完成！';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300">
      <div className="relative flex flex-col items-center justify-center text-center">
        {/* Swirling Particles */}
        <div className="absolute w-96 h-96">
          {Array.from({ length: 20 }).map((_, i) => {
            const duration = 2 + Math.random() * 3;
            const delay = Math.random() * 2;
            const size = 2 + Math.random() * 4;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-teal-400/50"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `swirl-in ${duration}s ease-in-out ${delay}s infinite alternate, swirl-out ${duration}s ease-in-out ${delay + duration}s infinite alternate`
                }}
              />
            );
          })}
        </div>

        {/* New Crystal Data Ball Icon */}
        <div 
          className="relative w-64 h-64 text-teal-300" 
          style={{ animation: `pulse-glow 4s ease-in-out infinite` }}
        >
          <svg viewBox="-55 -55 110 110" fill="currentColor">
            <defs>
              <radialGradient id="crystal-gradient" cx="0.3" cy="0.3" r="0.7">
                <stop offset="0%" stopColor="#cffafe" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.7" />
              </radialGradient>
              <filter id="crystal-glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="0" cy="0" r="50" fill="url(#crystal-gradient)" opacity="0.4" />
            <g stroke="currentColor" fill="none" strokeWidth="1.5" strokeOpacity="0.8" filter="url(#crystal-glow)">
              <path d="M -50 0 A 50 50 0 0 1 50 0" />
              <path d="M -35.35 -35.35 A 50 50 0 0 1 35.35 35.35" />
              <path d="M 0 -50 A 50 50 0 0 1 0 50" />
              <path d="M 35.35 -35.35 A 50 50 0 0 1 -35.35 35.35" />
              <circle cx="0" cy="0" r="38">
                <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="15s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="25" strokeDasharray="4 8">
                <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="20s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>

        {/* Status Message */}
        <p className="mt-8 text-2xl font-zcool text-teal-200 animate-pulse">
          {getStatusMessage()}
        </p>
      </div>
    </div>
  );
};

export default SpiritRootModal;