import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PopularJobsSectionProps {
  className?: string;
}

const jobs = [
  {
    title: 'Product Designer',
    location: 'Remote',
    tags: ['UX', 'UI', 'Research'],
    color: 'var(--pastel-mint)'
  },
  {
    title: 'Frontend Engineer',
    location: 'Remote',
    tags: ['React', 'TS', 'Design Systems'],
    color: 'var(--pastel-blue)'
  },
  {
    title: 'Brand Strategist',
    location: 'Remote',
    tags: ['Brand', 'Copy', 'Growth'],
    color: 'var(--pastel-peach)'
  }
];

export default function PopularJobsSection({ className = '' }: PopularJobsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const rows = rowsRef.current;

    if (!section || !heading || !rows) return;

    const rowElements = rows.querySelectorAll('.job-row');

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
        { x: '-10vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      rowElements.forEach((row, index) => {
        scrollTl.fromTo(
          row,
          { x: '60vw', opacity: 0, scale: 0.96 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0.08 + index * 0.06
        );
      });

      // SETTLE (30%-70%): Hold

      // EXIT (70%-100%)
      scrollTl.fromTo(
        rowElements,
        { x: 0, opacity: 1 },
        { x: '-22vw', opacity: 0, ease: 'power2.in', stagger: 0.03 },
        0.70
      );

      scrollTl.fromTo(
        heading,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.80
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`section section-pinned ${className}`} style={{ zIndex: 30 }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '10vh 7vw'
      }}>
        <div ref={headingRef} style={{ marginBottom: '32px' }}>
          <h2 className="heading-2">Popular jobs.</h2>
        </div>
        
        <div ref={rowsRef} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3vh',
          flex: 1
        }}>
          {jobs.map((job, index) => (
            <div
              key={index}
              className="job-row card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px 32px',
                height: '16vh',
                minHeight: '120px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { scale: 1.01, duration: 0.2 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: job.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: 'var(--text-primary)'
                }}>
                  {job.title.charAt(0)}
                </div>
                <div>
                  <h3 className="heading-3" style={{ marginBottom: '6px' }}>{job.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} />
                    {job.location}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {job.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag" style={{ background: job.color }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                  Apply <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
