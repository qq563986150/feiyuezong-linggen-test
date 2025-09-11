import React from 'react';

// --- Sigil Paths (Evolved & More Complex) ---
const sigils: Record<string, string> = {
  // Primal Rune sigils for the five core elements
  gold: "M-10,0 L0,-4 L10,0 L0,4 Z", // Used as a base for the blade animation
  wood: "M0,-10 L-2,-8 L-1,0 L-2,8 L0,10 L2,8 L1,0 L2,-8 Z", // Used as a base for the leaf animation
  water: "M-12,0 C-12,-10 0,-10 0,0 C0,10 -12,10 -12,0 Z", // Used as a base for the vortex
  fire: "M0,-12 L-6,0 L0,12 L6,0 Z", // Used as a base for the lotus
  earth: "M-10,0 L-5,-8.66 L5,-8.66 L10,0 L5,8.66 L-5,8.66 Z", // Hexagonal Seal base
  
  // Unchanged special sigils
  ice: "M0,-15 V15 M-13,-7.5 L13,7.5 M-13,7.5 L13,-7.5 M-2,-13 L0,-15 L2,-13 M-2,13 L0,15 L2,13 M-11.5,-8.5 L-13,-7.5 L-11.5,-6.5 M11.5,8.5 L13,7.5 L11.5,6.5 M-11.5,6.5 L-13,7.5 L-11.5,8.5 M11.5,-6.5 L13,-7.5 L11.5,-8.5",
  wind: "M-15,10 C0,0 15,10 15,10 M-15,0 C0,-10 15,0 15,0 M-15,-10 C0,-20 15,-10 15,-10",
  lightning: "M-2,-15 L-7,-3 H0 L-5,5 H5 L0,15",
  dark: "M0,0 C10,0 10,10 0,10 C-10,10 -10,0 0,0 Z M0,0 C5,0 5,5 0,5 C-5,5 -5,0 0,0 Z M0,0 C15,0 15,15 0,15 C-15,15 -15,0 0,0 Z"
};

const sigilElements = ['金', '木', '水', '火', '土'];
const elementToKey: Record<string, string> = { '金': 'gold', '木': 'wood', '水': 'water', '火': 'fire', '土': 'earth' };
const rareElementToKey: Record<string, string> = { '冰': 'ice', '风': 'wind', '雷': 'lightning', '暗': 'dark' };

const colors: Record<string, string> = {
    gold: '#FFD700', wood: '#22C55E', water: '#3B82F6', fire: '#EF4444', earth: '#A16207',
    ice: '#67E8F9', wind: '#94A3B8', lightning: '#A855F7', dark: '#4B0082',
    hidden: '#E5E7EB'
};

interface SpiritRootChartProps {
  spiritRoot: string | null;
}

const parseSpiritRoot = (root: string | null) => {
    if (!root) return { type: '未知', elements: [], rareElement: null, rawElements: '' };
    const typeMatch = root.match(/^(天|变异|隐|真|伪)灵根/);
    const elementsMatch = root.match(/\(([^)]+)\)/);
    
    if (!typeMatch || !elementsMatch) {
      return { type: '未知', elements: [], rareElement: null, rawElements: '' };
    }
  
    const type = typeMatch[1];
    const rawElements = elementsMatch[1];
    let elements: string[] = [];
    let rareElement: string | null = null;
  
    if (type === '隐' || type === '变异') {
      const cleanedElement = rawElements.replace('隐', '');
      rareElement = rareElementToKey[cleanedElement] || null;
    } else {
      elements = rawElements.split('、');
    }
  
    return { type, elements, rareElement, rawElements };
};

