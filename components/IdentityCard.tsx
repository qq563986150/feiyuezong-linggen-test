import React, { forwardRef } from 'react';
import SpiritRootChart from './SpiritRootChart';

type BorderStyle = 'gold' | 'wood' | 'water' | 'fire' | 'earth';

interface IdentityCardProps {
  name: string;
  gender: string;
  entryDate: string;
  profilePic: string | null;
  borderStyle: BorderStyle;
  spiritRoot: string | null;
  constitution: string;
  description: string;
  backgroundImage: string | null;
  serialNumber: string;
  peak: string;
}

const borderGradients: Record<BorderStyle, string> = {
  gold: 'from-[#FFFFFF] to-[#FFD700]',
  wood: 'from-[#6EE7B7] to-[#16A34A]',
  water: 'from-[#7DD3FC] to-[#0C4A6E]',
  fire: 'from-[#F97316] to-[#991B1B]',
  earth: 'from-[#FBBF24] to-[#78350F]',
};


const IdentityCard = forwardRef<HTMLDivElement, IdentityCardProps>(({ name, gender, entryDate, profilePic, borderStyle, spiritRoot, constitution, description, backgroundImage, serialNumber, peak }, ref) => {
  const gradientClass = borderGradients[borderStyle] || borderGradients.fire;

  const getNameClass = () => {
    const length = (name || '').length;
    if (length <= 3) return 'font-bold text-6xl';
    if (length === 4) return 'font-bold text-5xl';
    if (length <= 6) return 'font-bold text-4xl';
    return 'font-bold text-3xl';
  };


  return (
    <div 
        ref={ref} 
        className={`w-full max-w-[700px] aspect-[7/11] rounded-2xl shadow-2xl p-3 bg-gradient-to-br ${gradientClass}`}
    >
        <div className="w-full h-full bg-slate-900 rounded-lg font-noto-serif text-white relative overflow-hidden">
            {/* Background Image Layer */}
            {backgroundImage && (
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${backgroundImage})` }}
                aria-hidden="true"
              ></div>
            )}
            
            {/* Darkening Overlay - ONLY appears when there is a background image */}
            {backgroundImage && (
              <div 
                className="absolute inset-0 w-full h-full bg-black/50 z-10"
                aria-hidden="true"
              ></div>
            )}

            {/* Content Wrapper */}
            <div className="relative z-20 flex flex-col h-full p-8 text-center">
                {/* Header */}
                <div className="flex flex-col items-center">
                    <svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto -mb-8">
                        <defs>
                            <linearGradient id="cardTitleGold" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#FFFBEB" />
                                <stop offset="50%" stopColor="#FDE047" />
                                <stop offset="100%" stopColor="#B45309" />
                            </linearGradient>
                            <filter id="title-effect" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow x="0" y="0" width="100%" height="100%" dx="3" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.7" result="shadow" />
                                <feGaussianBlur x="0" y="0" width="100%" height="100%" in="SourceAlpha" stdDeviation="5" result="blur" />
                                <feFlood x="0" y="0" width="100%" height="100%" floodColor="#F59E0B" result="color" />
                                <feComposite x="0" y="0" width="100%" height="100%" in="color" in2="blur" operator="in" result="glow" />
                                <feMerge>
                                    <feMergeNode in="shadow" />
                                    <feMergeNode in="glow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                             <filter id="inner-blue-glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur x="0" y="0" width="100%" height="100%" stdDeviation="1.5" />
                            </filter>
                        </defs>
                        <g filter="url(#title-effect)">
                            {/* Blue inner glow/circuit effect */}
                            <text
                                x="50%" y="58%"
                                dominantBaseline="middle" textAnchor="middle"
                                className="font-maoken text-9xl tracking-wide"
                                fill="none"
                                stroke="#0ea5e9"
                                strokeWidth="2"
                                opacity="0.8"
                                filter="url(#inner-blue-glow)"
                            >
                              绯月宗
                            </text>
                        
                            {/* Main gold text */}
                            <text
                                x="50%" y="58%"
                                dominantBaseline="middle" textAnchor="middle"
                                fill="url(#cardTitleGold)"
                                className="font-maoken text-9xl tracking-wide"
                                stroke="#a16207" 
                                strokeWidth="1.5"
                            >
                                绯月宗
                            </text>
                        </g>
                    </svg>
                    <div className="w-full flex items-center justify-center gap-4 mt-2 px-4">
                      <svg width="100" height="20" viewBox="0 0 100 20" className="flex-grow"><path d="M100 10 C 70 10, 30 10, 0 10" stroke="url(#lineGradLeft)" strokeWidth="2" fill="none"/></svg>
                      <p 
                        className="text-xl text-amber-200 font-noto-serif tracking-widest flex-shrink-0 whitespace-nowrap"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}
                      >
                        血月降临·万法归一
                      </p>
                      <svg width="100" height="20" viewBox="0 0 100 20" className="flex-grow"><path d="M0 10 C 30 10, 70 10, 100 10" stroke="url(#lineGradRight)" strokeWidth="2" fill="none"/></svg>
                      <defs>
                        <linearGradient id="lineGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="100%" stopColor="rgba(252, 211, 77, 0.8)" />
                        </linearGradient>
                        <linearGradient id="lineGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(252, 211, 77, 0.8)" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </div>
                </div>

                {/* Profile Picture */}
                <div className="flex justify-center mt-4">
                    <div className={`w-64 h-64 rounded-full p-2 bg-gradient-to-br ${gradientClass} shadow-inner`}>
                        <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                            {profilePic ? (
                                <div 
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage: `url(${profilePic})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                    role="img"
                                    aria-label="Profile"
                                ></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>

                {/* Core Info Panel */}
                <div className="flex-grow flex flex-col items-center justify-center mt-4">
                    <div className="w-full bg-black/30 backdrop-blur-sm rounded-t-[50px] rounded-b-[20px] p-4 flex flex-col items-center space-y-2">
                        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                           {peak && peak !== '未分配' && (
                             <span className="justify-self-end bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 text-xl font-zcool text-amber-100 border border-white/20">
                               {peak}
                             </span>
                           )}
                           <h3 className={`col-start-2 ${getNameClass()}`}>{name || '待书'}</h3>
                        </div>
                        <div className="w-full h-32 flex items-center justify-center">
                           <SpiritRootChart spiritRoot={spiritRoot} />
                        </div>
                        <span className="font-bold text-4xl text-amber-300" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>{spiritRoot || '灵根未测'}</span>
                        <span className="font-zcool text-3xl text-cyan-300" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>{constitution || '凡体'}</span>
                        <span className="text-lg text-gray-400 mt-2 h-16 flex items-center text-center px-4">{description}</span>
                    </div>
                </div>
                
                {/* Serial Number */}
                <div className="w-full text-center mt-auto">
                    <p className="inline-block bg-black/30 backdrop-blur-sm rounded-t-[20px] rounded-b-[20px] px-4 py-2 text-2xl text-amber-400 font-mono tracking-widest opacity-75">
                        {serialNumber}
                    </p>
                </div>

                {/* Footer Details */}
                <div className="w-full bg-black/30 backdrop-blur-sm rounded-b-[50px] rounded-t-[20px] p-4 mt-2 flex justify-between items-center text-2xl font-zcool">
                    <div className="whitespace-nowrap w-1/2 text-left pl-4">
                        <span className="text-gray-300 mr-4">性别:</span>
                        <span className="text-gray-100">{gender || '未知'}</span>
                    </div>
                    <div className="whitespace-nowrap w-1/2 text-right pr-4">
                        <span className="text-gray-300 mr-4">入宗日期:</span>
                        <span className="text-gray-100">{entryDate || '吉日'}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
});

export default IdentityCard;