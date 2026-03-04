import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Amanda Rodriguez',
    role: 'Marketing Director',
    avatar: '/avatar_1.jpg',
    quote: 'Hellouza transformed how our team communicates. The seamless blend of messaging and social features keeps everyone connected and engaged.',
    rating: 5
  },
  {
    name: 'James Mitchell',
    role: 'Software Engineer',
    avatar: '/avatar_2.jpg',
    quote: 'Finally, a platform that understands both professional and personal communication. The encryption gives me peace of mind.',
    rating: 5
  },
  {
    name: 'Priya Sharma',
    role: 'Content Creator',
    avatar: '/avatar_3.jpg',
    quote: 'The stories feature is perfect for sharing behind-the-scenes content with my audience. My engagement has doubled since switching.',
    rating: 5
  },
  {
    name: 'Carlos Mendez',
    role: 'Small Business Owner',
    avatar: '/avatar_4.jpg',
    quote: 'I use Hellouza to manage customer relationships and team coordination. It\'s become essential to my business operations.',
    rating: 5
  },
  {
    name: 'Lisa Thompson',
    role: 'University Student',
    avatar: '/avatar_5.jpg',
    quote: 'The group features make organizing study sessions so easy. Plus, the interface is clean and intuitive.',
    rating: 5
  },
  {
    name: 'Robert Chen',
    role: 'Retired Teacher',
    avatar: '/avatar_6.jpg',
    quote: 'Even at my age, I found Hellouza easy to use. It helps me stay connected with family across the country.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (!section || !cards) return;

    const cardElements = cards.querySelectorAll('.testimonial-card');

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
            Loved by millions
          </h2>
          <p className="body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>
            See what people around the world are saying about Hellouza.
          </p>
        </div>

        <div 
          ref={cardsRef}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px'
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card card"
              style={{ padding: '28px', position: 'relative' }}
            >
              <Quote 
                size={32} 
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px',
                  color: 'var(--gray-light)'
                }} 
              />
              
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
                ))}
              </div>
              
              <p className="body-text" style={{ marginBottom: '24px', fontStyle: 'italic' }}>
                "{testimonial.quote}"
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }} 
                />
                <div>
                  <p style={{ fontWeight: 600, fontSize: '15px' }}>{testimonial.name}</p>
                  <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
