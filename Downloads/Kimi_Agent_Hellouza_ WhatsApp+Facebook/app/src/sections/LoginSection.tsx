import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Eye, EyeOff, Chrome, Apple } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface LoginSectionProps {
  onLogin?: () => void;
}

export default function LoginSection({ onLogin }: LoginSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.animate-item'),
        { y: 40, opacity: 0 },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) onLogin();
  };

  return (
    <section ref={sectionRef} className="section" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '64px',
          flexWrap: 'wrap',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Left - Branding */}
          <div className="animate-item" style={{ flex: 1, minWidth: '300px', textAlign: 'center' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <MessageCircle size={50} color="white" />
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
              Welcome to Hellouza
            </h2>
            <p className="body-text">
              Connect with friends, family, and communities around the world.
            </p>
          </div>

          {/* Right - Login Form */}
          <div className="animate-item" style={{ flex: 1, minWidth: '300px' }}>
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '24px', textAlign: 'center' }}>
                Sign In
              </h3>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email or phone"
                    className="input"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input"
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Remember me</span>
                  </label>
                  <a href="#" style={{ fontSize: '13px', color: 'var(--primary-green)', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                  Sign In
                </button>
              </form>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                margin: '24px 0'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--gray-light)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--gray-light)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Chrome size={20} />
                  Continue with Google
                </button>
                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Apple size={20} />
                  Continue with Apple
                </button>
              </div>

              <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <a href="#" style={{ color: 'var(--primary-green)', fontWeight: 600, textDecoration: 'none' }}>
                  Create one
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
