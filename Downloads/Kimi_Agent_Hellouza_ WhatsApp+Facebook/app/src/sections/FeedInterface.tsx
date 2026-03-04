import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Bell, 
  Menu,
  Search,
  Image,
  Smile,
  MapPin,
  MoreHorizontal,
  Heart,
  Share2,
  Bookmark,
  MessageSquare
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stories = [
  { user: 'Your Story', avatar: '/avatar_1.jpg', isUser: true },
  { user: 'Sarah', avatar: '/avatar_2.jpg', hasStory: true },
  { user: 'Mike', avatar: '/avatar_3.jpg', hasStory: true },
  { user: 'Emma', avatar: '/avatar_4.jpg', hasStory: true },
  { user: 'Lisa', avatar: '/avatar_5.jpg', hasStory: true },
];

const posts = [
  {
    id: 1,
    user: { name: 'Jessica Park', avatar: '/avatar_5.jpg' },
    time: '3 hours ago',
    content: 'Finally visited this amazing cafe! The coffee was incredible ☕️✨ #coffee #weekend #vibes',
    image: '/photo_6.jpg',
    likes: 234,
    comments: 18,
    shares: 5,
    liked: false
  },
  {
    id: 2,
    user: { name: 'David Kim', avatar: '/avatar_4.jpg' },
    time: '5 hours ago',
    content: 'Weekend hiking adventure! The views were absolutely breathtaking 🏔️ Nature never fails to amaze me.',
    image: '/photo_5.jpg',
    likes: 456,
    comments: 32,
    shares: 12,
    liked: true
  },
  {
    id: 3,
    user: { name: 'Michael Torres', avatar: '/avatar_2.jpg' },
    time: '8 hours ago',
    content: 'Beautiful sunset at the beach today! Sometimes you just need to pause and appreciate the moment 🌅',
    image: '/photo_1.jpg',
    likes: 892,
    comments: 67,
    shares: 45,
    liked: false
  }
];

const contacts = [
  { name: 'Sarah Chen', avatar: '/avatar_1.jpg', online: true },
  { name: 'Emma Wilson', avatar: '/avatar_3.jpg', online: true },
  { name: 'Lisa Park', avatar: '/avatar_5.jpg', online: false },
  { name: 'John Smith', avatar: '/avatar_6.jpg', online: true },
];

export default function FeedInterface() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

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

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <section ref={sectionRef} className="section" style={{ 
      background: 'var(--bg-light)', 
      padding: '40px 24px',
      minHeight: 'auto'
    }}>
      <div className="container">
        <div className="animate-item" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
            Social Feed Preview
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Share moments and stay updated with your network
          </p>
        </div>

        {/* Feed Interface Mockup */}
        <div className="animate-item" style={{
          maxWidth: '1000px',
          margin: '0 auto',
          height: '550px',
          background: '#F0F2F5',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
        }}>
          {/* Left Sidebar */}
          <div style={{
            width: '280px',
            background: 'white',
            borderRight: '1px solid #E4E6EB',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={20} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '20px', color: '#1877F2' }}>hellouza</span>
            </div>
            
            {[
              { icon: Home, label: 'Home', active: true },
              { icon: Users, label: 'Friends', active: false },
              { icon: MessageCircle, label: 'Messages', active: false },
              { icon: Bell, label: 'Notifications', active: false },
              { icon: Menu, label: 'Menu', active: false },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: item.active ? '#E7F3FF' : 'transparent'
                  }}
                >
                  <Icon size={22} style={{ color: item.active ? '#1877F2' : '#65676B' }} />
                  <span style={{ fontSize: '15px', fontWeight: item.active ? 600 : 500, color: item.active ? '#1877F2' : '#050505' }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Main Feed */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {/* Create Post */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <img src="/avatar_1.jpg" alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{
                  flex: 1,
                  background: '#F0F2F5',
                  borderRadius: '20px',
                  padding: '10px 16px',
                  color: '#65676B',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  What's on your mind?
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '12px', borderTop: '1px solid #E4E6EB' }}>
                {[
                  { icon: Image, label: 'Photo', color: '#45BD62' },
                  { icon: Smile, label: 'Feeling', color: '#F7B928' },
                  { icon: MapPin, label: 'Location', color: '#F5533D' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Icon size={20} style={{ color: item.color }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#65676B' }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stories */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {stories.map((story, i) => (
                <div key={i} style={{ textAlign: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <div className={story.isUser ? '' : (story.hasStory ? 'story-ring' : 'story-ring story-ring-viewed')} style={{ padding: story.isUser ? '0' : '2px', borderRadius: '50%' }}>
                    <img src={story.avatar} alt="" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: story.isUser ? '2px dashed #E4E6EB' : '2px solid white' }} />
                  </div>
                  <p style={{ fontSize: '12px', marginTop: '6px', color: '#65676B' }}>{story.user}</p>
                </div>
              ))}
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <div key={post.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
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
                <p style={{ fontSize: '14px', marginBottom: '12px', lineHeight: 1.5 }}>{post.content}</p>
                <img src={post.image} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #E4E6EB' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <button 
                      onClick={() => toggleLike(post.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Heart 
                        size={20} 
                        fill={likedPosts.includes(post.id) ? '#FA383E' : 'none'}
                        color={likedPosts.includes(post.id) ? '#FA383E' : '#65676B'} 
                      />
                      <span style={{ fontSize: '13px', color: '#65676B' }}>
                        {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                      </span>
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <MessageSquare size={20} style={{ color: '#65676B' }} />
                      <span style={{ fontSize: '13px', color: '#65676B' }}>{post.comments}</span>
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Share2 size={20} style={{ color: '#65676B' }} />
                      <span style={{ fontSize: '13px', color: '#65676B' }}>{post.shares}</span>
                    </button>
                  </div>
                  <Bookmark size={20} style={{ color: '#65676B', cursor: 'pointer' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div style={{
            width: '240px',
            background: 'white',
            borderLeft: '1px solid #E4E6EB',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#65676B' }}>Contacts</h4>
              <Search size={18} style={{ color: '#65676B', cursor: 'pointer' }} />
            </div>
            {contacts.map((contact, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', cursor: 'pointer' }}>
                <div style={{ position: 'relative' }}>
                  <img src={contact.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  {contact.online && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#00A400',
                      border: '2px solid white'
                    }} />
                  )}
                </div>
                <span style={{ fontSize: '14px' }}>{contact.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
