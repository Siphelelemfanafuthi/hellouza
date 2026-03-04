import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Apple, Smartphone, Monitor, QrCode } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const platforms = [
  {
    icon: Apple,
    name: 'App Store',
    description: 'Download for iPhone and iPad'
  },
  {
    icon: Smartphone,
    name: 'Google Play',
    description: 'Download for Android devices'
  },
  {
    icon: Monitor,
    name: 'Desktop',
    description: 'Download for Mac and Windows'
  }
];

export default function DownloadSection() {
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
    <section id="download" ref={sectionRef} className="section" style={{ 
      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'
    }}>
      <div className="container">
        <div ref={contentRef} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '64px',
          flexWrap: 'wrap'
        }}>
          {/* Left Content */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 className="animate-item heading-1" style={{ color: 'white', marginBottom: '20px' }}>
              Get Hellouza today
            </h2>
            <p className="animate-item body-text" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: '32px' }}>
              Available on all your favorite devices. Start connecting in seconds.
            </p>
            
            <div className="animate-item" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {platforms.map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px 20px',
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    }}
                  >
                    <Icon size={28} color="white" />
                    <div>
                      <p style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>{platform.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{platform.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="animate-item" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
              Free to download. No ads. No subscription fees.
            </p>
          </div>

          {/* Right - QR Code */}
          <div className="animate-item" style={{ 
            flex: 1, 
            minWidth: '300px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
            }}>
              <div style={{
                width: '200px',
                height: '200px',
                background: 'var(--bg-light)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <QrCode size={120} style={{ color: 'var(--text-primary)' }} />
              </div>
              <p style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>
                Scan to download
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Point your camera at the QR code
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
