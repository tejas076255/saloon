import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroVideoSection } from '../components/hero/HeroVideoSection';
import { PainPointsSection } from '../components/marketing/PainPointsSection';
import { BillingWorkflowSection } from '../components/marketing/BillingWorkflowSection';
import { FeatureShowcaseSection } from '../components/marketing/FeatureShowcaseSection';
import { ReportsAnalyticsSection } from '../components/marketing/ReportsAnalyticsSection';
import { PricingSection } from '../components/marketing/PricingSection';
import { FaqSection } from '../components/marketing/FaqSection';
import { ConversionCtaSection } from '../components/marketing/ConversionCtaSection';
import { Footer } from '../components/layout/Footer';
import { AuthModal } from '../features/auth/AuthModal';
import { useAuth } from '../lib/auth/AuthContext';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const { isAuthenticated, loginDemo } = useAuth();

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleStartTrial = () => {
    if (isAuthenticated) {
      onEnterDashboard();
    } else {
      handleOpenAuth('signup');
    }
  };

  const handleWatchDemo = async () => {
    // 1-Click Interactive Demo login
    await loginDemo();
    onEnterDashboard();
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-brand-purple/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onNavigateToDashboard={onEnterDashboard}
      />

      {/* Main Marketing Sections */}
      <main className="flex-1">
        {/* 1. Cinematic 3D Video Hero */}
        <HeroVideoSection
          onStartTrial={handleStartTrial}
          onWatchDemo={handleWatchDemo}
        />

        {/* 2. Salon Owner Pain Points & Solutions */}
        <PainPointsSection />

        {/* 3. Fast POS Billing Workflow Demo */}
        <BillingWorkflowSection />

        {/* 4. Product Feature Showcase */}
        <FeatureShowcaseSection />

        {/* 5. Real-Time Reports & Analytics */}
        <ReportsAnalyticsSection />

        {/* 6. Pricing Plans */}
        <PricingSection onSelectPlan={() => handleStartTrial()} />

        {/* 7. Frequently Asked Questions */}
        <FaqSection />

        {/* 8. Conversion CTA */}
        <ConversionCtaSection
          onStartTrial={handleStartTrial}
          onTryDemo={handleWatchDemo}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          onEnterDashboard();
        }}
      />
    </div>
  );
};
