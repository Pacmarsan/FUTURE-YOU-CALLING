/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Signal, Wifi, Battery, Sparkles, Compass, Shield, 
  Play, ArrowRight, User, PhoneOff, Phone, Volume2, 
  Mic, Grid3x3, RotateCcw, Shuffle, Settings, Waypoints
} from 'lucide-react';

// --- Types ---
type Step = 'splash' | 'setup' | 'incoming' | 'active' | 'ended';

import { UserContext as UserData } from './lib/prompt-engine';
import { useCallSession } from './hooks/useCallSession';
import { ConversationProvider } from '@elevenlabs/react';

// --- Shared Components ---
const TopBar = ({ title = "Future You Calling", showLive = false }) => (
  <header className="flex justify-between items-center w-full px-6 pt-8 pb-2 z-50 bg-transparent relative">
    {showLive ? (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
        <span className="font-label uppercase tracking-widest text-[10px] font-medium text-primary">LIVE</span>
      </div>
    ) : (
      <div className="font-label uppercase tracking-[0.2em] text-[10px] font-semibold text-primary">
        {title}
      </div>
    )}
    
    {!showLive && title !== "Future You Calling" && (
       <div className="text-primary font-bold tracking-tighter text-sm">Future You Calling</div>
    )}

    <div className="flex gap-2 items-center">
      <Signal className="w-3.5 h-3.5 text-primary opacity-80" />
      <Wifi className="w-3.5 h-3.5 text-primary opacity-80" />
      <Battery className="w-3.5 h-3.5 text-primary opacity-80" />
    </div>
  </header>
);

// --- Screens ---

