import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Briefcase, Gamepad2, Heart, Calendar, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const groups = [
  {
    icon: Users,
    title: 'Family',
    description: 'Stay close to loved ones',
    members: '2.4M groups',
    color: '#25D366'
  },
  {
    icon: Briefcase,
    title: 'Work',
    description: 'Collaborate with colleagues',
    members: '1.8M groups',
    color: '#1877F2'
  },
  {
    icon: Heart,
    title: 'Interests',
    description: 'Connect over shared hobbies',
    members: '3.2M groups',
    color: '#E4405F'
  },
  {
    icon: Calendar,
    title: 'Events',
    description: 'Plan and organize gatherings',
    members: '890K groups',
    color: '#7B68EE'
  },
  {
    icon: MessageCircle,
    title: 'Support',
    description: 'Find help and community',
    members: '650K groups',
    color: '#00A400'
  },
  {
    icon: Gamepad2,
    title: 'Gaming',
    description: 'Team up with players',
    members: '2.1M groups',
    color: '#FF6B6B'
  }
];

export default function GroupsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (!section || !cards) return;

    const cardElements = cards.querySelectorAll('.group-card');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardElements,
        { y: 50, opacity: 0 },
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
    <section ref={sectionRef} className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="heading-2" style={{ marginBottom: '16px' }}>
            Find your community
          </h2>
          <p className="body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Join groups that matter to you. From family chats to gaming clans, there's a place for everyone.
          </p>
        </div>

        <div 
          ref={cardsRef}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}
        >
          {groups.map((group, index) => {
            const Icon = group.icon;
            return (
              <div
                key={index}
                className="group-card card card-hover"
                style={{ 
                  padding: '28px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '18px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: `${group.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={26} style={{ color: group.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>
                    {group.title}
                  </h3>
                  <p className="body-small" style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    {group.description}
                  </p>
                  <span style={{ 
                    fontSize: '12px', 
                    color: group.color,
                    fontWeight: 500
                  }}>
                    {group.members}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Group Preview */}
        <div style={{ 
          marginTop: '64px',
          padding: '32px',
          background: 'var(--bg-light)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '12px' }}>
              Create your own group
            </h3>
            <p className="body-text" style={{ marginBottom: '20px' }}>
              Start a community around anything you're passionate about. Invite friends and grow together.
            </p>
            <button className="btn btn-primary">
              Create Group
            </button>
          </div>
          <div style={{ 
            flex: 1, 
            minWidth: '280px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: 'var(--shadow-card)',
              maxWidth: '320px',
              width: '100%'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--gray-light)'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users size={24} color="white" />
                </div>
                <div>
                  <p style={{ fontWeight: 600 }}>Weekend Hikers</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>128 members</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['/avatar_1.jpg', '/avatar_2.jpg', '/avatar_3.jpg', '/avatar_4.jpg'].map((avatar, i) => (
                  <img key={i} src={avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                ))}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--gray-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)'
                }}>
                  +124
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
