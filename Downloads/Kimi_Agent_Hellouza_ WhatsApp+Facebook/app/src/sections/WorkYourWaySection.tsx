import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface WorkYourWaySectionProps {
  className?: string;
}

export default function WorkYourWaySection({ className = '' }: WorkYourWaySectionProps) {
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
        { x: '-60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      pillElements.forEach((pill, index) => {
        scrollTl.fromTo(
          pill,
          { x: '40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.10 + index * 0.06
        );
      });

      // SETTLE (30%-70%): Hold

      // EXIT (70%-100%)
      scrollTl.fromTo(
        photo,
        { y: 0, opacity: 1 },
        { y: '-18vh', opacity: 0, ease: 'power2.in' },
        0.70
      );

      scrollTl.fromTo(
        pillElements,
        { y: 0, opacity: 1 },
        { y: '18vh', opacity: 0, ease: 'power2.in', stagger: 0.03 },
        0.70
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`section section-pinned ${className}`} style={{ zIndex: 50 }}>
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
              src="/lifestyle_1.jpg"
              alt="Work your way"
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
              <h2 className="heading-2" style={{ color: 'white', marginBottom: '8px' }}>Work your way.</h2>
            </div>
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              color: 'white',
              fontSize: '14px',
              opacity: 0.9
            }}>
              Remote-first teams. Real outcomes.
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
          <div className="info-pill card card-pastel-peach" style={{ padding: '28px', height: '22vh' }}>
            <div className="icon-circle" style={{ marginBottom: '16px' }}>
              <Calendar size={24} />
            </div>
            <h3 className="heading-3" style={{ marginBottom: '8px' }}>Set your availability</h3>
            <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
              Choose full-time, part-time, or freelance.
            </p>
          </div>
          
          <div className="info-pill card card-pastel-lavender" style={{ padding: '28px', height: '22vh' }}>
            <div className="icon-circle" style={{ marginBottom: '16px' }}>
              <Globe size={24} />
            </div>
            <h3 className="heading-3" style={{ marginBottom: '8px' }}>Work from anywhere</h3>
            <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
              Home, coworking, or on the road.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
