import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stories = [
  { user: 'You', avatar: '/avatar_1.jpg', isUser: true },
  { user: 'Sarah', avatar: '/avatar_2.jpg', hasStory: true },
  { user: 'Mike', avatar: '/avatar_3.jpg', hasStory: true },
  { user: 'Emma', avatar: '/avatar_4.jpg', hasStory: true },
  { user: 'Lisa', avatar: '/avatar_5.jpg', hasStory: true },
  { user: 'John', avatar: '/avatar_6.jpg', hasStory: true },
];

export default function StoriesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const storiesEl = storiesRef.current;

    if (!section || !storiesEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        storiesEl.querySelectorAll('.story-item'),
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: 'back.out(1.7)',
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
    <section ref={sectionRef} className="section" style={{ 
      background: 'linear-gradient(180deg, #111B21 0%, #1F2C34 100%)',
      color: 'white'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.1)',
            padding: '10px 20px',
            borderRadius: '50px',
            marginBottom: '20px'
          }}>
            <Camera size={20} style={{ color: '#E4405F' }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Stories</span>
          </div>
          <h2 className="heading-2" style={{ color: 'white', marginBottom: '12px' }}>
            Stories that disappear
          </h2>
          <p className="body-text" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto' }}>
            Share moments that last 24 hours. Photos, videos, and more — express yourself freely.
          </p>
        </div>

        {/* Stories Row */}
        <div 
          ref={storiesRef}
          style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '48px'
          }}
        >
          {stories.map((story, index) => (
            <div 
              key={index}
              className="story-item"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <div 
                className={story.isUser ? '' : (story.hasStory ? 'story-ring' : 'story-ring story-ring-viewed')}
                style={{ 
                  padding: story.isUser ? '0' : '3px',
                  borderRadius: '50%',
                  background: story.isUser ? 'transparent' : undefined
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img 
                    src={story.avatar} 
                    alt={story.user}
                    style={{ 
                      width: '72px', 
                      height: '72px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: story.isUser ? '2px dashed rgba(255,255,255,0.4)' : '2px solid #111B21'
                    }} 
                  />
                  {story.isUser && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#1877F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #111B21'
                    }}>
                      <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>+</span>
                    </div>
                  )}
                </div>
              </div>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{story.user}</span>
            </div>
          ))}
        </div>

        {/* Story Viewer Preview */}
        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div className="story-ring" style={{ padding: '2px' }}>
              <img src="/avatar_2.jpg" alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #111B21' }} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '14px' }}>Sarah Chen</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>2h ago</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{
            height: '3px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            marginBottom: '16px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: 'white',
              borderRadius: '2px',
              animation: 'progress 5s linear infinite'
            }} />
          </div>

          <div style={{
            aspectRatio: '9/16',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <Play size={28} fill="white" color="white" />
            </div>
          </div>
        </div>

        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </section>
  );
}
