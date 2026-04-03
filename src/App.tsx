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
type Step = 'splash' | 'setup' | 'voice' | 'incoming' | 'active' | 'ended';

interface UserData {
  name: string;
  goal: string;
  fear: string;
}

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

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
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

const SetupScreen = ({ onNext }: { onNext: (data: UserData) => void }) => {
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

const VoiceScreen = ({ onNext }: { onNext: (voice: string) => void }) => {
  const [selected, setSelected] = useState('mentor');

  const voices = [
    { id: 'mentor', name: 'The Mentor', desc: 'Calm, wise, and grounded.', icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10' },
    { id: 'adventurer', name: 'The Adventurer', desc: 'Energetic, inspiring, and bold.', icon: Compass, color: 'text-secondary', bg: 'bg-secondary/10' },
    { id: 'stoic', name: 'The Stoic', desc: 'Resilient, direct, and pragmatic.', icon: Shield, color: 'text-tertiary', bg: 'bg-tertiary/10' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 px-8 pt-4 pb-12 flex flex-col justify-between items-center text-center h-full"
    >
      <div className="w-full">
        <span className="font-label text-[11px] uppercase tracking-[0.3em] text-secondary mb-2 block">TRANS-CHRONAL CONFIGURATION</span>
        <h1 className="text-3xl font-black text-on-surface tracking-tighter leading-tight">Select Your Future Voice</h1>
        <p className="text-on-surface-variant text-sm mt-4 font-light leading-relaxed max-w-[280px] mx-auto">
          The acoustic texture of your future self determines the emotional resonance of the link.
        </p>
      </div>

      <div className="w-full space-y-4 my-8">
        {voices.map((v) => {
          const isActive = selected === v.id;
          const Icon = v.icon;
          return (
            <div 
              key={v.id}
              onClick={() => setSelected(v.id)}
              className={`flex items-center p-5 rounded-2xl transition-all duration-300 cursor-pointer group ${isActive ? 'bg-primary/5 outline outline-1 outline-primary/40' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
            >
              <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mr-4`}>
                <Icon className={`w-6 h-6 ${v.color}`} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-on-surface font-bold text-lg">{v.name}</h3>
                <p className="text-on-surface-variant text-xs font-medium">{v.desc}</p>
              </div>
              <button className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${isActive ? 'border-primary text-primary' : 'border-white/10 text-white/60 hover:text-primary hover:border-primary'}`}>
                <Play className="w-4 h-4 ml-1" />
              </button>
            </div>
          )
        })}
      </div>

      <div className="w-full px-2 relative z-10 mt-auto">
        <button 
          onClick={() => onNext(selected)}
          className="w-full py-5 bg-primary-container text-on-primary-container font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_20px_40px_rgba(34,197,94,0.2)] hover:scale-[0.98] transition-transform flex items-center justify-center group"
        >
          Confirm Voice
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="mt-6 flex justify-center items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
          <span className="text-[9px] font-label uppercase tracking-[0.2em] text-white/30">Encryption Active - Temporal Relay Ready</span>
        </div>
      </div>
    </motion.div>
  );
};

const IncomingScreen = ({ onAccept, onDecline }: { onAccept: () => void, onDecline: () => void }) => {
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
          You (2029)
        </h1>
        <p className="font-label text-secondary uppercase tracking-[0.2em] text-[11px] font-semibold">
          Future Timeline • Stable Link
        </p>

        <div className="mt-12 flex justify-center gap-8">
          <div className="text-center">
            <p className="text-[10px] uppercase text-on-surface-variant tracking-widest opacity-50 mb-1">Offset</p>
            <p className="font-mono text-sm text-on-surface">+1,826 Days</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase text-on-surface-variant tracking-widest opacity-50 mb-1">Signal</p>
            <p className="font-mono text-sm text-primary">98.4%</p>
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

const ActiveScreen = ({ onEnd }: { onEnd: () => void }) => {
  const fullText = "Listen carefully, the decision you make tomorrow at the meeting will redefine the trajectory of the next five years. Don't play it safe...";
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col relative z-10 px-8 py-4 h-full w-full"
    >
      <div className="mt-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-on-surface-variant mb-2">Temporal Connection Active</p>
        <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">You (2029)</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          <span className="text-primary text-sm font-medium tracking-wide">Connected</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8 my-8 overflow-hidden">
        {/* AI Waveform */}
        <div className="relative h-24 w-full flex items-center justify-center waveform-mask">
          <div className="absolute inset-0 flex items-center justify-around">
            {[8, 16, 24, 14, 20, 10, 16, 22, 12].map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: [h*2, h*4, h*2] }}
                transition={{ repeat: Infinity, duration: 0.8 + (i%3)*0.2, ease: "easeInOut" }}
                className={`w-1.5 rounded-full ${i%2===0 ? 'bg-secondary shadow-[0_0_12px_#d0bcff]' : 'bg-primary shadow-[0_0_15px_#4be277]'}`}
              />
            ))}
          </div>
          <div className="text-[10px] absolute -top-2 left-0 uppercase tracking-widest text-secondary font-bold opacity-80">Incoming Signal</div>
        </div>

        {/* Transcription */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="px-4 py-1 rounded-full bg-surface-container-high/40 backdrop-blur-md border border-outline-variant/10">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-[0.2em]">Speaking...</span>
          </div>
          <div className="min-h-[120px] flex items-center px-4">
            <p className="text-2xl font-medium leading-tight text-on-surface/90 italic">
              "{displayedText}"
            </p>
          </div>
          <p className="text-[10px] font-medium text-on-surface-variant/50 uppercase tracking-widest">Tap or speak to interrupt</p>
        </div>

        {/* User Waveform */}
        <div className="relative h-16 w-full flex items-center justify-center waveform-mask">
          <div className="absolute inset-0 flex items-center justify-center gap-1.5">
             {[2,3,2,4,2,3,2,4,2].map((h, i) => (
              <div key={i} className="w-1 bg-tertiary rounded-full shadow-[0_0_8px_#afc7ff]" style={{ height: `${h*4}px` }} />
            ))}
          </div>
          <div className="text-[10px] absolute -bottom-2 left-0 uppercase tracking-widest text-tertiary font-bold opacity-80">Local Feed</div>
        </div>
      </div>

      <div className="mt-auto pb-8 flex flex-col items-center gap-8">
        <div className="flex items-center justify-center gap-12">
          <button className="flex flex-col items-center justify-center text-on-surface/40 hover:text-secondary transition-colors group">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-surface-container-high/50 group-hover:bg-surface-container-high transition-all mb-2">
              <Volume2 className="w-6 h-6" />
            </div>
            <span className="font-label text-[11px] font-semibold uppercase tracking-widest">Speaker</span>
          </button>
          
          <button className="relative group">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-50 group-active:opacity-100 transition-opacity"></div>
            <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center text-on-primary-container shadow-[0_0_30px_rgba(75,226,119,0.3)] group-active:scale-90 duration-200">
              <Mic className="w-8 h-8 fill-current" />
            </div>
            <div className="mt-4 font-label text-[11px] font-bold text-primary uppercase tracking-widest text-center">Active</div>
          </button>

          <button className="flex flex-col items-center justify-center text-on-surface/40 hover:text-secondary transition-colors group">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-surface-container-high/50 group-hover:bg-surface-container-high transition-all mb-2">
              <Grid3x3 className="w-6 h-6" />
            </div>
            <span className="font-label text-[11px] font-semibold uppercase tracking-widest">Keypad</span>
          </button>
        </div>

        <button 
          onClick={onEnd}
          className="w-full h-16 rounded-2xl bg-error-container text-on-error-container font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-[#93000a] active:scale-95 transition-all duration-300"
        >
          <PhoneOff className="w-5 h-5" />
          End Connection
        </button>
      </div>
    </motion.div>
  );
};

const EndedScreen = ({ onReset }: { onReset: () => void }) => {
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
      case 'voice':
        return (
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none"></div>
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
            title={step === 'ended' ? 'Temporal Link Terminated' : step === 'voice' ? 'Signal_Status' : 'Future You Calling'} 
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
              onNext={(data) => { setUserData(data); setStep('voice'); }} 
            />
          )}
          {step === 'voice' && (
            <VoiceScreen 
              key="voice" 
              onNext={(v) => { setVoice(v); setStep('incoming'); }} 
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
            <ActiveScreen 
              key="active" 
              onEnd={() => setStep('ended')} 
            />
          )}
          {step === 'ended' && (
            <EndedScreen 
              key="ended" 
              onReset={() => { setUserData(null); setVoice(null); setStep('setup'); }} 
            />
          )}
        </AnimatePresence>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-on-surface/20 rounded-full z-50"></div>
      </main>
    </div>
  );
}
