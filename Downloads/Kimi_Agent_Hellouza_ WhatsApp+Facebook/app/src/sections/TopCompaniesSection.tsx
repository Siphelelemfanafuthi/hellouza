import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Briefcase, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TopCompaniesSectionProps {
  className?: string;
}

const companies = [
  {
    name: 'Nexa Labs',
    tagline: 'Design-led product company',
    openRoles: 12,
    responseTime: '2 days',
    color: 'var(--pastel-mint)',
    logo: '/company_1.jpg'
  },
  {
    name: 'Orbit Studio',
    tagline: 'Creative digital agency',
    openRoles: 8,
    responseTime: '1 day',
    color: 'var(--pastel-blue)',
    logo: '/company_2.jpg'
  },
  {
    name: 'Brightpath',
    tagline: 'Innovation consultancy',
    openRoles: 15,
    responseTime: '3 days',
    color: 'var(--pastel-peach)',
    logo: '/company_3.jpg'
  }
];

export default function TopCompaniesSection({ className = '' }: TopCompaniesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;

    if (!section || !heading || !cards) return;

    const cardElements = cards.querySelectorAll('.company-card');

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

      cardElements.forEach((card, index) => {
        scrollTl.fromTo(
          card,
          { y: '70vh', opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, ease: 'none' },
          0.08 + index * 0.06
        );
      });

      // SETTLE (30%-70%): Hold

      // EXIT (70%-100%)
      scrollTl.fromTo(
        cardElements,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in', stagger: 0.03 },
        0.70
      );

      scrollTl.fromTo(
        heading,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.85
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`section section-pinned ${className}`} style={{ zIndex: 90 }}>
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
          <h2 className="heading-2">Top companies.</h2>
        </div>
        
        <div ref={cardsRef} style={{
          display: 'flex',
          gap: '3vw',
          width: '86vw',
          height: '56vh',
          justifyContent: 'center'
        }}>
          {companies.map((company, index) => (
            <div
              key={index}
              className="company-card card"
              style={{
                flex: 1,
                maxWidth: '26vw',
                minWidth: '280px',
                background: company.color,
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
              <div>
                <img
                  src={company.logo}
                  alt={company.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    marginBottom: '20px'
                  }}
                />
                <h3 className="heading-3" style={{ marginBottom: '8px' }}>{company.name}</h3>
                <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                  {company.tagline}
                </p>
              </div>
              
              <div>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={14} /> Open roles: {company.openRoles}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> Avg. response: {company.responseTime}
                  </span>
                </div>
                
                <a href="#" style={{
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  View profile <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
