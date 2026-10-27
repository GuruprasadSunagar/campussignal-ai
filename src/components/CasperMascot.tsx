import React from 'react';

export type CasperMood =
  | 'greeting'
  | 'scanning'
  | 'success'
  | 'deadline-alert'
  | 'unclear'
  | 'idle';

interface CasperMascotProps {
  mood?: CasperMood;
  customMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
}

export const CasperMascot: React.FC<CasperMascotProps> = ({
  mood = 'greeting',
  customMessage,
  size = 'md',
  showSpeechBubble = true,
}) => {
  const getDefaultMessage = (m: CasperMood): string => {
    switch (m) {
      case 'greeting':
        return "Boo! I'm Casper, your Haunted Campus guide. Let's uncover your next opportunity!";
      case 'scanning':
        return 'Your notice is being examined by Gemma 4... Looking through the mist!';
      case 'success':
        return 'Opportunity discovered! Important details extracted from the shadows.';
      case 'deadline-alert':
        return "Deadline warning: Don't let this opportunity disappear into the darkness!";
      case 'unclear':
        return "The notice doesn't reveal this detail. Let's verify it before proceeding!";
      case 'idle':
      default:
        return 'Ready to inspect college posters, circulars, and notices.';
    }
  };

  const message = customMessage || getDefaultMessage(mood);

  const sizeDimensions = {
    sm: { width: 50, height: 55, container: 'w-12 h-14' },
    md: { width: 75, height: 85, container: 'w-20 h-24' },
    lg: { width: 100, height: 115, container: 'w-28 h-32' },
  }[size];

  // Mascot SVG expression based on mood
  const getEyeExpression = () => {
    switch (mood) {
      case 'scanning':
        return (
          <>
            {/* Concentrating / scanning eyes */}
            <ellipse cx="36" cy="36" rx="4.5" ry="6" fill="#130924" />
            <ellipse cx="56" cy="36" rx="4.5" ry="6" fill="#130924" />
            <circle cx="37" cy="34" r="2" fill="#38bdf8" />
            <circle cx="57" cy="34" r="2" fill="#38bdf8" />
            {/* Magnifying glass or monocle sparkle */}
            <circle cx="56" cy="36" r="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8"/>
            <line x1="62" y1="42" x2="68" y2="48" stroke="#38bdf8" strokeWidth="2"/>
          </>
        );
      case 'deadline-alert':
        return (
          <>
            {/* Alarmed / alert wide eyes */}
            <circle cx="36" cy="34" r="7" fill="#130924" />
            <circle cx="56" cy="34" r="7" fill="#130924" />
            <circle cx="36" cy="33" r="3" fill="#f59e0b" />
            <circle cx="56" cy="33" r="3" fill="#f59e0b" />
            {/* O-mouth */}
            <ellipse cx="46" cy="46" rx="4" ry="5.5" fill="#130924" />
          </>
        );
      case 'unclear':
        return (
          <>
            {/* One eye raised, puzzled */}
            <circle cx="35" cy="35" r="5" fill="#130924" />
            <circle cx="57" cy="33" r="6.5" fill="#130924" />
            <circle cx="36" cy="34" r="2" fill="#ffffff" />
            <circle cx="58" cy="32" r="2.5" fill="#ffffff" />
            {/* Puzzled mouth */}
            <path d="M 42 46 Q 46 44 50 47" stroke="#130924" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </>
        );
      case 'success':
        return (
          <>
            {/* Happy curved eyes */}
            <path d="M 32 37 Q 37 31 42 37" stroke="#130924" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M 52 37 Q 57 31 62 37" stroke="#130924" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Happy open smile */}
            <path d="M 40 43 Q 47 51 54 43 Z" fill="#130924"/>
            {/* Rosy cheeks */}
            <circle cx="30" cy="42" r="3.5" fill="#f43f5e" opacity="0.5"/>
            <circle cx="64" cy="42" r="3.5" fill="#f43f5e" opacity="0.5"/>
          </>
        );
      case 'greeting':
      default:
        return (
          <>
            {/* Friendly cute eyes */}
            <ellipse cx="36" cy="35" rx="5" ry="6" fill="#130924" />
            <ellipse cx="56" cy="35" rx="5" ry="6" fill="#130924" />
            <circle cx="37.5" cy="33.5" r="2.2" fill="#ffffff" />
            <circle cx="57.5" cy="33.5" r="2.2" fill="#ffffff" />
            <circle cx="35" cy="37" r="1.2" fill="#ffffff" />
            <circle cx="55" cy="37" r="1.2" fill="#ffffff" />
            {/* Cute smile */}
            <path d="M 41 44 Q 46 49 51 44" stroke="#130924" strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* Rosy cheeks */}
            <circle cx="30" cy="42" r="3.5" fill="#f472b6" opacity="0.45"/>
            <circle cx="62" cy="42" r="3.5" fill="#f472b6" opacity="0.45"/>
          </>
        );
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Floating Ghost Mascot SVG */}
      <div className={`relative shrink-0 ${sizeDimensions.container} select-none group`}>
        <div className="animate-bounce" style={{ animationDuration: '3.2s' }}>
          <svg
            width={sizeDimensions.width}
            height={sizeDimensions.height}
            viewBox="0 0 95 105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_8px_16px_rgba(168,85,247,0.35)]"
          >
            {/* Ghost Aura / Glow */}
            <ellipse
              cx="47"
              cy="52"
              rx="42"
              ry="45"
              fill={mood === 'deadline-alert' ? '#f59e0b' : '#38bdf8'}
              opacity="0.12"
              className="animate-pulse"
            />

            {/* Little Witch Hat */}
            <g transform="translate(14, 0)">
              <ellipse cx="34" cy="22" rx="26" ry="6" fill="#2e1065" stroke="#9333ea" strokeWidth="1.5" />
              <path d="M 20 20 Q 33 2 48 3 L 42 20 Z" fill="#3b0764" />
              <path d="M 23 18 Q 33 5 44 6" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
              {/* Little golden buckle */}
              <rect x="30" y="15" width="8" height="6" rx="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            </g>

            {/* Ghost Body */}
            <path
              d="M 22 45 
                 C 22 24, 72 24, 72 45 
                 C 73 60, 76 75, 73 85 
                 C 71 89, 66 84, 62 88 
                 C 58 92, 54 84, 49 88 
                 C 44 92, 40 84, 35 88 
                 C 30 92, 26 85, 23 85 
                 C 20 75, 22 60, 22 45 Z"
              fill="url(#casperGrad)"
              stroke="#e9d5ff"
              strokeWidth="1.8"
            />

            {/* Little Floating Hands */}
            <path
              d="M 18 53 C 12 55, 12 62, 17 63 C 21 64, 23 58, 20 54 Z"
              fill="#ffffff"
              stroke="#e9d5ff"
              strokeWidth="1.2"
            />
            <path
              d="M 76 53 C 82 55, 82 62, 77 63 C 73 64, 71 58, 74 54 Z"
              fill="#ffffff"
              stroke="#e9d5ff"
              strokeWidth="1.2"
            />

            {/* Little Pumpkin in hand for success or greeting */}
            {mood === 'greeting' && (
              <g transform="translate(68, 55)">
                <ellipse cx="8" cy="8" rx="8" ry="7" fill="#ea580c" />
                <path d="M 8 2 Q 8 0 10 0" stroke="#15803d" strokeWidth="1.5" fill="none" />
                <path d="M 5 6 L 6 8 L 4 8 Z" fill="#431407" />
                <path d="M 11 6 L 12 8 L 10 8 Z" fill="#431407" />
                <path d="M 5 10 Q 8 13 11 10" stroke="#431407" strokeWidth="1" fill="none" />
              </g>
            )}

            {/* Facial Expressions */}
            {getEyeExpression()}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="casperGrad" x1="47" y1="20" x2="47" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f5f3ff" />
                <stop offset="100%" stopColor="#ddd6fe" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="relative max-w-md bg-[#1a1236]/95 border border-purple-500/30 text-purple-100 rounded-2xl p-3 shadow-lg backdrop-blur-sm">
          {/* Arrow */}
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#1a1236] border-b-8 border-b-transparent" />
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
              Casper (Campus Guide)
            </span>
          </div>
          <p className="text-sm text-slate-200 mt-0.5 leading-snug font-medium">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};
