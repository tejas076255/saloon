import React, { useState, useRef } from 'react';
import { ArrowRight, Play, Pause, ShieldCheck, Zap, BarChart3, Users, CheckCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Hero3DCanvas } from './Hero3DCanvas';
import { TabletMockup } from './TabletMockup';
import { MobileMockup } from './MobileMockup';

interface HeroProps {
  onStartTrial: () => void;
  onWatchDemo: () => void;
}

export const HeroVideoSection: React.FC<HeroProps> = ({ onStartTrial, onWatchDemo }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden pt-28 pb-16 bg-dark-950">
      {/* 3D Three.js particle overlay */}
      <Hero3DCanvas />

      {/* Background ambient radial gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/15 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-brand-violet hover:border-brand-violet/40 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-brand-violet animate-ping" />
              <span>The All-in-One Salon & Barber Shop Management System</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-display">
              Run Your Salon <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Smarter,
              </span>{' '}
              <span className="bg-gradient-to-r from-brand-violet via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Not Harder.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Manage billing, customers, daily sales and salon operations in one powerful platform built for modern salon owners.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartTrial}
                id="hero-primary-cta"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-purple via-brand-violet to-indigo-600 text-white font-semibold text-base shadow-xl shadow-brand-purple/25 hover:shadow-brand-purple/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onWatchDemo}
                id="hero-secondary-cta"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-base border border-white/10 hover:border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-brand-gold fill-brand-gold" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Zap className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="font-medium">Fast Billing</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Users className="w-4 h-4 text-brand-violet shrink-0" />
                <span className="font-medium">Customer Records</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">Daily Reports</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-medium">Secure Workspace</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Video Hero + Floating Tablet & Mobile Mockups */}
          <div className="lg:col-span-6 relative">
            {/* Visual Frame */}
            <div className="relative rounded-3xl overflow-hidden p-1.5 bg-gradient-to-b from-brand-violet/30 via-white/10 to-transparent shadow-2xl backdrop-blur-2xl">
              
              {/* Cinematic Video Background Frame */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-[1.3rem] overflow-hidden bg-slate-950">
                
                {/* HTML5 Cinematic Video with Loop, Autoplay, Muted, playsInline */}
                {!videoError ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    poster="/posters/salon-hero-poster.jpg"
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-cover transition-opacity duration-700"
                    aria-label="Cinematic 3D Luxury Salon Experience"
                  >
                    <source src="/videos/salon-hero.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src="/posters/salon-hero-poster.jpg"
                    alt="Luxury Salon Interior"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Dark Vignette and Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-950/60 via-transparent to-dark-950/40 pointer-events-none" />

                {/* Video HUD badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900/80 backdrop-blur-md border border-white/10 text-[10px] text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>4K 3D Salon Environment</span>
                </div>

                {/* Video Play/Pause & Mute Controls */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    className="w-7 h-7 rounded-full bg-dark-900/80 hover:bg-dark-800 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    className="w-7 h-7 rounded-full bg-dark-900/80 hover:bg-dark-800 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                </div>

                {/* Floating Tablet Mockup Overlay positioned over video */}
                <div className="absolute left-6 right-6 bottom-6 z-20 transform scale-90 sm:scale-100 origin-bottom transition-all">
                  <TabletMockup />
                </div>
              </div>
            </div>

            {/* Floating Mobile POS Mockup (layered overlapping the right bottom corner) */}
            <div className="hidden sm:block absolute -right-6 -bottom-10 z-30 transform hover:-translate-y-2 transition-transform duration-300 drop-shadow-2xl">
              <MobileMockup />
            </div>

            {/* Ambient decorative glow badge */}
            <div className="absolute -top-4 -left-4 z-30 px-3.5 py-1.5 rounded-xl bg-dark-850/90 border border-brand-violet/40 backdrop-blur-xl shadow-xl flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-[11px] font-semibold text-white">Live Multi-Tenant Cloud</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Strip below Hero */}
      <div className="mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
          
          <div className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-brand-violet/20 border border-brand-violet/30 flex items-center justify-center text-brand-violet shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Easy Booking & Scheduling</div>
              <div className="text-xs text-slate-400">Zero wait times</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Customer Management</div>
              <div className="text-xs text-slate-400">Notes & history</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Quick & Accurate Billing</div>
              <div className="text-xs text-slate-400">3-click POS</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Real-Time Reports</div>
              <div className="text-xs text-slate-400">Daily sales & CSV</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
