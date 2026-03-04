import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Users, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const phonesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const phones = phonesRef.current;

    if (!section || !content || !phones) return;

    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        content.querySelectorAll('.animate-item'),
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.15, 
          duration: 0.8, 
          ease: 'power2.out',
          delay: 0.3
        }
      );

      gsap.fromTo(
        phones.querySelectorAll('.phone-mockup'),
        { y: 60, opacity: 0, rotateY: -15 },
        { 
          y: 0, 
          opacity: 1, 
          rotateY: 0,
          stagger: 0.2, 
          duration: 1, 
          ease: 'power2.out',
          delay: 0.5
        }
      );

      // Floating bubbles animation
      gsap.to('.floating-bubble', {
        y: -20,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.3,
          from: 'random'
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating Bubbles Background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-bubble"
            style={{
              position: 'absolute',
              width: `${60 + Math.random() * 100}px`,
              height: `${60 + Math.random() * 100}px`,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
        {/* Left Content */}
        <div ref={contentRef} style={{ flex: 1, minWidth: '320px', maxWidth: '600px', zIndex: 1 }}>
          <div className="animate-item" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(255,255,255,0.15)',
            padding: '8px 16px',
            borderRadius: '50px',
            marginBottom: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <MessageSquare size={16} style={{ color: 'white' }} />
            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>The future of connection</span>
          </div>
          
          <h1 className="animate-item heading-1" style={{ color: 'white', marginBottom: '20px' }}>
            Connect. Share. Belong.
          </h1>
          
          <p className="animate-item body-text" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: '32px' }}>
            The all-in-one messaging and social platform that brings people together. 
            Chat privately, share publicly, and build communities that matter.
          </p>
          
          <div className="animate-item" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#download" className="btn btn-white">
              Get Started <ArrowRight size={18} />
            </a>
            <a href="#features" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
              Learn More
            </a>
          </div>

          <div className="animate-item" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '24px', 
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: 'white' }} />
              <span style={{ color: 'white', fontSize: '14px' }}>10M+ Users</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.3)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} style={{ color: 'white' }} />
              <span style={{ color: 'white', fontSize: '14px' }}>1B+ Messages</span>
            </div>
          </div>
        </div>

        {/* Right Content - Phone Mockups */}
        <div ref={phonesRef} style={{ flex: 1, minWidth: '320px', display: 'flex', justifyContent: 'center', gap: '24px', perspective: '1000px' }}>
          {/* Chat Phone */}
          <div className="phone-mockup" style={{
            width: '280px',
            height: '560px',
            background: '#111B21',
            borderRadius: '36px',
            padding: '12px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            transform: 'rotateY(5deg) translateZ(20px)'
          }}>
            <div style={{
              height: '100%',
              background: '#111B21',
              borderRadius: '28px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Chat Header */}
              <div style={{ 
                padding: '12px 16px', 
                background: '#202C33',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ position: 'relative' }}>
                  <img src="/avatar_1.jpg" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div className="online-indicator" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>Sarah Chen</p>
                  <p style={{ color: '#8696A0', fontSize: '12px' }}>online</p>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
                <div className="chat-bubble chat-bubble-received">
                  Hey! How's it going? 🌟
                </div>
                <div className="chat-bubble chat-bubble-sent">
                  Great! Just finished a project. You?
                </div>
                <div className="chat-bubble chat-bubble-received">
                  That's awesome! Want to grab coffee later?
                </div>
                <div className="typing-indicator" style={{ marginTop: '8px' }}>
                  <span /><span /><span />
                </div>
              </div>
              
              {/* Chat Input */}
              <div style={{ padding: '10px', background: '#202C33', display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, background: '#2A3942', borderRadius: '20px', height: '40px' }} />
              </div>
            </div>
          </div>

          {/* Feed Phone */}
          <div className="phone-mockup" style={{
            width: '280px',
            height: '560px',
            background: 'white',
            borderRadius: '36px',
            padding: '12px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            transform: 'rotateY(-5deg) translateZ(-20px) translateY(30px)'
          }}>
            <div style={{
              height: '100%',
              background: '#F0F2F5',
              borderRadius: '28px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Feed Header */}
              <div style={{ 
                padding: '12px 16px', 
                background: 'white',
                borderBottom: '1px solid #E4E6EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontWeight: 700, fontSize: '18px', color: '#1877F2' }}>hellouza</span>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#E4E6EB', borderRadius: '50%' }} />
                  <div style={{ width: '24px', height: '24px', background: '#E4E6EB', borderRadius: '50%' }} />
                </div>
              </div>
              
              {/* Stories */}
              <div style={{ padding: '12px', background: 'white', display: 'flex', gap: '12px', borderBottom: '1px solid #E4E6EB' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div className="story-ring" style={{ width: '56px', height: '56px' }}>
                      <img src={`/avatar_${i}.jpg`} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Post */}
              <div style={{ margin: '12px', background: 'white', borderRadius: '12px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <img src="/avatar_2.jpg" alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>Michael Torres</p>
                    <p style={{ fontSize: '12px', color: '#65676B' }}>2 hours ago</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', marginBottom: '10px' }}>Beautiful sunset today! 🌅</p>
                <img src="/photo_1.jpg" alt="" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
