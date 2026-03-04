import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MessageSquare, 
  Share2, 
  Camera, 
  Users, 
  Phone, 
  Shield, 
  FileUp, 
  Monitor 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: MessageSquare,
    title: 'Instant Messaging',
    description: 'Real-time chats with read receipts and typing indicators.',
    color: '#25D366'
  },
  {
    icon: Share2,
    title: 'Social Feed',
    description: 'Share updates, photos, and moments with your network.',
    color: '#1877F2'
  },
  {
    icon: Camera,
    title: 'Stories',
    description: 'Share disappearing photos and videos that last 24 hours.',
    color: '#E4405F'
  },
  {
    icon: Users,
    title: 'Groups',
    description: 'Create communities around shared interests and goals.',
    color: '#7B68EE'
  },
  {
    icon: Phone,
    title: 'Voice & Video',
    description: 'Crystal-clear calls with anyone, anywhere.',
    color: '#00A400'
  },
  {
    icon: Shield,
    title: 'End-to-End Encryption',
    description: 'Your conversations stay private and secure.',
    color: '#128C7E'
  },
  {
    icon: FileUp,
    title: 'File Sharing',
    description: 'Send documents, photos, and videos up to 2GB.',
    color: '#FF6B6B'
  },
  {
    icon: Monitor,
    title: 'Cross-Platform',
    description: 'Available on iOS, Android, Web, and Desktop.',
    color: '#4A90E2'
  }
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (!section || !cards) return;

    const cardElements = cards.querySelectorAll('.feature-card');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardElements,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
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
    <section id="features" ref={sectionRef} className="section" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="heading-2" style={{ marginBottom: '16px' }}>
            Everything you need to stay connected
          </h2>
          <p className="body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Hellouza combines the best of messaging and social media in one powerful platform.
          </p>
        </div>

        <div 
          ref={cardsRef}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card card card-hover"
                style={{ padding: '28px' }}
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
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>
                  {feature.title}
                </h3>
                <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