// --- START: Thematic "Circle Frame" Element Animations ---
const ThematicElementAnimation = ({ element, color }: { element: string, color: string }) => {
    const commonCircle = (
        <circle cx="0" cy="0" r="12" fill="none" stroke={color} strokeWidth="1.5">
            <animate attributeName="r" values="12;13;12" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" />
        </circle>
    );

    switch (element) {
        case '金': // Gold: Radiant Star
            return (
                <g>
                    {commonCircle}
                    <path d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z" fill={color}>
                        <animateTransform attributeName="transform" type="scale" values="1;0.9;1" dur="3s" repeatCount="indefinite" />
                    </path>
                </g>
            );
        case '木': // Wood: Sprouting Life
            return (
                <g>
                    {commonCircle}
                    <path d="M0,8 L0,-1 M-6,-2 C-2,-2 0,-7 0,-7 C0,-7 2,-2 6,-2" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round">
                        <animate attributeName="d" values="M0,8 L0,-1 M-6,-2 C-2,-2 0,-7 0,-7 C0,-7 2,-2 6,-2; M0,8 L0,-2 M-7,-3 C-2,-3 0,-8 0,-8 C0,-8 2,-3 7,-3; M0,8 L0,-1 M-6,-2 C-2,-2 0,-7 0,-7 C0,-7 2,-2 6,-2" dur="2.5s" repeatCount="indefinite" />
                    </path>
                </g>
            );
        case '水': // Water: Rhythmic Tides
            return (
                <g>
                    {commonCircle}
                    <g stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round">
                        <path d="M-8,-3 C-4,1 4,-7 8,-3">
                            <animate attributeName="d" values="M-8,-3 C-4,1 4,-7 8,-3; M-8,-3 C-4,-3 4,1 8,-3; M-8,-3 C-4,1 4,-7 8,-3" dur="2s" repeatCount="indefinite" />
                        </path>
                        <path d="M-8,3 C-4,7 4,-1 8,3">
                            <animate attributeName="d" values="M-8,3 C-4,7 4,-1 8,3; M-8,3 C-4,3 4,7 8,3; M-8,3 C-4,7 4,-1 8,3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                        </path>
                    </g>
                </g>
            );
        case '火': // Fire: Living Flame
            return (
                <g>
                    {commonCircle}
                    <path d="M0,8 C-8,0 -3,-8 0,-8 C3,-8 8,0 0,8 Z" fill={color}>
                        <animate attributeName="d" values="M0,8 C-8,0 -3,-8 0,-8 C3,-8 8,0 0,8 Z; M0,8 C-7,1 -4,-7 0,-9 C4,-7 7,1 0,8 Z; M0,8 C-8,0 -3,-8 0,-8 C3,-8 8,0 0,8 Z" dur="0.8s" repeatCount="indefinite" />
                    </path>
                </g>
            );
        case '土': // Earth: Mountain Root
            return (
                <g>
                    {commonCircle}
                    <g stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round">
                        <path d="M-8,6 L-4,-2 L0,4 L4,-4 L8,6 M-8,6 H8">
                            <animate attributeName="transform" values="translate(0,0); translate(0,-0.5); translate(0,0)" dur="4s" repeatCount="indefinite" />
                        </path>
                    </g>
                </g>
            );
        default:
            return null;
    }
};
// --- END: Thematic "Circle Frame" Element Animations ---


