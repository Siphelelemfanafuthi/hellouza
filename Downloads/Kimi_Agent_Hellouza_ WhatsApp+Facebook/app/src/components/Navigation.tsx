import { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, ArrowLeft } from 'lucide-react';

interface NavigationProps {
  inApp?: boolean;
  onEnterApp?: () => void;
  onBack?: () => void;
}

export default function Navigation({ inApp = false, onEnterApp, onBack }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (inApp) {
    return (
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '16px 24px',
        background: 'var(--bg-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button 
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '15px'
          }}
        >
          <ArrowLeft size={20} />
          Back to Website
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
          <MessageCircle size={24} style={{ color: 'var(--primary-green)' }} />
          <span style={{ fontWeight: 700, fontSize: '18px' }}>Hellouza</span>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'all 0.3s ease',
      borderBottom: scrolled ? '1px solid var(--gray-light)' : 'none'
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <MessageCircle size={28} style={{ color: 'var(--primary-green)' }} />
        <span style={{ 
          fontWeight: 800, 
          fontSize: '22px', 
          color: scrolled ? 'var(--text-primary)' : 'white' 
        }}>
          Hellouza
        </span>
      </a>
      
      <ul className="desktop-nav" style={{ 
        display: 'flex', 
        gap: '32px', 
        listStyle: 'none'
      }}>
        {['Features', 'Download', 'About', 'Support'].map((item) => (
          <li key={item}>
            <a 
              href={`#${item.toLowerCase()}`}
              style={{ 
                fontSize: '15px', 
                fontWeight: 500,
                color: scrolled ? 'var(--text-primary)' : 'white',
                textDecoration: 'none',
                opacity: 0.9,
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={onEnterApp}
          className="btn btn-primary"
          style={{ padding: '10px 20px', fontSize: '14px' }}
        >
          Open App
        </button>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ 
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: scrolled ? 'var(--text-primary)' : 'white'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          padding: '20px',
          boxShadow: 'var(--shadow-elevated)',
          display: 'none'
        }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Features', 'Download', 'About', 'Support'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`}
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    textDecoration: 'none'
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
