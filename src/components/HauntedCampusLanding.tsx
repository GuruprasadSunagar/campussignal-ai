import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  Info,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
  Cpu,
  Shield,
  HelpCircle,
  X,
} from 'lucide-react';
import { playSpookyGateSound, toggleAmbientSpookyMusic } from '../utils/spookyAudio';

interface HauntedCampusLandingProps {
  onEnterCampus: () => void;
  isGemmaActive?: boolean;
}

export const HauntedCampusLanding: React.FC<HauntedCampusLandingProps> = ({
  onEnterCampus,
  isGemmaActive = true,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeModal, setActiveModal] = useState<'about' | 'how' | 'casper' | null>(null);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    toggleAmbientSpookyMusic(next);
  };

  const handleEnterClick = () => {
    if (soundEnabled) {
      playSpookyGateSound();
    }
    setIsTransitioning(true);
    // Smooth gate opening / mist transition
    setTimeout(() => {
      onEnterCampus();
    }, 1100);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070314] text-purple-100 overflow-x-hidden flex flex-col justify-between select-none">
      {/* ================= BACKGROUND CINEMATIC ARTWORK ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Stormy Dark Purple Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090218] via-[#14082e] via-60% to-[#0b0416]" />

        {/* Ambient Mist & Atmospheric Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-orange-500/10 via-purple-600/15 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[350px] bg-teal-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-0 w-[600px] h-[400px] bg-amber-500/15 rounded-full blur-[120px]" />

        {/* ================= VECTOR SCENE: CASTLE, MOON, DEVILS, GHOSTS, TREES ================= */}
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full opacity-90"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Moon gradient */}
            <radialGradient id="bloodMoon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="35%" stopColor="#fed7aa" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#c2410c" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </radialGradient>

            {/* Castle silhouette gradient */}
            <linearGradient id="castleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a0b38" />
              <stop offset="45%" stopColor="#13072b" />
              <stop offset="100%" stopColor="#0a0319" />
            </linearGradient>

            {/* Cobblestone path gradient */}
            <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e1065" />
              <stop offset="40%" stopColor="#1e0b40" />
              <stop offset="100%" stopColor="#0f0521" />
            </linearGradient>

            {/* Window glow */}
            <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            <radialGradient id="purpleWindow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="60%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0e7490" />
            </radialGradient>

            {/* Ghost spectral gradient */}
            <linearGradient id="ghostGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#e0e7ff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Twinkling Stars */}
          <g fill="#f3e8ff" opacity="0.6">
            <circle cx="120" cy="80" r="1.5" className="animate-pulse" />
            <circle cx="280" cy="140" r="2" />
            <circle cx="450" cy="70" r="1.2" />
            <circle cx="620" cy="110" r="1.8" />
            <circle cx="980" cy="60" r="2" className="animate-pulse" />
            <circle cx="1120" cy="130" r="1.5" />
            <circle cx="1280" cy="95" r="2" />
            <circle cx="1380" cy="180" r="1.2" />
            <circle cx="190" cy="220" r="1.5" />
            <circle cx="850" cy="150" r="1.5" />
          </g>

          {/* GIANT GLOWING HARVEST / BLOOD MOON */}
          <circle cx="960" cy="240" r="220" fill="url(#moonGlow)" />
          <circle cx="960" cy="240" r="140" fill="url(#bloodMoon)" />
          {/* Moon Craters */}
          <ellipse cx="920" cy="210" rx="22" ry="18" fill="#c2410c" opacity="0.25" />
          <ellipse cx="980" cy="270" rx="32" ry="24" fill="#c2410c" opacity="0.22" />
          <ellipse cx="1020" cy="190" rx="16" ry="14" fill="#c2410c" opacity="0.2" />
          <ellipse cx="930" cy="290" rx="18" ry="12" fill="#c2410c" opacity="0.18" />

          {/* BATS FLYING ACROSS THE MOON */}
          <g fill="#0b0318">
            {/* Bat 1 (large) */}
            <path
              d="M 910 200 Q 925 180 940 195 Q 950 185 960 195 Q 975 180 990 200 Q 960 215 950 205 Q 940 215 910 200 Z"
              className="animate-pulse"
            />
            {/* Bat 2 (medium) */}
            <path d="M 860 230 Q 872 215 885 228 Q 893 220 900 228 Q 912 215 925 230 Q 900 242 893 234 Q 885 242 860 230 Z" />
            {/* Bat 3 (small) */}
            <path d="M 1010 160 Q 1020 148 1030 158 Q 1036 152 1042 158 Q 1052 148 1062 160 Q 1042 170 1036 163 Q 1030 170 1010 160 Z" />
            {/* Bat 4 (distant left) */}
            <path d="M 720 180 Q 730 170 740 178 Q 745 173 750 178 Q 760 170 770 180 Q 750 188 745 182 Q 740 188 720 180 Z" />
          </g>

          {/* GOTHIC HAUNTED UNIVERSITY / CASTLE IN BACKGROUND */}
          <g fill="url(#castleGrad)">
            {/* Distant Hills / Cemetery Ridge */}
            <path d="M 0 540 Q 360 490 720 530 T 1440 520 L 1440 900 L 0 900 Z" opacity="0.8" />

            {/* Central Clock Tower & Spire */}
            <path d="M 880 210 L 900 130 L 920 210 L 915 360 L 885 360 Z" />
            {/* Spire Cross / Gargoyle Finial */}
            <line x1="900" y1="115" x2="900" y2="135" stroke="#3b1764" strokeWidth="2.5" />
            <line x1="894" y1="123" x2="906" y2="123" stroke="#3b1764" strokeWidth="2" />

            {/* Main Castle Central Hall */}
            <rect x="850" y="320" width="100" height="180" />
            {/* Battlements / Crenellations */}
            <path d="M 850 320 L 850 305 L 865 305 L 865 320 L 880 320 L 880 305 L 895 305 L 895 320 L 910 320 L 910 305 L 925 305 L 925 320 L 940 320 L 940 305 L 950 305 L 950 320 Z" />

            {/* West Tower (Left) */}
            <rect x="760" y="300" width="70" height="200" />
            <polygon points="750,300 795,180 840,300" />
            {/* East Tower (Right) */}
            <rect x="970" y="280" width="80" height="220" />
            <polygon points="960,280 1010,160 1060,280" />

            {/* Secondary Wings */}
            <rect x="680" y="370" width="90" height="140" />
            <polygon points="670,370 725,270 780,370" />
            <rect x="1040" y="360" width="100" height="150" />
            <polygon points="1030,360 1090,260 1150,360" />

            {/* Glowing Windows */}
            {/* Tower rose window */}
            <circle cx="900" cy="270" r="16" fill="url(#windowGlow)" opacity="0.9" />
            <line x1="900" y1="254" x2="900" y2="286" stroke="#13072b" strokeWidth="1.5" />
            <line x1="884" y1="270" x2="916" y2="270" stroke="#13072b" strokeWidth="1.5" />

            {/* Arched windows in towers */}
            <path d="M 785 340 A 10 10 0 0 1 805 340 L 805 375 L 785 375 Z" fill="url(#windowGlow)" opacity="0.85" />
            <path d="M 885 370 A 8 8 0 0 1 901 370 L 901 405 L 885 405 Z" fill="url(#purpleWindow)" opacity="0.9" />
            <path d="M 995 330 A 10 10 0 0 1 1015 330 L 1015 365 L 995 365 Z" fill="url(#windowGlow)" opacity="0.85" />
            <path d="M 1065 400 A 9 9 0 0 1 1083 400 L 1083 430 L 1065 430 Z" fill="url(#windowGlow)" opacity="0.75" />
          </g>

          {/* SPIDERWEBS ON CORNERS */}
          <g stroke="#9333ea" strokeWidth="0.8" opacity="0.35" fill="none">
            {/* Left Tree Web */}
            <path d="M 0 0 L 180 0 M 0 0 L 0 200 M 0 0 L 120 140" />
            <path d="M 0 40 Q 40 40 40 0" />
            <path d="M 0 90 Q 90 90 90 0" />
            <path d="M 0 150 Q 150 150 150 0" />
          </g>

          {/* BARE TWISTED SPOOKY TREES */}
          {/* Left Twisted Tree */}
          <g fill="#0b0318">
            <path d="M 60 750 C 70 650, 100 550, 80 440 C 65 370, 30 330, 0 310 L 0 325 C 25 340, 50 380, 60 440 C 40 410, 10 390, 0 380 L 0 395 C 15 405, 35 425, 45 460 C 50 490, 40 550, 20 620 L 0 650 L 0 750 Z" />
            {/* Tree branches reaching inward */}
            <path d="M 80 440 C 110 400, 170 380, 220 375 L 218 368 C 160 373, 105 395, 75 430 Z" />
            <path d="M 140 395 C 160 360, 200 340, 240 335 L 238 330 C 195 335, 155 355, 135 390 Z" />
          </g>
          {/* Right Spooky Tree */}
          <g fill="#0b0318">
            <path d="M 1380 750 C 1370 630, 1340 520, 1360 420 C 1375 350, 1410 310, 1440 290 L 1440 305 C 1415 325, 1390 360, 1380 420 C 1400 390, 1430 370, 1440 360 L 1440 375 C 1425 385, 1405 405, 1395 440 C 1390 470, 1400 530, 1420 600 L 1440 630 L 1440 750 Z" />
            <path d="M 1360 420 C 1330 380, 1270 360, 1220 355 L 1222 348 C 1280 353, 1335 375, 1365 410 Z" />
          </g>

          {/* MYSTERIOUS COBBLESTONE PATHWAY LEADING TO CAMPUS GATES */}
          <path d="M 450 900 L 640 540 L 800 540 L 990 900 Z" fill="url(#pathGrad)" opacity="0.9" />
          {/* Cobblestone cracks & highlights */}
          <g stroke="#6b21a8" strokeWidth="1.5" opacity="0.4" fill="none">
            <path d="M 520 860 Q 720 840 920 860" />
            <path d="M 560 800 Q 720 785 880 800" />
            <path d="M 600 730 Q 720 720 840 730" />
            <path d="M 630 660 Q 720 650 810 660" />
            <path d="M 645 600 Q 720 595 795 600" />
          </g>

          {/* GOTHIC ENTRANCE IRON GATES */}
          <g stroke="#3b1764" strokeWidth="3" fill="none">
            {/* Gate Pillars */}
            <rect x="620" y="470" width="28" height="110" fill="#17072e" stroke="#581c87" strokeWidth="2" />
            <rect x="792" y="470" width="28" height="110" fill="#17072e" stroke="#581c87" strokeWidth="2" />
            {/* Stone tops with skulls */}
            <polygon points="616,470 634,445 652,470" fill="#2e1065" stroke="#7e22ce" strokeWidth="1.5" />
            <polygon points="788,470 806,445 824,470" fill="#2e1065" stroke="#7e22ce" strokeWidth="1.5" />

            {/* Iron Bars */}
            <g opacity="0.85">
              <line x1="655" y1="490" x2="655" y2="580" />
              <line x1="675" y1="480" x2="675" y2="580" />
              <line x1="695" y1="470" x2="695" y2="580" />
              <line x1="710" y1="465" x2="710" y2="580" />
              <line x1="730" y1="465" x2="730" y2="580" />
              <line x1="745" y1="470" x2="745" y2="580" />
              <line x1="765" y1="480" x2="765" y2="580" />
              <line x1="785" y1="490" x2="785" y2="580" />
              {/* Arched Gate Top */}
              <path d="M 648 495 Q 720 455 792 495" strokeWidth="3" />
            </g>
          </g>

          {/* FLOATING SPECTRAL GHOSTS IN THE NIGHT */}
          {/* Ghost 1 (floating near castle left) */}
          <g transform="translate(520, 360)">
            <path
              d="M 20 40 C 20 15, 60 15, 60 40 C 60 60, 65 75, 55 85 C 45 75, 40 85, 35 75 C 30 85, 20 75, 20 40 Z"
              fill="url(#ghostGrad)"
            />
            <ellipse cx="33" cy="35" rx="3" ry="5" fill="#110526" />
            <ellipse cx="47" cy="35" rx="3" ry="5" fill="#110526" />
            <ellipse cx="40" cy="46" rx="4" ry="6" fill="#110526" />
          </g>

          {/* Ghost 2 (playful wisp floating right) */}
          <g transform="translate(1120, 410)">
            <path
              d="M 15 30 C 15 10, 45 10, 45 30 C 45 45, 50 60, 40 68 C 32 60, 28 68, 22 60 C 15 65, 15 45, 15 30 Z"
              fill="url(#ghostGrad)"
              opacity="0.8"
            />
            <circle cx="25" cy="26" r="2.5" fill="#110526" />
            <circle cx="35" cy="26" r="2.5" fill="#110526" />
            <path d="M 27 34 Q 30 38 33 34" stroke="#110526" strokeWidth="1.5" fill="none" />
          </g>

          {/* PLAYFUL DEVILS WITH HORNS, GLOWING EYES & PITCHFORKS */}
          {/* Devil 1 (Left on entrance rocks) */}
          <g transform="translate(380, 640)">
            {/* Devil Body */}
            <ellipse cx="40" cy="55" rx="18" ry="22" fill="#dc2626" />
            {/* Devil Head */}
            <circle cx="40" cy="30" r="14" fill="#ef4444" />
            {/* Red Horns */}
            <path d="M 32 20 Q 28 8 20 12 Q 28 18 31 23 Z" fill="#991b1b" />
            <path d="M 48 20 Q 52 8 60 12 Q 52 18 49 23 Z" fill="#991b1b" />
            {/* Glowing Yellow Eyes */}
            <ellipse cx="36" cy="28" rx="2.5" ry="3" fill="#fef08a" />
            <ellipse cx="44" cy="28" rx="2.5" ry="3" fill="#fef08a" />
            <circle cx="36" cy="28" r="1.2" fill="#78350f" />
            <circle cx="44" cy="28" r="1.2" fill="#78350f" />
            {/* Grinning Smile with tiny fangs */}
            <path d="M 35 36 Q 40 41 45 36" stroke="#450a0a" strokeWidth="1.8" fill="none" />
            <polygon points="37,36 38,39 39,36" fill="#ffffff" />
            <polygon points="41,36 42,39 43,36" fill="#ffffff" />
            {/* Pointy Devil Tail */}
            <path d="M 30 65 Q 15 70 12 55 Q 8 60 5 56 L 15 48 Z" fill="#dc2626" />
            {/* Pitchfork */}
            <line x1="58" y1="15" x2="58" y2="75" stroke="#78716c" strokeWidth="2.5" />
            {/* Prongs */}
            <path d="M 52 20 L 52 10 Q 58 14 64 10 L 64 20" stroke="#f59e0b" strokeWidth="2" fill="none" />
            <line x1="58" y1="8" x2="58" y2="20" stroke="#f59e0b" strokeWidth="2" />
          </g>

          {/* Devil 2 (Right perched near gate) */}
          <g transform="translate(850, 560)">
            {/* Devil Body */}
            <ellipse cx="30" cy="45" rx="14" ry="17" fill="#b91c1c" />
            {/* Devil Head */}
            <circle cx="30" cy="25" r="11" fill="#dc2626" />
            {/* Horns */}
            <path d="M 24 17 Q 20 7 14 11 Q 20 16 23 20 Z" fill="#7f1d1d" />
            <path d="M 36 17 Q 40 7 46 11 Q 40 16 37 20 Z" fill="#7f1d1d" />
            {/* Glowing Eyes */}
            <circle cx="27" cy="24" r="2" fill="#fde047" />
            <circle cx="33" cy="24" r="2" fill="#fde047" />
            {/* Pitchfork */}
            <line x1="44" y1="12" x2="44" y2="58" stroke="#78716c" strokeWidth="2" />
            <path d="M 39 16 L 39 8 Q 44 11 49 8 L 49 16" stroke="#f97316" strokeWidth="1.5" fill="none" />
            <line x1="44" y1="6" x2="44" y2="16" stroke="#f97316" strokeWidth="1.5" />
          </g>

          {/* GLOWING CARVED JACK-O'-LANTERNS (PUMPKINS) ON BOTH SIDES OF ENTRANCE */}
          {/* Pumpkin 1 (Left foreground large) */}
          <g transform="translate(390, 750)">
            {/* Outer Glow */}
            <ellipse cx="45" cy="40" rx="50" ry="38" fill="#f97316" opacity="0.2" />
            {/* Pumpkin Ribs */}
            <ellipse cx="25" cy="40" rx="18" ry="30" fill="#ea580c" />
            <ellipse cx="65" cy="40" rx="18" ry="30" fill="#ea580c" />
            <ellipse cx="45" cy="40" rx="26" ry="32" fill="#f97316" />
            {/* Green Stem */}
            <path d="M 45 10 Q 42 0 49 -2 Q 47 6 45 12 Z" fill="#15803d" />
            {/* Carved Fiery Eyes */}
            <polygon points="32,28 40,36 30,36" fill="#fef08a" />
            <polygon points="58,28 60,36 50,36" fill="#fef08a" />
            {/* Nose */}
            <polygon points="45,36 42,42 48,42" fill="#fde047" />
            {/* Carved Jagged Mouth with Teeth */}
            <path
              d="M 28 50 L 33 46 L 38 52 L 45 46 L 52 52 L 57 46 L 62 50 L 57 56 L 52 52 L 45 56 L 38 52 L 33 56 Z"
              fill="#fef08a"
            />
          </g>

          {/* Pumpkin 2 (Left medium) */}
          <g transform="translate(320, 785)">
            <ellipse cx="30" cy="30" rx="30" ry="24" fill="#c2410c" />
            <ellipse cx="30" cy="30" rx="20" ry="25" fill="#ea580c" />
            <path d="M 30 8 Q 28 0 34 -2" stroke="#15803d" strokeWidth="3" fill="none" />
            <polygon points="20,22 26,27 18,27" fill="#fde047" />
            <polygon points="40,22 42,27 34,27" fill="#fde047" />
            <path d="M 18 36 Q 30 45 42 36 Q 30 40 18 36 Z" fill="#fef08a" />
          </g>

          {/* Pumpkin 3 (Right foreground large) */}
          <g transform="translate(980, 740)">
            <ellipse cx="45" cy="40" rx="50" ry="38" fill="#f97316" opacity="0.2" />
            <ellipse cx="25" cy="40" rx="18" ry="30" fill="#ea580c" />
            <ellipse cx="65" cy="40" rx="18" ry="30" fill="#ea580c" />
            <ellipse cx="45" cy="40" rx="26" ry="32" fill="#f97316" />
            <path d="M 45 10 Q 48 0 42 -2 Q 44 6 45 12 Z" fill="#15803d" />
            {/* Carved Evil Eyes */}
            <path d="M 26 28 Q 36 34 38 38 L 28 36 Z" fill="#fef08a" />
            <path d="M 64 28 Q 54 34 52 38 L 62 36 Z" fill="#fef08a" />
            <polygon points="45,36 41,41 49,41" fill="#fde047" />
            {/* Grinning jagged mouth */}
            <path d="M 25 50 Q 45 62 65 50 Q 55 58 45 52 Q 35 58 25 50 Z" fill="#fef08a" />
          </g>

          {/* Pumpkin 4 (Right stack) */}
          <g transform="translate(1050, 775)">
            <ellipse cx="28" cy="28" rx="28" ry="22" fill="#c2410c" />
            <ellipse cx="28" cy="28" rx="18" ry="23" fill="#ea580c" />
            <polygon points="18,20 24,25 16,25" fill="#fde047" />
            <polygon points="38,20 40,25 32,25" fill="#fde047" />
            <path d="M 18 33 Q 28 42 38 33 Z" fill="#fef08a" />
          </g>

          {/* PURPLE MAGICAL SMOKE & MIST ON GROUND */}
          <g opacity="0.35">
            <ellipse cx="720" cy="880" rx="420" ry="60" fill="#a855f7" />
            <ellipse cx="400" cy="850" rx="250" ry="40" fill="#06b6d4" />
            <ellipse cx="1040" cy="860" rx="280" ry="45" fill="#f97316" />
          </g>
        </svg>

        {/* Floating Sparks / Embers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 rounded-full bg-amber-400 blur-[1px] animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-36 left-1/2 w-2 h-2 rounded-full bg-orange-400 blur-[1px] animate-bounce" style={{ animationDuration: '4.5s' }} />
          <div className="absolute bottom-24 right-1/3 w-1 h-1 rounded-full bg-teal-300 blur-[0.5px] animate-bounce" style={{ animationDuration: '2.5s' }} />
        </div>
      </div>

      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 select-none">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 p-0.5 shadow-xl shadow-purple-950/60">
            <div className="w-full h-full bg-[#110727] rounded-[14px] flex items-center justify-center text-2xl">
              👻
            </div>
            <span className="absolute -top-1 -right-1 text-sm">🎃</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white drop-shadow-md">
                CampusSignal <span className="text-amber-400">AI</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 hidden sm:inline-block">
                Haunted Edition
              </span>
            </div>
            <span className="text-[11px] text-purple-300/80 font-medium block">
              College Notices &amp; Opportunities
            </span>
          </div>
        </div>

        {/* Small Top Navigation Links */}
        <nav className="flex items-center gap-3 sm:gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveModal('about')}
            className="text-purple-200 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>About</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('how')}
            className="text-purple-200 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">How It Works</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Sound Toggle (OFF by default) */}
          <button
            type="button"
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/20'
                : 'bg-purple-950/50 text-purple-400 border-purple-800/50 hover:text-purple-200'
            }`}
            title={soundEnabled ? 'Spooky ambient sound enabled' : 'Turn on spooky sound (Off by default)'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-[11px] font-mono hidden md:inline">Spooky Sound ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="text-[11px] font-mono hidden md:inline">Sound OFF</span>
              </>
            )}
          </button>
        </nav>
      </header>

      {/* ================= HERO CONTENT SECTION (CENTER-LEFT) ================= */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 lg:py-12 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          {/* Spooky Header Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/60 border border-purple-600/50 backdrop-blur-md shadow-lg shadow-purple-950/50">
            <span className="text-amber-400 text-sm">🦇</span>
            <span className="text-xs font-black uppercase tracking-widest text-amber-300">
              Midnight Campus Portal • All Degrees Welcome
            </span>
            <span className="text-amber-400 text-sm">🎃</span>
          </div>

          {/* Main Cinematic Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            WELCOME TO THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 drop-shadow-[0_2px_18px_rgba(251,146,60,0.4)]">
              HAUNTED CAMPUS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-purple-200/95 font-medium leading-relaxed max-w-xl drop-shadow-md">
            “Every notice hides a secret. Every deadline has a dark side. Discover your campus
            opportunities before they disappear!”
          </p>

          {/* Call-to-Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* PRIMARY BUTTON: ENTER HAUNTED CAMPUS */}
            <button
              type="button"
              onClick={handleEnterClick}
              disabled={isTransitioning}
              className="group relative px-8 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base sm:text-lg rounded-2xl transition-all cursor-pointer shadow-2xl shadow-amber-500/35 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-3 border border-amber-300/40"
            >
              <span className="text-2xl transition-transform group-hover:scale-125">🎃</span>
              <span>ENTER HAUNTED CAMPUS</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* SECONDARY BUTTON: MEET CASPER AI */}
            <button
              type="button"
              onClick={() => setActiveModal('casper')}
              className="px-6 py-4 bg-[#1a0c36]/80 hover:bg-[#25124d] text-purple-100 hover:text-white font-bold text-sm sm:text-base rounded-2xl transition-all cursor-pointer border border-purple-600/50 backdrop-blur-md shadow-lg flex items-center justify-center gap-2.5"
            >
              <span className="text-xl">👻</span>
              <span>Meet Casper AI</span>
            </button>
          </div>

          {/* Small Tagline with verified Gemma 4 */}
          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs text-purple-300/80">
            {isGemmaActive && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-purple-200">
                  Powered by <span className="text-amber-400 font-bold">Gemma 4 AI</span>
                </span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-900/60 px-1.5 py-0.2 rounded">
                  26b-a4b-it
                </span>
              </div>
            )}
            <span className="text-purple-400 text-xs hidden sm:inline">•</span>
            <span className="text-xs text-purple-300/90 font-medium">
              Multilingual Poster Analysis &amp; Deadline Protection
            </span>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-20 max-w-7xl mx-auto w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-purple-400/80 border-t border-purple-900/40">
        <div>
          <span>CampusSignal AI • Halloween Hackathon Edition</span>
        </div>
        <div className="flex items-center gap-4">
          <span>BCA • BSc • BCom • BTech &amp; All Campus Students</span>
        </div>
      </footer>

      {/* ================= TRANSITION OVERLAY (GATE OPENING / MYSTICAL FOG) ================= */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080216] transition-opacity duration-700 animate-fade-in">
          {/* Iron Gates Splitting Apart */}
          <div className="absolute inset-0 flex pointer-events-none">
            <div className="w-1/2 h-full bg-gradient-to-r from-[#0d0421] to-[#1a083a] border-r-4 border-amber-500/60 transition-transform duration-1000 -translate-x-full" />
            <div className="w-1/2 h-full bg-gradient-to-l from-[#0d0421] to-[#1a083a] border-l-4 border-amber-500/60 transition-transform duration-1000 translate-x-full" />
          </div>

          <div className="relative z-10 text-center space-y-4 animate-pulse">
            <div className="text-6xl">👻🎃</div>
            <h3 className="text-2xl font-black text-amber-400 tracking-wide">
              ENTERING THE HAUNTED CAMPUS...
            </h3>
            <p className="text-xs text-purple-300 font-medium font-mono">
              Unsealing the Gates • Initializing Gemma 4 Engine
            </p>
          </div>
        </div>
      )}

      {/* ================= MODAL: MEET CASPER AI ================= */}
      {activeModal === 'casper' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#140a2b] border border-purple-600/60 rounded-3xl p-6 sm:p-8 text-purple-100 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-purple-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-purple-800/50">
              <div className="text-3xl">👻</div>
              <div>
                <h3 className="font-extrabold text-xl text-white">Meet Casper AI</h3>
                <p className="text-xs text-amber-400 font-semibold">Your Haunted Campus Guide</p>
              </div>
            </div>

            <div className="mt-5 space-y-3.5 text-sm leading-relaxed text-purple-200">
              <p>
                <strong className="text-white">"Boo! Don't let your college future fade into the fog."</strong>
              </p>
              <p>
                I am <span className="text-amber-300 font-semibold">Casper</span>, the campus guardian spirit. Every semester, thousands of students miss merit scholarships, high-stipend internships, hackathons, and special examination deadlines simply because notices are buried on damp notice boards or obscure circulars.
              </p>
              <p>
                Powered by Google's <span className="text-teal-300 font-semibold">Gemma 4 model</span>, I inspect every poster and circular you provide:
              </p>
              <ul className="space-y-1.5 text-xs text-purple-200 pl-4 list-disc">
                <li>Extract 13 verified fields with zero hallucinations.</li>
                <li>Compare eligibility against your personal academic course (BCA, BSc, etc.).</li>
                <li>Translate into Hindi, Kannada, or simplified English.</li>
                <li>Build an interactive checklist to break the deadline curse!</li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-800/50 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  handleEnterClick();
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-amber-500/25 flex items-center gap-2"
              >
                <span>Enter Campus with Casper</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ABOUT ================= */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#140a2b] border border-purple-600/60 rounded-3xl p-6 sm:p-8 text-purple-100 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-purple-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-purple-800/50">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white">About CampusSignal AI</h3>
                <p className="text-xs text-purple-300">Haunted Campus Edition</p>
              </div>
            </div>

            <div className="mt-5 space-y-3.5 text-xs sm:text-sm leading-relaxed text-purple-200">
              <p>
                CampusSignal AI was created for students navigating college opportunities in a mystical, Halloween-inspired university environment.
              </p>
              <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-800/50 space-y-1">
                <span className="font-bold text-amber-300 block">Core Architecture:</span>
                <p className="text-xs text-purple-300">
                  Utilizes Google's official <code className="text-teal-300">@google/genai</code> SDK connecting directly to the real <strong className="text-white">gemma-4-26b-a4b-it</strong> model on the server side.
                </p>
              </div>
              <p>
                Unlike generic chat interfaces, CampusSignal strictly adheres to source texts, flagging missing information as <em>"Not mentioned in the notice"</em> and ambiguous clauses as <em>"Needs verification"</em>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-800/50 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-purple-800 hover:bg-purple-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: HOW IT WORKS ================= */}
      {activeModal === 'how' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#140a2b] border border-purple-600/60 rounded-3xl p-6 sm:p-8 text-purple-100 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-purple-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-purple-800/50">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white">The 4 Enchantments</h3>
                <p className="text-xs text-teal-300">How to conquer any college circular</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/40">
                <strong className="text-amber-400 block text-xs">1. Ghost Notice Scanner</strong>
                <p className="text-purple-200 mt-0.5">Upload a poster JPG/PNG or paste circular text. Gemma 4 extracts all 13 verified fields.</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/40">
                <strong className="text-amber-400 block text-xs">2. Personalized Match</strong>
                <p className="text-purple-200 mt-0.5">Gemma 4 checks eligibility against your specific degree (BCA, BSc, etc.) and academic score.</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/40">
                <strong className="text-amber-400 block text-xs">3. Magic Language Translator</strong>
                <p className="text-purple-200 mt-0.5">Read explanations in English, Hindi (हिंदी), or Kannada (ಕನ್ನಡ) without losing dates or links.</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/40">
                <strong className="text-amber-400 block text-xs">4. Deadline Curse Breaker</strong>
                <p className="text-purple-200 mt-0.5">Track urgency states (Urgent, Upcoming) and check off actionable steps before the midnight bell tolls.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-800/50 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  handleEnterClick();
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                Enter Haunted Campus Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
