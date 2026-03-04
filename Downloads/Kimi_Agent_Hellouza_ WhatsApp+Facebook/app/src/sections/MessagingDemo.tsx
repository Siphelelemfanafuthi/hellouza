import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, CheckCheck, Smile, Mic, Paperclip } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  'Send text, voice, photos, and videos',
  'See when messages are delivered and read',
  'React with emojis to any message',
  'Reply to specific messages',
  'Forward messages to multiple chats'
];

const messages = [
  { text: "Hey! Are we still on for dinner tonight?", sent: false, time: "6:30 PM" },
  { text: "Yes! Looking forward to it 🍽️", sent: true, time: "6:32 PM", read: true },
  { text: "Great! I found this amazing Italian place", sent: false, time: "6:33 PM" },
  { text: "Perfect! What time should I pick you up?", sent: true, time: "6:35 PM", read: true },
  { text: "How about 7:30?", sent: false, time: "6:36 PM" },
];

export default function MessagingDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelectorAll('.animate-item'),
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '64px',
          flexWrap: 'wrap'
        }}>
          {/* Left - Phone Mockup */}
          <div style={{ 
            flex: 1, 
            minWidth: '300px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '320px',
              height: '640px',
              background: '#111B21',
              borderRadius: '40px',
              padding: '14px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                height: '100%',
                background: '#111B21',
                borderRadius: '32px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Header */}
                <div style={{ 
                  padding: '14px 18px', 
                  background: '#202C33',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <img src="/avatar_3.jpg" alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontSize: '15px', fontWeight: 600 }}>Emma Wilson</p>
                    <p style={{ color: '#8696A0', fontSize: '12px' }}>typing...</p>
                  </div>
                </div>
                
                {/* Messages */}
                <div style={{ 
                  flex: 1, 
                  padding: '18px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '10px',
                  overflowY: 'auto'
                }}>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        alignSelf: msg.sent ? 'flex-end' : 'flex-start',
                        maxWidth: '75%'
                      }}
                    >
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: msg.sent ? '#DCF8C6' : 'white',
                          borderBottomRightRadius: msg.sent ? '4px' : '12px',
                          borderBottomLeftRadius: msg.sent ? '12px' : '4px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                        }}
                      >
                        <p style={{ fontSize: '14px', color: '#111B21', lineHeight: 1.4 }}>{msg.text}</p>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'flex-end',
                          gap: '4px',
                          marginTop: '4px'
                        }}>
                          <span style={{ fontSize: '10px', color: '#8696A0' }}>{msg.time}</span>
                          {msg.sent && (
                            msg.read ? 
                              <CheckCheck size={12} style={{ color: '#53BDEB' }} /> :
                              <Check size={12} style={{ color: '#8696A0' }} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Input */}
                <div style={{ 
                  padding: '12px', 
                  background: '#202C33', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Smile size={24} style={{ color: '#8696A0', cursor: 'pointer' }} />
                  <Paperclip size={24} style={{ color: '#8696A0', cursor: 'pointer' }} />
                  <div style={{ 
                    flex: 1, 
                    background: '#2A3942', 
                    borderRadius: '20px', 
                    padding: '10px 16px',
                    color: '#8696A0',
                    fontSize: '14px'
                  }}>
                    Type a message
                  </div>
                  <Mic size={24} style={{ color: '#8696A0', cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div ref={contentRef} style={{ flex: 1, minWidth: '300px' }}>
            <h2 className="animate-item heading-2" style={{ marginBottom: '20px' }}>
              Messages that feel personal
            </h2>
            <p className="animate-item body-text" style={{ marginBottom: '32px' }}>
              Express yourself with rich messaging features designed for meaningful conversations.
            </p>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className="animate-item"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px',
                    padding: '14px 18px',
                    background: 'var(--bg-light)',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--primary-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={16} color="white" />
                  </div>
                  <span style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
