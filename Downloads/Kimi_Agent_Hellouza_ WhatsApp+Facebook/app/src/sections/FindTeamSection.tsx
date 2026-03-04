import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, GraduationCap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FindTeamSectionProps {
  className?: string;
}

export default function FindTeamSection({ className = '' }: FindTeamSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    const pills = pillsRef.current;

    if (!section || !photo || !pills) return;

    const pillElements = pills.querySelectorAll('.info-pill');

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
        photo,
        { x: '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      pillElements.forEach((pill, index) => {
        scrollTl.fromTo(
          pill,
          { x: '40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.12 + index * 0.06
        );
      });

      // SETTLE (30%-70%): Hold

      // EXIT (70%-100%)
      scrollTl.fromTo(
        photo,
        { scale: 1, opacity: 1 },
        { scale: 0.92, opacity: 0, ease: 'power2.in' },
        0.70
      );

      scrollTl.fromTo(
        pillElements,
        { y: 0, opacity: 1 },
        { y: '14vh', opacity: 0, ease: 'power2.in', stagger: 0.03 },
        0.70
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`section section-pinned ${className}`} style={{ zIndex: 70 }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 7vw',
        gap: '4vw'
      }}>
        {/* Left - Photo Card */}
        <div ref={photoRef} style={{ flex: 1.8 }}>
          <div className="card" style={{
            height: '70vh',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img
              src="/lifestyle_3.jpg"
              alt="Find your team"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(11, 30, 91, 0.4) 0%, transparent 50%)'
            }} />
            <div style={{
              position: 'absolute',
              top: '32px',
              left: '32px',
              color: 'white'
            }}>
              <h2 className="heading-2" style={{ color: 'white' }}>Find your team.</h2>
            </div>
          </div>
        </div>
        
        {/* Right - Info Pills */}
        <div ref={pillsRef} style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '3vh'
        }}>
          <div className="info-pill card card-pastel-blue" style={{ padding: '28px', height: '22vh' }}>
            <div className="icon-circle" style={{ marginBottom: '16px' }}>
              <Users size={24} />
            </div>
            <h3 className="heading-3" style={{ marginBottom: '8px' }}>Join inclusive teams</h3>
            <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
              Companies that prioritize culture and growth.
            </p>
          </div>
          
          <div className="info-pill card card-pastel-pink" style={{ padding: '28px', height: '22vh' }}>
            <div className="icon-circle" style={{ marginBottom: '16px' }}>
              <GraduationCap size={24} />
            </div>
            <h3 className="heading-3" style={{ marginBottom: '8px' }}>Mentorship built in</h3>
            <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
              Get matched with mentors in your field.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
