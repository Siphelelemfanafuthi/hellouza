import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lock, Timer, Shield, Eye, FileKey, UserCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Your messages are secured with the same encryption used by banks and governments. Only you and the recipient can read them.',
    color: '#25D366'
  },
  {
    icon: Timer,
    title: 'Disappearing Messages',
    description: 'Set messages to automatically delete after 24 hours, 7 days, or 90 days. Your conversations, your control.',
    color: '#E4405F'
  },
  {
    icon: Shield,
    title: 'Two-Step Verification',
    description: 'Add an extra layer of security to your account with PIN-based verification for new device logins.',
    color: '#1877F2'
  }
];

const stats = [
  { icon: Eye, label: 'No ads targeting', value: '100% Private' },
  { icon: FileKey, label: 'Encrypted chats', value: '2B+ Daily' },
  { icon: UserCheck, label: 'User control', value: 'Full Access' }
];

export default function PrivacySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelectorAll('.animate-item'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <div ref={contentRef}>
          {/* Header */}
          <div className="animate-item" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              marginBottom: '24px'
            }}>
              <Lock size={36} color="white" />
            </div>
            <h2 className="heading-2" style={{ marginBottom: '16px' }}>
              Your privacy matters
            </h2>
            <p className="body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>
              We believe privacy is a fundamental right. That's why Hellouza is built with security at its core.
            </p>
          </div>

          {/* Features Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '64px'
          }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="animate-item card"
                  style={{ padding: '32px' }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: `${feature.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <Icon size={28} style={{ color: feature.color }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>
                    {feature.title}
                  </h3>
                  <p className="body-text">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="animate-item" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            flexWrap: 'wrap',
            padding: '32px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-card)'
          }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} style={{ textAlign: 'center' }}>
                  <Icon size={28} style={{ color: 'var(--primary-green)', marginBottom: '12px' }} />
                  <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {stat.value}
                  </p>
                  <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
