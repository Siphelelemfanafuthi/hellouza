import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  'Post updates, photos, and videos',
  'Like, comment, and share posts',
  'Tag friends and locations',
  'Control who sees your content',
  'Save posts to view later'
];

const posts = [
  {
    user: { name: 'Jessica Park', avatar: '/avatar_5.jpg' },
    time: '3 hours ago',
    content: 'Finally visited this amazing cafe! The coffee was incredible ☕️✨',
    image: '/photo_6.jpg',
    likes: 234,
    comments: 18,
    shares: 5
  },
  {
    user: { name: 'David Kim', avatar: '/avatar_4.jpg' },
    time: '5 hours ago',
    content: 'Weekend hiking adventure! The views were breathtaking 🏔️',
    image: '/photo_5.jpg',
    likes: 456,
    comments: 32,
    shares: 12
  }
];

export default function FeedDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelectorAll('.animate-item'),
        { x: 40, opacity: 0 },
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
    <section ref={sectionRef} className="section" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '64px',
          flexWrap: 'wrap',
          flexDirection: 'row-reverse'
        }}>
          {/* Right - Phone Mockup */}
          <div style={{ 
            flex: 1, 
            minWidth: '300px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '320px',
              height: '640px',
              background: 'white',
              borderRadius: '40px',
              padding: '14px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                height: '100%',
                background: '#F0F2F5',
                borderRadius: '32px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Header */}
                <div style={{ 
                  padding: '14px 18px', 
                  background: 'white',
                  borderBottom: '1px solid #E4E6EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontWeight: 800, fontSize: '20px', color: '#1877F2' }}>hellouza</span>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#E4E6EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageCircle size={18} />
                    </div>
                    <div style={{ width: '36px', height: '36px', background: '#E4E6EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '18px', height: '18px', background: '#FA383E', borderRadius: '50%', position: 'absolute', marginLeft: '12px', marginTop: '-12px', fontSize: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
                    </div>
                  </div>
                </div>

                {/* Create Post */}
                <div style={{ padding: '14px', background: 'white', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img src="/avatar_1.jpg" alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ 
                      flex: 1, 
                      background: '#F0F2F5', 
                      borderRadius: '20px', 
                      padding: '10px 16px',
                      color: '#65676B',
                      fontSize: '14px'
                    }}>
                      What's on your mind?
                    </div>
                  </div>
                </div>

                {/* Posts */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {posts.map((post, i) => (
                    <div key={i} style={{ background: 'white', marginBottom: '10px', padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={post.user.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '14px' }}>{post.user.name}</p>
                            <p style={{ fontSize: '12px', color: '#65676B' }}>{post.time}</p>
                          </div>
                        </div>
                        <MoreHorizontal size={20} style={{ color: '#65676B', cursor: 'pointer' }} />
                      </div>
                      <p style={{ fontSize: '14px', marginBottom: '10px' }}>{post.content}</p>
                      <img src={post.image} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #E4E6EB' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#65676B', fontSize: '13px' }}>
                            <Heart size={18} /> {post.likes}
                          </button>
                          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#65676B', fontSize: '13px' }}>
                            <MessageCircle size={18} /> {post.comments}
                          </button>
                          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#65676B', fontSize: '13px' }}>
                            <Share2 size={18} /> {post.shares}
                          </button>
                        </div>
                        <Bookmark size={18} style={{ color: '#65676B', cursor: 'pointer' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Left - Content */}
          <div ref={contentRef} style={{ flex: 1, minWidth: '300px' }}>
            <h2 className="animate-item heading-2" style={{ marginBottom: '20px' }}>
              Share your world
            </h2>
            <p className="animate-item body-text" style={{ marginBottom: '32px' }}>
              Connect with friends and family through posts, photos, and videos. Your story, your way.
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
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#1877F2',
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