const SpiritRootChart: React.FC<SpiritRootChartProps> = ({ spiritRoot }) => {
  if (!spiritRoot || spiritRoot === '灵根未测') {
    return (
      <div className="flex items-center justify-center h-full text-gray-500" title="灵根未测">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  }

  const { type, elements, rareElement } = parseSpiritRoot(spiritRoot);
  
  // --- Heavenly Animation ---
  const renderHeavenlyAnimation = (activeElement: string) => {
    const key = elementToKey[activeElement];
    if (!key) return null;
    const color = colors[key];
    const angle = (sigilElements.indexOf(activeElement) * 360) / 5 - 90;
    const x2 = 50 * Math.cos(angle * Math.PI / 180);
    const y2 = 50 * Math.sin(angle * Math.PI / 180);

    return (
        <g>
            <circle cx="0" cy="0" r="60" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="10 5">
                 <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="30s" repeatCount="indefinite" />
            </circle>
            <path d={sigils[key]} transform="scale(0.7)" fill={color} style={{ filter: `url(#glow)` }}>
                 <animateTransform attributeName="transform" type="scale" values="0.7;0.8;0.7" dur="2s" repeatCount="indefinite" />
            </path>
            <line x1="0" y1="0" x2={x2} y2={y2} stroke={color} strokeWidth="1.5" style={{ filter: `url(#glow)` }}>
                 <animate attributeName="stroke-dasharray" values="4 4; 8 8; 4 4" dur="2s" repeatCount="indefinite" />
                 <animate attributeName="stroke-dashoffset" values="0;16" dur="1s" repeatCount="indefinite" />
            </line>
        </g>
    );
  };
  
  // --- Base Chart for True/False roots ---
  const renderWuxingFormation = (formationType: '真' | '伪', activeElements: string[]) => {
      const points = sigilElements.map((el, i) => {
        const angle = (i * 360) / 5 - 90;
        return {
            el,
            x: 50 * Math.cos((angle * Math.PI) / 180),
            y: 50 * Math.sin((angle * Math.PI) / 180),
        };
      });

      const activePoints = points.filter(p => activeElements.includes(p.el));

      let connectionPath = '';
      if (activePoints.length > 1) {
          connectionPath = 'M' + activePoints.map(p => `${p.x} ${p.y}`).join(' L ');
          if (activePoints.length > 2) {
              connectionPath += ' Z'; // Close the path for 3+ elements
          }
      }

      return (
        <g>
            {/* Connection lines */}
            {connectionPath && (
                <path
                    d={connectionPath}
                    fill="none"
                    stroke={formationType === '真' ? '#FBBF24' : '#F97316'}
                    strokeWidth={formationType === '真' ? '2.5' : '1.5'}
                    strokeOpacity="0.8"
                    strokeDasharray={formationType === '伪' ? '6 4' : 'none'}
                    style={{filter: 'url(#glow)'}}
                >
                    {formationType === '伪' && (
                        <animate attributeName="stroke-dashoffset" values="0;20" dur="1s" repeatCount="indefinite" />
                    )}
                </path>
            )}

            {/* Sigils */}
            {points.map(({ el, x, y }) => {
                const isActive = activeElements.includes(el);
                const color = colors[elementToKey[el]];

                return (
                    <g key={el} transform={`translate(${x}, ${y})`}>
                        {/* Thematic Element Animation */}
                        {isActive ? (
                            <ThematicElementAnimation element={el} color={color} />
                        ) : (
                          // Render a static, inactive sigil
                          <circle cx="0" cy="0" r="12" fill="none" stroke="#4A5568" strokeWidth="1.5" />
                        )}
                        

                        {/* False Root Sparks */}
                        {isActive && formationType === '伪' && (
                            <g fill={color}>
                                {Array.from({length: 3}).map((_, i) => (
                                    <circle key={i} r="1.5">
                                        <animateMotion
                                            path={`M0,0 L${(Math.random()-0.5)*20},${(Math.random()-0.5)*20}`}
                                            dur={`${1 + Math.random()}s`}
                                            begin={`${Math.random()}s`}
                                            repeatCount="indefinite"
                                        />
                                        <animate attributeName="opacity" values="1;0" dur={`${1 + Math.random()}s`} begin={`${Math.random()}s`} repeatCount="indefinite" />
                                    </circle>
                                ))}
                            </g>
                        )}
                    </g>
                );
            })}
            
            {/* True Root Outer Rings */}
            {formationType === '真' && (
                <g>
                    {/* Main outer ring */}
                    <circle cx="0" cy="0" r="65" fill="none" stroke="#FDE044" strokeWidth="1.5" strokeDasharray="2 12" strokeLinecap="round" strokeOpacity="0.7">
                        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="30s" repeatCount="indefinite" />
                    </circle>
                    {/* Additional inner ring for Triple Spirit Roots for distinction */}
                    {activeElements.length === 3 && (
                        <circle cx="0" cy="0" r="25" fill="none" stroke="#FDE044" strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round" strokeOpacity="0.5">
                            <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="25s" repeatCount="indefinite" />
                        </circle>
                    )}
                </g>
            )}
        </g>
      );
  };

  // --- Dynamic Ice Root Animation ---
  const renderIceAnimation = () => {
    const color = colors.ice;
    return (
        <g>
            {/* Main rotating snowflake structure */}
            <g stroke={color} strokeWidth="2" fill="none" style={{ filter: 'url(#glow)' }}>
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="25s" repeatCount="indefinite" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <g key={i} transform={`rotate(${i * 60})`}>
                        <path d="M0,0 L0,-45" />
                        <path d="M0,-15 L10,-20 M0,-15 L-10,-20" />
                        <path d="M0,-30 L8,-35 M0,-30 L-8,-35" />
                    </g>
                ))}
            </g>
            
            {/* Inner counter-rotating shards */}
            <g stroke={color} strokeWidth="1.5" fill="none">
                 <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="18s" repeatCount="indefinite" />
                 {Array.from({ length: 6 }).map((_, i) => (
                    <path key={i} d="M0,-20 L-4,-24 L4,-24 Z" transform={`rotate(${i * 60 + 30})`}/>
                 ))}
            </g>

            {/* Central pulsing sigil */}
            <g style={{ filter: 'url(#glow-strong)' }}>
                <path d={sigils.ice} fill={color} transform="scale(0.8)">
                    <animateTransform attributeName="transform" type="scale" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                </path>
            </g>

            {/* Drifting ice particles */}
            <g fill={color}>
                {Array.from({ length: 8 }).map((_, i) => {
                    const startAngle = Math.random() * 360;
                    const endRadius = 30 + Math.random() * 20;
                    const startPos = `rotate(${startAngle}) translate(10,0)`;
                    const endPos = `rotate(${startAngle}) translate(${endRadius},0)`;
                    return (
                        <circle key={i} r="1.2" transform={startPos}>
                           <animateTransform attributeName="transform" type="translate" from="10" to={`${endRadius}`} dur={`${2+Math.random()*2}s`} begin={`${Math.random()*2}s`} repeatCount="indefinite" additive="sum" />
                           <animate attributeName="opacity" values="0;1;0" dur={`${2+Math.random()*2}s`} begin={`${Math.random()*2}s`} repeatCount="indefinite" />
                        </circle>
                    )
                })}
            </g>
        </g>
    );
  };

  const SpecialRootChart = ({ type, rareElement }: { type: string, rareElement: string | null }) => {
    if (!rareElement) {
        // Fallback for safety, though the calling logic should prevent this.
        return (
            <div className="flex items-center justify-center h-full text-gray-500" title="灵根未测">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        );
    }
    const color = colors[rareElement] || '#FFFFFF';

    if (rareElement === 'ice') return renderIceAnimation();

    const isHiddenDark = spiritRoot?.includes('隐暗');
    if (isHiddenDark) {
      const darkColor = '#60A5FA'; 
      const outerRingColor = '#4c1d95'; 
      return (
        <g>
            <g style={{ filter: 'url(#glow)' }}>
                <circle cx="0" cy="0" r="52" fill="none" stroke={outerRingColor} strokeWidth="6" strokeDasharray="1 25" strokeOpacity="0.8" strokeLinecap="round">
                   <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="22s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="45" fill="none" stroke={outerRingColor} strokeWidth="2" strokeDasharray="6 6" strokeOpacity="0.7">
                   <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="30s" repeatCount="indefinite" />
                </circle>
            </g>
            <g style={{ filter: 'url(#glow-strong)' }}>
                <circle cx="0" cy="0" r="15" fill="none" stroke={darkColor} strokeWidth="2.5">
                    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="25" fill="none" stroke={darkColor} strokeWidth="1.5">
                    <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
            </g>
        </g>
      );
    }

    const defaultSpecialRoot = (
      <g>
          <circle cx="0" cy="0" r="35" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.8" strokeDasharray="5 10">
              <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
          </circle>
           <circle cx="0" cy="0" r="45" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 8">
                <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="15s" repeatCount="indefinite" />
          </circle>
          <g style={{ filter: `url(#glow-strong)` }}>
              <path d={sigils[rareElement]} fill={color} transform="scale(1.2)">
                   <animateTransform attributeName="transform" type="scale" values="1.2;1.4;1.2" dur="1.5s" repeatCount="indefinite" />
              </path>
          </g>
      </g>
    );

    if (type === '隐') {
        const veilRunes = "M0,-4 L2,0 L0,4 L-2,0 Z";
        return (
            <g>
                {defaultSpecialRoot}
                <g>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <g key={i} transform={`rotate(${i * 30}) translate(55, 0) rotate(90)`}>
                            <path d={veilRunes} fill={colors.hidden} opacity="0.7"/>
                        </g>
                    ))}
                    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="-360 0 0" dur="40s" repeatCount="indefinite" />
                </g>
            </g>
        );
    }

    return defaultSpecialRoot;
  };


  return (
    <svg viewBox="-70 -70 140 140" className="w-full h-full">
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>
        
        {(() => {
            switch (type) {
                case '天':
                    return <>{renderWuxingFormation('真', elements)}{renderHeavenlyAnimation(elements[0])}</>;
                case '变异':
                case '隐':
                    return <SpecialRootChart type={type} rareElement={rareElement} />;
                case '真':
                    return renderWuxingFormation('真', elements);
                case '伪':
                    return renderWuxingFormation('伪', elements);
                default:
                    return null; // Should not happen with current logic
            }
        })()}
    </svg>
  );
};

export default SpiritRootChart;