const SplashScreen = ({ onComplete }: { onComplete: () => void; key?: string }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setProgress(newProgress);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 flex flex-col z-50 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#1a0b2e]/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0b2e1a]/20 to-transparent pointer-events-none" />
      
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)', 
          backgroundSize: '24px 24px',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-center w-full px-6 pt-8 pb-2">
        <div className="font-headline text-primary font-extrabold tracking-tight text-lg">
          Future You Calling
        </div>
        <Settings className="w-5 h-5 text-primary" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 mt-8">
        
        {/* Center Graphic */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-16">
          {/* Outer Dashed Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-white/10"
          />
          {/* Inner Dotted Ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 rounded-full border border-dotted border-white/20"
          />
          {/* Core */}
          <motion.div 
            animate={{ scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-28 h-28 bg-primary rounded-full shadow-[0_0_60px_rgba(34,197,94,0.3)] flex items-center justify-center"
          >
            <Waypoints className="w-12 h-12 text-[#0a0a0a]" strokeWidth={2.5} />
          </motion.div>
        </div>

        {/* Text */}
        <div className="text-center mb-16 w-full">
          <p className="text-[9px] text-primary tracking-[0.4em] uppercase font-bold mb-4">
            Establishing Temporal Link...
          </p>
          <h1 className="text-4xl font-black text-white tracking-wider uppercase">
            Synchronizing
          </h1>
        </div>

        {/* Progress Section */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[9px] text-white/70 font-bold tracking-[0.2em] uppercase">Signal Stability</span>
            <span className="text-[10px] text-primary font-mono">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#6d28d9] to-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 w-full mb-12">
          <div className="bg-[#121212]/80 backdrop-blur-sm border border-white/5 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[8px] text-white/40 uppercase tracking-widest mb-1.5">Temporal Offset</span>
            <span className="text-sm text-white font-mono font-bold tracking-wider">+24Y 08M 12D</span>
          </div>
          <div className="bg-[#121212]/80 backdrop-blur-sm border border-white/5 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[8px] text-white/40 uppercase tracking-widest mb-1.5">Identity Lock</span>
            <span className="text-sm text-primary font-bold tracking-widest">VERIFIED</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-white/30 mt-auto pb-8">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[8px] uppercase tracking-[0.2em] font-medium">End-to-End Quantum Encryption</span>
        </div>

      </div>
    </motion.div>
  );
};

const SetupScreen = ({ onNext }: { onNext: (data: UserData) => void; key?: string }) => {
  const [data, setData] = useState<UserData>({ name: '', goal: '', fear: '' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 px-8 pt-8 flex flex-col h-full"
    >
      <div className="space-y-2 mb-12">
        <div className="font-label uppercase tracking-[0.3em] text-[10px] font-medium text-primary mb-4 opacity-70">
          Temporal Link Established
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
          Future You Calling
        </h1>
        <p className="text-on-surface-variant text-lg font-light tracking-wide opacity-80">
          Receive a call from your future self
        </p>
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <label className="font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface/50 ml-1">Name</label>
          <div className="ios-input-focus group flex items-center bg-surface-container-highest rounded-xl transition-all duration-300">
            <input 
              value={data.name}
              onChange={e => setData({...data, name: e.target.value})}
              className="w-full bg-transparent border-none text-on-surface py-4 px-5 placeholder:text-on-surface/30 focus:ring-0 outline-none" 
              placeholder="Who are you now?" 
              type="text"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface/50 ml-1">Goal</label>
          <div className="ios-input-focus group flex items-center bg-surface-container-highest rounded-xl transition-all duration-300">
            <input 
              value={data.goal}
              onChange={e => setData({...data, goal: e.target.value})}
              className="w-full bg-transparent border-none text-on-surface py-4 px-5 placeholder:text-on-surface/30 focus:ring-0 outline-none" 
              placeholder="What are you chasing?" 
              type="text"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface/50 ml-1">Fear or struggle</label>
          <div className="ios-input-focus group flex items-center bg-surface-container-highest rounded-xl transition-all duration-300">
            <textarea 
              value={data.fear}
              onChange={e => setData({...data, fear: e.target.value})}
              className="w-full bg-transparent border-none text-on-surface py-4 px-5 placeholder:text-on-surface/30 focus:ring-0 resize-none outline-none" 
              placeholder="What holds you back?" 
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="pb-12 mt-auto">
        <button 
          onClick={() => onNext(data)}
          disabled={!data.name || !data.goal}
          className="relative w-full py-5 bg-primary-container text-on-primary-container font-bold text-lg rounded-2xl overflow-hidden active:scale-95 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)] disabled:opacity-50 disabled:active:scale-100"
        >
          <span className="relative z-10">Generate Call</span>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary-fixed opacity-20"></div>
        </button>
        <p className="text-center mt-6 text-[10px] text-on-surface/30 uppercase tracking-[0.2em] font-medium">
          Encrypted Multi-Dimensional Stream
        </p>
      </div>
    </motion.div>
  );
};

// VoiceScreen removed

const IncomingScreen = ({ onAccept, onDecline }: { onAccept: () => void, onDecline: () => void; key?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex-1 flex flex-col items-center justify-between py-12 z-10 h-full w-full"
    >
      <div className="text-center">
        <span className="font-label uppercase tracking-[0.3em] text-[12px] text-on-surface-variant font-medium block mb-2 opacity-60">
          Incoming Call...
        </span>
        <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto animate-pulse"></div>
      </div>

      <div className="text-center px-6 vibration-sim">
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 rounded-full border-2 border-primary/20 flex items-center justify-center relative bg-surface-container-high shadow-[0_0_30px_rgba(75,226,119,0.15)]">
            <User className="w-16 h-16 text-primary opacity-80" strokeWidth={1.5} />
            <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-20"></div>
          </div>
        </div>
        <h1 className="font-headline font-extrabold text-5xl tracking-tighter text-on-surface pulse-text mb-2">
          You ({new Date().getFullYear() + 5})
        </h1>
        <p className="font-label text-secondary uppercase tracking-[0.2em] text-[11px] font-semibold">
          Future Timeline • Stable Link
        </p>

        <div className="mt-12 flex justify-center gap-8">
          <div className="text-center">
            <p className="text-[10px] uppercase text-on-surface-variant tracking-widest opacity-50 mb-1">Offset</p>
            <p className="font-mono text-sm text-on-surface">+{(5 * 365) + 1} Days</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase text-on-surface-variant tracking-widest opacity-50 mb-1">Signal</p>
            <p className="font-mono text-sm text-primary">99.9%</p>
          </div>
        </div>
      </div>

      <div className="w-full px-12 flex justify-between items-center pb-8 mt-auto">
        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={onDecline}
            className="w-20 h-20 rounded-full bg-error-container/20 border border-error/30 flex items-center justify-center group active:scale-90 transition-transform duration-200 hover:bg-error-container/40"
          >
            <PhoneOff className="w-8 h-8 text-error" />
          </button>
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Decline</span>
        </div>
        
        <div className="w-px h-12 bg-outline-variant/20"></div>
        
        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={onAccept}
            className="w-20 h-20 rounded-full bg-primary-container shadow-[0_0_40px_rgba(34,197,94,0.4)] flex items-center justify-center group active:scale-95 transition-all duration-300 hover:brightness-110"
          >
            <Phone className="w-8 h-8 text-on-primary-container fill-current" />
          </button>
          <span className="font-label text-[10px] uppercase tracking-widest text-primary font-bold">Accept</span>
        </div>
      </div>
    </motion.div>
  );
};

// --- Subcomponents for Sleek HUD ---
const StreamText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    
    // Simulate chunking engine delivery
    const words = text.split(' ');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayed(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 70); // subtle delay per word
    
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
};

const ActiveScreen = ({ onEnd, userData, voice }: { onEnd: () => void, userData: UserData, voice: string; key?: string }) => {
  const { callState, displayedText, handleInterrupt, endCall } = useCallSession(userData, voice);

  // Emotional Modulation Logic Simulation
  // Supportive -> Default, Reflective -> Thinking, Urgent -> Interrupted
  const emotionState = callState === 'interrupted' ? 'urgent' : callState === 'thinking' ? 'reflective' : 'supportive';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col relative z-10 px-6 py-4 h-full w-full max-w-sm mx-auto"
    >
      {/* Target Logic (Layers 1-3) */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-surface-container-highest/60 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-center border border-white/5 transition-all">
          <span className="text-[8px] uppercase tracking-[0.2em] text-primary/70 font-semibold mb-1">Vector_01.Goal</span>
          <span className="text-xs text-on-surface font-medium truncate">{userData.goal}</span>
        </div>
        <div className="flex-1 bg-surface-container-highest/60 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-center border border-white/5 transition-all">
          <span className="text-[8px] uppercase tracking-[0.2em] text-error/70 font-semibold mb-1">Vector_02.Fear</span>
          <span className="text-xs text-on-surface font-medium truncate">{userData.fear}</span>
        </div>
      </div>

      {/* Main Core / Central Waveform */}
      <div className="flex-1 flex flex-col justify-center relative">
        
        {/* Emotional Matrix (Layer 4) */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4">
          <span className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/50 font-bold">Core State</span>
          <div className="flex gap-2 items-center bg-surface-container-highest/50 px-3 py-1.5 rounded-full border border-white/5">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${emotionState === 'supportive' ? 'bg-primary shadow-[0_0_8px_#4be277]' : 'bg-white/20'}`} />
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${emotionState === 'reflective' ? 'bg-[#ffca28] shadow-[0_0_8px_#ffca28]' : 'bg-white/20'}`} />
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${emotionState === 'urgent' ? 'bg-error shadow-[0_0_8px_#ff5449]' : 'bg-white/20'}`} />
          </div>
        </div>

        {/* AI Waveform Engine */}
        <div className="relative h-32 w-full flex items-center justify-center my-8">
           <div className={`absolute inset-0 bg-gradient-radial ${emotionState === 'urgent' ? 'from-error/10' : emotionState === 'reflective' ? 'from-[#ffca28]/10' : 'from-primary/10'} to-transparent opacity-50 blur-xl transition-colors duration-700`} />
           <div className="flex items-center justify-center gap-1.5 relative z-10">
            {[8, 16, 24, 14, 20, 10, 16, 22, 12].map((h, i) => {
              const active = callState === 'listening' || callState === 'thinking';
              return (
                <motion.div 
                  key={i}
                  animate={{ height: active ? [h*1.5, h*2, h*1.5] : [h*2, h*4, h*2] }}
                  transition={{ repeat: Infinity, duration: active ? 2 : 0.8 + (i%3)*0.2, ease: "easeInOut" }}
                  className={`w-1.5 rounded-full transition-colors duration-500 ${emotionState === 'urgent' ? 'bg-error shadow-[0_0_12px_#ff5449]' : emotionState === 'reflective' ? 'bg-[#ffca28] shadow-[0_0_12px_#ffca28]' : 'bg-primary shadow-[0_0_12px_#4be277]'}`}
                  style={{ opacity: active ? 0.3 : 1 }}
                />
              )
            })}
           </div>
        </div>

        {/* Decoder / Transcriber (Layers 5-6) */}
        <div className="flex flex-col text-center px-4 mb-4">
          {callState !== 'interrupted' && (
             <div className="h-0.5 w-full bg-white/5 rounded-full mb-6 overflow-hidden relative">
               {callState === 'thinking' && (
                 <motion.div 
                   animate={{ x: ["-100%", "100%"] }}
                   transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                   className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-[#ffca28] to-transparent opacity-50"
                 />
               )}
             </div>
          )}
          
          <div className="min-h-[100px] flex items-center justify-center px-2">
            {callState === 'interrupted' ? (
               <div className="flex flex-col items-center">
                 <span className="text-error font-bold tracking-[0.2em] uppercase text-xs mb-2">Temporal Override</span>
                 <p className="text-on-surface-variant opacity-70 text-sm">Aborting current generation layer...</p>
               </div>
            ) : callState === 'thinking' ? (
                <span className="text-on-surface-variant/50 text-[11px] uppercase tracking-[0.3em] animate-pulse">Calculating Resonance...</span>
            ) : (
               <p className="text-xl font-light leading-relaxed text-on-surface/90">
                 {displayedText ? <StreamText text={displayedText} /> : <span className="opacity-30">Awaiting Signal...</span>}
               </p>
            )}
          </div>
        </div>
      </div>

      {/* Control Module */}
      <div className="mt-auto pb-6 relative z-20 w-full flex flex-col">
        <div className="bg-surface-container-highest/30 p-2 rounded-[32px] border border-white/5 w-full flex justify-between items-center filter backdrop-blur-xl mb-4">
           {/* End Call */}
           <button 
             onClick={() => { endCall(); onEnd(); }}
             className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center group active:scale-90 transition-all hover:bg-error/20"
           >
             <PhoneOff className="w-6 h-6" />
           </button>
           
           {/* Mic/Override (Layer 8) */}
           <button 
             onClick={handleInterrupt}
             className="relative flex-1 flex justify-center items-center h-16 mx-2 group"
           >
              <div className="absolute inset-0 bg-primary/10 rounded-[24px] group-active:bg-error/20 transition-colors"></div>
              <Mic className={`w-6 h-6 z-10 transition-colors ${callState === 'interrupted' ? 'text-error' : 'text-primary'}`} />
              <span className={`ml-3 font-semibold text-[11px] uppercase tracking-[0.1em] transition-colors z-10 ${callState === 'interrupted' ? 'text-error' : 'text-primary'}`}>
                 Hold to Override
              </span>
           </button>
           
           {/* Logs toggle dummy */}
           <button className="w-16 h-16 rounded-full bg-white/5 text-white/50 flex items-center justify-center group active:scale-90 transition-all hover:text-white/80">
             <Grid3x3 className="w-5 h-5" />
           </button>
        </div>
        
        <p className="text-center text-[9px] uppercase tracking-[0.3em] font-medium text-white/20">Encrypted Matrix Stable</p>
      </div>
    </motion.div>
  );
};

const EndedScreen = ({ onReset }: { onReset: () => void; key?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0 }}
      className="flex-1 w-full flex flex-col items-center justify-center px-8 z-10 h-full"
    >
      <div className="relative w-48 h-48 mb-12">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-secondary-container/20 to-primary/10 animate-pulse"></div>
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
          alt="Temporal Echo"
          className="w-full h-full object-cover rounded-full border border-outline-variant/20 grayscale opacity-40 mix-blend-lighten"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
      </div>

      <div className="text-center space-y-2">
        <p className="font-label text-[12px] uppercase tracking-[0.3em] text-primary font-semibold">Connection Lost</p>
        <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface">Call Ended</h1>
        <p className="font-body text-on-surface/40 text-sm max-w-[280px] mx-auto mt-4 leading-relaxed">
          The temporal window has closed. Your future self has returned to the timeline.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full mt-12 mb-16">
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5">
          <p className="text-[10px] uppercase tracking-wider text-on-surface/40 mb-1">Duration</p>
          <p className="text-xl font-bold text-secondary-fixed-dim">12:44</p>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5">
          <p className="text-[10px] uppercase tracking-wider text-on-surface/40 mb-1">Convergence</p>
          <p className="text-xl font-bold text-primary-fixed-dim">98.2%</p>
        </div>
      </div>

      <div className="w-full space-y-4 mt-auto pb-8">
        <button 
          onClick={onReset}
          className="w-full h-16 bg-primary-container text-on-primary-container font-bold rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-[0_20px_40px_rgba(75,226,119,0.15)]"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Replay</span>
        </button>
        <button 
          onClick={onReset}
          className="w-full h-16 bg-surface-container-high text-on-surface font-semibold rounded-xl border border-outline-variant/15 flex items-center justify-center gap-3 transition-all hover:bg-surface-bright active:scale-95"
        >
          <Shuffle className="w-5 h-5" />
          <span>Try another future</span>
        </button>
        <div className="pt-4 flex justify-center">
          <button 
            onClick={onReset}
            className="text-on-surface/30 text-[10px] uppercase tracking-[0.2em] font-bold hover:text-on-surface transition-colors"
          >
            Return to Timeline
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<Step>('splash');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [voice, setVoice] = useState<string | null>(null);

  const [scale, setScale] = useState(() => {
    if (typeof window !== 'undefined') {
      const padding = window.innerWidth < 640 ? 32 : 64;
      const availableWidth = window.innerWidth - padding;
      const availableHeight = window.innerHeight - padding;
      return Math.min(1, Math.min(availableWidth / 430, availableHeight / 852));
    }
    return 1;
  });

  useEffect(() => {
    const handleResize = () => {
      const padding = window.innerWidth < 640 ? 32 : 64;
      const availableWidth = window.innerWidth - padding;
      const availableHeight = window.innerHeight - padding;
      setScale(Math.min(1, Math.min(availableWidth / 430, availableHeight / 852)));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Background effects based on step
  const getBackgroundEffects = () => {
    switch(step) {
      case 'splash':
        return null;
      case 'setup':
        return (
          <>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-container/10 rounded-full blur-[100px] pointer-events-none"></div>
          </>
        );
      case 'incoming':
        return (
          <>
            <div className="absolute inset-0 bg-glow-portal pointer-events-none"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary-container/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none"></div>
          </>
        );
      case 'active':
        return (
          <>
            <div className="absolute top-[20%] left-[-10%] w-[120%] h-[40%] bg-secondary/10 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[100%] h-[30%] bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
          </>
        );
      case 'ended':
        return (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-full bg-secondary/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
          </>
        );
    }
  };

  return (
    <div className="relative h-[100dvh] w-full bg-[#0a0a0a] overflow-hidden">
      {/* Mobile Container */}
      <main 
        style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '430px', 
          height: '852px', 
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="z-10 bg-surface border border-outline-variant/15 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
      >
        {getBackgroundEffects()}
        
        {step !== 'splash' && (
          <TopBar 
            title={step === 'ended' ? 'Temporal Link Terminated' : 'Future You Calling'} 
            showLive={step === 'active'} 
          />
        )}

        <AnimatePresence mode="wait">
          {step === 'splash' && (
            <SplashScreen 
              key="splash" 
              onComplete={() => setStep('setup')} 
            />
          )}
          {step === 'setup' && (
            <SetupScreen 
              key="setup" 
              onNext={(data) => { setUserData(data); setStep('incoming'); }} 
            />
          )}
          {step === 'incoming' && (
            <IncomingScreen 
              key="incoming" 
              onAccept={() => setStep('active')} 
              onDecline={() => setStep('ended')} 
            />
          )}
          {step === 'active' && (
            <ConversationProvider>
              <ActiveScreen 
                key="active" 
                userData={userData!}
                voice={voice!}
                onEnd={() => setStep('ended')} 
              />
            </ConversationProvider>
          )}
          {step === 'ended' && (
            <EndedScreen 
              key="ended" 
              onReset={() => { setUserData(null); setStep('setup'); }} 
            />
          )}
        </AnimatePresence>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-on-surface/20 rounded-full z-50"></div>
      </main>
    </div>
  );
}
