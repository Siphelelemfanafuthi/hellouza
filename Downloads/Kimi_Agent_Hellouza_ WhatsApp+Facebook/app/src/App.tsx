import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import MessagingDemo from './sections/MessagingDemo';
import FeedDemo from './sections/FeedDemo';
import StoriesSection from './sections/StoriesSection';
import GroupsSection from './sections/GroupsSection';
import PrivacySection from './sections/PrivacySection';
import TestimonialsSection from './sections/TestimonialsSection';
import DownloadSection from './sections/DownloadSection';
import LoginSection from './sections/LoginSection';
import ChatInterface from './sections/ChatInterface';
import FeedInterface from './sections/FeedInterface';
import ProfileInterface from './sections/ProfileInterface';
import FooterSection from './sections/FooterSection';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // Initialize scroll animations
    ScrollTrigger.refresh();
  }, [showApp]);

  if (showApp) {
    return (
      <div className="app-interface">
        <Navigation inApp={true} onBack={() => setShowApp(false)} />
        <main className="app-main">
          <ChatInterface />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Navigation inApp={false} onEnterApp={() => setShowApp(true)} />
      <main className="main-content">
        <HeroSection />
        <FeaturesSection />
        <MessagingDemo />
        <FeedDemo />
        <StoriesSection />
        <GroupsSection />
        <PrivacySection />
        <TestimonialsSection />
        <DownloadSection />
        <LoginSection onLogin={() => setShowApp(true)} />
        <ChatInterface />
        <FeedInterface />
        <ProfileInterface />
        <FooterSection />
      </main>
    </div>
  );
}

export default App;
