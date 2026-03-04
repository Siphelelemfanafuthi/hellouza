import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, MapPin, Briefcase, GraduationCap, Heart, Users, Image as ImageIcon, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const tabs = ['Posts', 'About', 'Friends', 'Photos'];

const posts = [
  {
    id: 1,
    content: 'Had an amazing weekend hiking with friends! The views were absolutely stunning 🏔️✨',
    image: '/photo_5.jpg',
    likes: 342,
    comments: 28,
    time: '2 days ago'
  },
  {
    id: 2,
    content: 'Coffee and good books = perfect Sunday morning ☕️📚',
    image: '/photo_6.jpg',
    likes: 189,
    comments: 15,
    time: '5 days ago'
  }
];

const friends = [
  { name: 'Sarah Chen', avatar: '/avatar_1.jpg' },
  { name: 'Michael Torres', avatar: '/avatar_2.jpg' },
  { name: 'Emma Wilson', avatar: '/avatar_3.jpg' },
  { name: 'David Kim', avatar: '/avatar_4.jpg' },
  { name: 'Lisa Park', avatar: '/avatar_5.jpg' },
  { name: 'John Smith', avatar: '/avatar_6.jpg' },
];

const photos = [
  '/photo_1.jpg', '/photo_2.jpg', '/photo_3.jpg', '/photo_4.jpg',
  '/photo_5.jpg', '/photo_6.jpg'
];

export default function ProfileInterface() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('Posts');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.animate-item'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ 
      background: 'var(--bg-light)', 
      padding: '40px 24px',
      minHeight: 'auto'
    }}>
      <div className="container">
        <div className="animate-item" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
            Profile Preview
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Your personal space to express yourself
          </p>
        </div>

        {/* Profile Interface Mockup */}
        <div className="animate-item" style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
        }}>
          {/* Cover Photo */}
          <div style={{
            height: '200px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative'
          }}>
            <button style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500
            }}>
              <Camera size={16} />
              Edit Cover
            </button>
          </div>

          {/* Profile Info */}
          <div style={{ padding: '0 24px 24px', position: 'relative' }}>
            {/* Avatar */}
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: '4px solid white',
              overflow: 'hidden',
              marginTop: '-70px',
              position: 'relative',
              background: 'white'
            }}>
              <img src="/avatar_1.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#E4E6EB',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Camera size={16} />
              </button>
            </div>

            {/* Name & Info */}
            <div style={{ marginTop: '16px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>Alex Johnson</h2>
              <p style={{ color: '#65676B', fontSize: '15px', marginBottom: '12px' }}>@alexjohnson</p>
              <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                📸 Photography enthusiast | 🌍 Travel lover | ☕ Coffee addict
              </p>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#65676B', fontSize: '13px' }}>
                  <Briefcase size={16} />
                  <span>Product Designer at Tech Co</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#65676B', fontSize: '13px' }}>
                  <GraduationCap size={16} />
                  <span>Studied at Design University</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#65676B', fontSize: '13px' }}>
                  <MapPin size={16} />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, fontSize: '18px' }}>1.2K</p>
                  <p style={{ fontSize: '13px', color: '#65676B' }}>Friends</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, fontSize: '18px' }}>342</p>
                  <p style={{ fontSize: '13px', color: '#65676B' }}>Photos</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, fontSize: '18px' }}>89</p>
                  <p style={{ fontSize: '13px', color: '#65676B' }}>Groups</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  <MessageCircle size={18} /> Message
                </button>
                <button className="btn btn-outline" style={{ flex: 1 }}>
                  <Users size={18} /> Add Friend
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderTop: '1px solid #E4E6EB',
            borderBottom: '1px solid #E4E6EB'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid #1877F2' : '3px solid transparent',
                  color: activeTab === tab ? '#1877F2' : '#65676B',
                  fontWeight: activeTab === tab ? 600 : 500,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '24px', background: '#F0F2F5', minHeight: '300px' }}>
            {activeTab === 'Posts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {posts.map((post) => (
                  <div key={post.id} style={{ background: 'white', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <img src="/avatar_1.jpg" alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '14px' }}>Alex Johnson</p>
                        <p style={{ fontSize: '12px', color: '#65676B' }}>{post.time}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', marginBottom: '12px' }}>{post.content}</p>
                    <img src={post.image} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                    <div style={{ display: 'flex', gap: '20px', paddingTop: '12px', borderTop: '1px solid #E4E6EB' }}>
                      <span style={{ fontSize: '13px', color: '#65676B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Heart size={16} /> {post.likes}
                      </span>
                      <span style={{ fontSize: '13px', color: '#65676B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageCircle size={16} /> {post.comments}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Friends' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {friends.map((friend, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <img src={friend.avatar} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '13px', fontWeight: 500 }}>{friend.name}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Photos' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {photos.map((photo, i) => (
                  <img key={i} src={photo} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                ))}
              </div>
            )}

            {activeTab === 'About' && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>About Alex</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Heart size={18} style={{ color: '#65676B' }} />
                    <span style={{ fontSize: '14px' }}>Single</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={18} style={{ color: '#65676B' }} />
                    <span style={{ fontSize: '14px' }}>From New York, NY</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Users size={18} style={{ color: '#65676B' }} />
                    <span style={{ fontSize: '14px' }}>Joined January 2020</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ImageIcon size={18} style={{ color: '#65676B' }} />
                    <span style={{ fontSize: '14px' }}>342 Photos</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
