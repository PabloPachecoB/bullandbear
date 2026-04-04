import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import { useScrollProgress } from '../hooks/useScrollAnimations';

const TestimonialsSection = lazy(() => import('../components/TestimonialsSection'));

/* ─── Animated counter hook ─── */
function useCountUp(target, isVisible, duration = 1800) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;
    const num = parseInt(target);
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return count;
}

function StatItem({ number, suffix, label }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const count = useCountUp(number, vis);

  return (
    <div className="band-stat" ref={ref}>
      <span className="band-stat-number">{count}{suffix}</span>
      <span className="band-stat-label">{label}</span>
    </div>
  );
}

/* ─── Split Text Component — reveals word by word ─── */
function SplitText({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const words = children.split(' ');

  return (
    <span ref={ref} className={`split-text ${className} ${isVisible ? 'visible' : ''}`}>
      {words.map((word, i) => (
        <span key={i} className="split-word-wrap">
          <span
            className="split-word"
            style={{ transitionDelay: `${delay + i * 0.06}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
}

/* ─── Parallax Section Wrapper ─── */
function ParallaxSection({ children, speed = 0.1, className = '' }) {
  const ref = useRef(null);
  const progress = useScrollProgress(ref);
  const y = (progress - 0.5) * speed * 200;

  return (
    <div ref={ref} className={className} style={{ transform: `translateY(${y}px)` }}>
      {children}
    </div>
  );
}

/* ─── Scale Reveal Section ─── */
function ScaleReveal({ children, className = '' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scale-reveal ${className} ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
}

function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const children = entry.target.querySelectorAll('.stagger-child');
            children.forEach((child, i) => {
              setTimeout(() => child.classList.add('visible'), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((el) => observer.observe(el));
    return () => sections.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <>
      <Hero />

      {/* ─── Section Divider ─── */}
      <div className="section-divider">
        <div className="divider-line"></div>
      </div>

      {/* ─── Programa intro ─── */}
      <section className="text-section animate-on-scroll" id="programa">
        <span className="section-eyebrow stagger-child">NUESTRO PROGRAMA</span>
        <h2 className="stagger-child">
          <SplitText delay={0.2}>Formacion Completa en Trading</SplitText>
        </h2>
        <p className="stagger-child">
          Un programa disenado para llevarte de cero a trader consistente.
          <br />
          Mentores activos en el mercado y una comunidad que te respalda.
        </p>
      </section>

      {/* ─── Features grid ─── */}
      <ScaleReveal className="features-section-wrap">
        <section className="features-section animate-on-scroll">
          <div className="features-grid">
            {[
              { n: '01', title: 'Analisis Tecnico', desc: 'Velas japonesas, patrones de precio, soportes, resistencias e indicadores profesionales.' },
              { n: '02', title: 'Psicologia del Trading', desc: 'El 80% del exito es mental. Disciplina, gestion emocional y mentalidad ganadora.' },
              { n: '03', title: 'Gestion de Riesgo', desc: 'Money management para preservar y hacer crecer tu cuenta de forma consistente.' },
              { n: '04', title: 'Practica Real', desc: 'Clases en vivo, operaciones en tiempo real y cuenta demo para practicar sin riesgo.' },
            ].map((f, i) => (
              <div key={i} className="feature-card stagger-child" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="feature-number">{f.n}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="feature-line"></div>
              </div>
            ))}
          </div>
        </section>
      </ScaleReveal>

      {/* ─── Section Divider ─── */}
      <div className="section-divider">
        <div className="divider-line"></div>
      </div>

      {/* ─── Content Sections with parallax ─── */}
      <ContentSection
        title="Domina los Graficos"
        description="Aprende a leer el mercado con precision. Soportes, resistencias, patrones de velas y los indicadores mas utilizados por traders profesionales."
        imageUrl="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80&auto=format&fit=crop"
        reverse={false}
        sectionId="analisis"
        index={1}
      />

      {/* ─── Section Divider ─── */}
      <div className="section-divider glow">
        <div className="divider-line"></div>
      </div>

      <ContentSection
        title="Multiples Mercados"
        description="Forex, criptomonedas, acciones e indices. Opera en los mercados mas liquidos del mundo con estrategias probadas."
        imageUrl="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80&auto=format&fit=crop"
        reverse={true}
        sectionId="mercados"
        index={2}
      />

      {/* ─── Section Divider ─── */}
      <div className="section-divider glow">
        <div className="divider-line"></div>
      </div>

      <ContentSection
        title="Mentores con Resultados"
        description="Nuestro equipo opera activamente en los mercados. No solo teoria: estrategias, errores y aprendizajes reales compartidos contigo."
        imageUrl="/images/IMAGENCELULAR.jpeg"
        reverse={false}
        sectionId="beneficios"
        index={3}
      />

      {/* ─── Stats band ─── */}
      <section className="stats-band animate-on-scroll">
        <div className="stats-band-inner">
          <StatItem number="500" suffix="+" label="Estudiantes" />
          <div className="band-divider"></div>
          <StatItem number="95" suffix="%" label="Satisfaccion" />
          <div className="band-divider"></div>
          <StatItem number="3" suffix="+" label="Anos Ensenando" />
          <div className="band-divider"></div>
          <StatItem number="4" suffix="" label="Mercados" />
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', background: '#0a0a0a' }}>Cargando...</div>}>
        <TestimonialsSection />
      </Suspense>

      {/* ─── CTA ─── */}
      <section className="cta-section animate-on-scroll">
        <div className="cta-content">
          <span className="section-eyebrow stagger-child">CUPOS LIMITADOS</span>
          <h2 className="stagger-child">
            <SplitText delay={0.1}>COMIENZA TU CAMINO COMO TRADER</SplitText>
          </h2>
          <p className="stagger-child">Inscribete ahora y da el primer paso hacia tu libertad financiera.</p>
          <Link to="/registro" className="cta-button magnetic-btn stagger-child">INSCRIBIRSE AHORA</Link>
        </div>
      </section>
    </>
  );
}

export default HomePage;
