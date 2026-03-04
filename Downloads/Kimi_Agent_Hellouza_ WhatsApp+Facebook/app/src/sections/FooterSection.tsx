import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Product: ['Features', 'Download', 'Security', 'Business', 'Premium'],
  Company: ['About', 'Careers', 'Press', 'Blog', 'Contact'],
  Resources: ['Help Center', 'Community', 'Guidelines', 'Developers', 'Status'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Licenses', 'Accessibility']
};

const socialLinks = [
  { icon: Twitter, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Linkedin, href: '#' },
  { icon: Youtube, href: '#' },
  { icon: Github, href: '#' }
];

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.animate-item'),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} style={{ background: '#111B21', color: 'white', padding: '64px 24px 32px' }}>
      <div className="container">
        <div className="animate-item" style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Brand */}
          <div style={{ flex: '1 1 250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={22} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '22px' }}>Hellouza</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              The all-in-one messaging and social platform that brings people together. Connect, share, and belong.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary-green)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} style={{ flex: '1 1 150px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {category}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      style={{ 
                        color: 'rgba(255,255,255,0.6)', 
                        fontSize: '14px',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="animate-item" style={{ 
          paddingTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            © 2026 Hellouza. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
              Privacy Policy
            </a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
              Terms of Service
            </a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
