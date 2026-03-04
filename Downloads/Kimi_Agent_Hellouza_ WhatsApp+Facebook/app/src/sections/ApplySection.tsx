import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, FileText, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ApplySectionProps {
  className?: string;
}

export default function ApplySection({ className = '' }: ApplySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const [uploaded, setUploaded] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const form = formRef.current;
    const upload = uploadRef.current;

    if (!section || !text || !form || !upload) return;

    const formFields = form.querySelectorAll('.form-field');

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
        text,
        { x: '-18vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      formFields.forEach((field, index) => {
        scrollTl.fromTo(
          field,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.10 + index * 0.05
        );
      });

      scrollTl.fromTo(
        upload,
        { x: '18vw', opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0.06
      );

      // SETTLE (30%-70%): Hold

      // EXIT (70%-100%)
      scrollTl.fromTo(
        text,
        { x: 0, opacity: 1 },
        { x: '-14vw', opacity: 0, ease: 'power2.in' },
        0.70
      );

      scrollTl.fromTo(
        upload,
        { x: 0, opacity: 1 },
        { x: '14vw', opacity: 0, ease: 'power2.in' },
        0.70
      );

      scrollTl.fromTo(
        formFields,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleUpload = () => {
    setUploaded(true);
    setTimeout(() => setUploaded(false), 3000);
  };

  return (
    <section ref={sectionRef} className={`section section-pinned ${className}`} style={{ zIndex: 40 }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 7vw',
        gap: '4vw'
      }}>
        {/* Left Content */}
        <div style={{ flex: 1, maxWidth: '480px' }}>
          <div ref={textRef}>
            <h2 className="heading-2" style={{ marginBottom: '16px' }}>Apply in seconds.</h2>
            <p className="body-text" style={{ marginBottom: '32px', fontSize: '17px' }}>
              Upload your CV once. Apply to dozens of roles with a single tap.
            </p>
          </div>
          
          <div ref={formRef}>
            <div className="form-field" style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Full name"
                className="input"
              />
            </div>
            <div className="form-field" style={{ marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="Email"
                className="input"
              />
            </div>
            <div className="form-field" style={{ marginBottom: '24px' }}>
              <input
                type="url"
                placeholder="Portfolio (optional)"
                className="input"
              />
            </div>
            <div className="form-field">
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Create profile
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Content - Upload Card */}
        <div ref={uploadRef} style={{ flex: 1, maxWidth: '520px' }}>
          <div className="card card-pastel-blue" style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '400px',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: 'var(--shadow-button)'
            }}>
              {uploaded ? (
                <Check size={32} style={{ color: '#22c55e' }} />
              ) : (
                <FileText size={32} style={{ color: 'var(--accent)' }} />
              )}
            </div>
            
            <h3 className="heading-3" style={{ marginBottom: '8px' }}>
              {uploaded ? 'Upload successful!' : 'Upload your CV'}
            </h3>
            <p className="body-small" style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              PDF, DOCX (max 5 MB)
            </p>
            
            <button 
              className="btn btn-outline"
              onClick={handleUpload}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Upload size={18} />
              Choose file
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
