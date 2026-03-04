import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Pen, Code, Megaphone, Briefcase } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ForEveryoneSectionProps {
  className?: string;
}

const categories = [
  {
    title: 'Design & Creative',
    icon: Pen,
    color: 'var(--pastel-lavender)',
    description: 'UI/UX, Graphic Design, Motion'
  },
  {
    title: 'Development',
    icon: Code,
    color: 'var(--pastel-peach)',
    description: 'Frontend, Backend, Full-stack'
  },
  {
    title: 'Marketing',
    icon: Megaphone,
    color: 'var(--pastel-lemon)',
    description: 'Digital, Content, Growth'
  },
  {
    title: 'Business',
    icon: Briefcase,
    color: 'var(--pastel-mint)',
    description: 'Sales, Operations, Management'
  }
];

export default function ForEveryoneSection({ className = '' }: ForEveryoneSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const tiles = tilesRef.current;

    if (!section || !heading || !tiles) return;

    const tileElements = tiles.querySelectorAll('.category-tile');

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
        { y: '-6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      tileElements.forEach((tile, index) => {
        scrollTl.fromTo(
          tile,
          { y: '60vh', opacity: 0, scale: 0.92 },
          { y: 0, opacity: 1, scale: 1, ease: 'none' },
          0.06 + index * 0.04
        );
      });

      // SETTLE (30%-70%): Hold

      // EXIT (70%-100%)
      scrollTl.fromTo(
        tileElements,
        { scale: 1, opacity: 1 },
        { scale: 0.86, opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.70
      );

      scrollTl.fromTo(
        heading,
        { y: 0, opacity: 1 },
        { y: '-4vh', opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`section section-pinned ${className}`} style={{ zIndex: 20 }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10vh 7vw'
      }}>
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="heading-2" style={{ marginBottom: '12px' }}>For everyone.</h2>
          <p className="body-text">Explore roles built for your skills and schedule.</p>
        </div>
        
        <div ref={tilesRef} style={{
          display: 'flex',
          gap: '2vw',
          width: '86vw',
          height: '56vh',
          justifyContent: 'center'
        }}>
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="category-tile card"
                style={{
                  flex: 1,
                  maxWidth: '20vw',
                  minWidth: '240px',
                  background: category.color,
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
                }}
              >
                <div className="icon-circle">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="heading-3" style={{ marginBottom: '8px' }}>{category.title}</h3>
                  <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                    {category.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
