import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface NewsletterSectionProps {
  className?: string;
}

export default function NewsletterSection({ className = '' }: NewsletterSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // Flowing section - simple reveal animation
      gsap.fromTo(
        content.querySelectorAll('.animate-in'),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className={`section section-flowing ${className}`} 
      style={{ 
        zIndex: 110, 
        background: 'var(--bg-secondary)',
        padding: '10vh 7vw 6vh'
      }}
    >
      <div ref={contentRef} style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="animate-in" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="heading-2" style={{ color: 'white', marginBottom: '12px' }}>
            Stay in the loop.
          </h2>
          <p className="body-text" style={{ color: 'rgba(255,255,255,0.7)' }}>
            One email a week. No spam. Unsubscribe anytime.
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="animate-in" style={{ marginBottom: '60px' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            background: 'rgba(255,255,255,0.1)',
            padding: '8px',
            borderRadius: 'var(--radius-large)',
            backdropFilter: 'blur(10px)'
          }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '15px',
                fontFamily: 'Inter, sans-serif',
                background: 'transparent',
                color: 'white',
                padding: '0 16px'
              }}
            />
            <button 
              type="submit"
              className="btn"
              style={{ 
                background: 'var(--accent)', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {subscribed ? (
                <>
                  <Check size={18} /> Subscribed!
                </>
              ) : (
                <>
                  <Send size={18} /> Subscribe
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Footer Links */}
        <div className="animate-in" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
          paddingTop: '40px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          {[
            {
              title: 'Product',
              links: ['Search', 'Alerts', 'Companies', 'Salaries']
            },
            {
              title: 'Resources',
              links: ['Blog', 'Guides', 'Help Center', 'API']
            },
            {
              title: 'Company',
              links: ['About', 'Careers', 'Press', 'Contact']
            },
            {
              title: 'Legal',
              links: ['Privacy', 'Terms', 'Cookies']
            }
          ].map((column, index) => (
            <div key={index}>
              <h4 style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                {column.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '14px',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
