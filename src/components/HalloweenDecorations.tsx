import React from 'react';

export const HalloweenDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Deep Midnight Purple / Black Gradient Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090315] via-[#100724] to-[#070211]" />

      {/* Atmospheric Fog & Glowing Orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-b from-orange-500/10 via-purple-600/15 to-transparent rounded-full blur-[100px]" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[300px] bg-teal-500/8 rounded-full blur-[90px]" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-purple-700/10 rounded-full blur-[110px]" />

      {/* Top Left Gothic Spiderweb */}
      <svg
        className="absolute top-0 left-0 w-44 h-44 text-purple-400/20"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0,0 L100,0 M0,0 L0,100 M0,0 L70,70 M0,0 L35,90 M0,0 L90,35" />
        <path d="M0,20 Q20,20 20,0" />
        <path d="M0,45 Q45,45 45,0" />
        <path d="M0,75 Q75,75 75,0" />
        <path d="M0,100 Q100,100 100,0" />
      </svg>

      {/* Top Right Gothic Spiderweb */}
      <svg
        className="absolute top-0 right-0 w-44 h-44 text-purple-400/20 transform scale-x-[-1]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0,0 L100,0 M0,0 L0,100 M0,0 L70,70 M0,0 L35,90 M0,0 L90,35" />
        <path d="M0,20 Q20,20 20,0" />
        <path d="M0,45 Q45,45 45,0" />
        <path d="M0,75 Q75,75 75,0" />
        <path d="M0,100 Q100,100 100,0" />
      </svg>

      {/* GLOWING ORANGE HARVEST / BLOOD MOON IN BACKGROUND */}
      <div className="absolute top-10 right-12 w-28 h-28 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-200 opacity-25 blur-[1px] shadow-[0_0_60px_rgba(249,115,22,0.35)]" />

      {/* DISTANT GOTHIC CASTLE SILHOUETTE ALONG HORIZON */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-44 opacity-25"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0 200 L 0 140 
             Q 120 120 240 135 
             L 280 135 L 280 90 L 295 70 L 310 90 L 310 135 
             L 450 140 
             Q 580 125 720 135 
             L 780 135 L 780 60 L 800 35 L 820 60 L 820 135 
             L 920 135 L 920 80 L 935 60 L 950 80 L 950 135 
             Q 1100 120 1240 135 
             L 1320 135 L 1320 85 L 1335 65 L 1350 85 L 1350 135 
             L 1440 140 L 1440 200 Z"
          fill="#17092e"
        />
        {/* Tiny Glowing Castle Windows */}
        <circle cx="295" cy="105" r="3" fill="#fde047" opacity="0.6" />
        <circle cx="800" cy="80" r="4" fill="#fb923c" opacity="0.7" />
        <circle cx="935" cy="95" r="3" fill="#38bdf8" opacity="0.6" />
      </svg>

      {/* FLOATING BATS */}
      <svg
        className="absolute top-28 right-40 w-12 h-8 text-purple-900/40 animate-pulse"
        viewBox="0 0 50 25"
        fill="currentColor"
      >
        <path d="M 0 12 Q 12 0 25 10 Q 38 0 50 12 Q 38 20 25 14 Q 12 20 0 12 Z" />
      </svg>
      <svg
        className="absolute top-44 right-24 w-8 h-6 text-purple-900/35"
        viewBox="0 0 50 25"
        fill="currentColor"
      >
        <path d="M 0 12 Q 12 0 25 10 Q 38 0 50 12 Q 38 20 25 14 Q 12 20 0 12 Z" />
      </svg>

      {/* FLOATING SPECTRAL GHOST (SUBTLE WATERMARK) */}
      <div className="absolute top-1/2 right-10 opacity-15 transform translate-y-[-50%] animate-bounce" style={{ animationDuration: '6s' }}>
        <svg width="80" height="95" viewBox="0 0 80 95" fill="none">
          <path
            d="M 15 40 C 15 15, 65 15, 65 40 C 65 60, 70 75, 60 85 C 50 78, 45 85, 40 78 C 35 85, 30 78, 20 85 C 10 75, 15 60, 15 40 Z"
            fill="#e9d5ff"
          />
          <ellipse cx="32" cy="35" rx="3.5" ry="5" fill="#13072b" />
          <ellipse cx="48" cy="35" rx="3.5" ry="5" fill="#13072b" />
          <ellipse cx="40" cy="45" rx="4" ry="5.5" fill="#13072b" />
        </svg>
      </div>

      {/* BOTTOM CORNER CARVED PUMPKIN */}
      <div className="absolute bottom-4 left-6 opacity-25">
        <svg width="60" height="50" viewBox="0 0 60 50" fill="none">
          <ellipse cx="30" cy="28" rx="28" ry="20" fill="#ea580c" />
          <path d="M 30 8 Q 28 0 34 -2" stroke="#15803d" strokeWidth="2.5" fill="none" />
          <polygon points="20,22 26,27 18,27" fill="#fde047" />
          <polygon points="40,22 42,27 34,27" fill="#fde047" />
          <path d="M 18 34 Q 30 42 42 34 Q 30 38 18 34 Z" fill="#fef08a" />
        </svg>
      </div>

      {/* Twinkling Magical Stars & Floating Embers */}
      <div className="absolute top-20 left-1/3 text-amber-300 text-xs animate-pulse" style={{ animationDuration: '3.5s' }}>
        ✦
      </div>
      <div className="absolute top-48 left-16 text-teal-300 text-xs animate-pulse" style={{ animationDuration: '4.2s' }}>
        ✧
      </div>
      <div className="absolute bottom-40 right-1/4 text-amber-400 text-xs animate-pulse" style={{ animationDuration: '2.8s' }}>
        ✦
      </div>
      <div className="absolute bottom-20 left-1/2 text-purple-300 text-xs animate-pulse" style={{ animationDuration: '5s' }}>
        ✦
      </div>
    </div>
  );
};
