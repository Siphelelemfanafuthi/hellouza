import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Bell, Check, Save } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface NotificationsSectionProps {
  className?: string;
}

export default function NotificationsSection({ className = '' }: NotificationsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['daily']);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const notification = notificationRef.current;
    const settings = settingsRef.current;

    if (!section || !heading || !notification || !settings) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      // ENTRANCE (0%-30%)
      scrollTl.fromTo(
        heading,
        { x: '-10vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        notification,
        { x: '-30vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        settings,
        { x: '30vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.12
      );

      // SETTLE (30%-70%): Hold

      // EXIT (70%-100%)
      scrollTl.fromTo(
        [notification, settings],
        { y: 0, opacity: 1 },
        { y: '-12vh', opacity: 0, ease: 'power2.in', stagger: 0.03 },
        0.70
      );

      scrollTl.fromTo(
        heading,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.80
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  return (
    <section ref={sectionRef} className={`section section-pinned ${className}`} style={{ zIndex: 100 }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 7vw',
        gap: '4vw'
      }}>
        {/* Left Content */}
        <div style={{ flex: 1.1 }}>
          <div ref={headingRef} style={{ marginBottom: '32px' }}>
            <h2 className="heading-2" style={{ marginBottom: '12px' }}>Never miss an opportunity.</h2>
            <p className="body-text">Get new roles delivered to your inbox.</p>
          </div>
          
          <div ref={notificationRef} className="card" style={{
            padding: '32px',
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--pastel-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Mail size={22} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p className="body-small" style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>
                    GlobalJobFinder
                  </p>
                  <p style={{ fontWeight: 600 }}>New roles match your profile</p>
                </div>
              </div>
              
              <div style={{
                padding: '16px',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-medium)',
                marginBottom: '16px'
              }}>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>Product Designer at Orbit Studio</p>
                <p className="body-small" style={{ color: 'var(--text-secondary)' }}>Remote • Full-time</p>
              </div>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%' }}>
              <Bell size={18} style={{ marginRight: '8px' }} />
              Turn on alerts
            </button>
          </div>
        </div>
        
        {/* Right Content - Settings Card */}
        <div ref={settingsRef} style={{ flex: 0.9 }}>
          <div className="card card-pastel-lavender" style={{
            padding: '32px',
            minHeight: '320px'
          }}>
            <h3 className="heading-3" style={{ marginBottom: '24px' }}>Alert settings</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                { id: 'daily', label: 'Daily digest' },
                { id: 'instant', label: 'Instant alerts' },
                { id: 'recommended', label: 'Recommended only' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'white',
                    borderRadius: 'var(--radius-medium)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <span>{option.label}</span>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: selectedOptions.includes(option.id) ? 'var(--accent)' : '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedOptions.includes(option.id) && <Check size={14} color="white" />}
                  </div>
                </button>
              ))}
            </div>
            
            <button className="btn btn-outline" style={{ width: '100%' }}>
              <Save size={18} style={{ marginRight: '8px' }} />
              Save preferences
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
