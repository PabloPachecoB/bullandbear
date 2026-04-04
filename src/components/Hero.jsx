import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    // Trigger entrance animation after mount
    requestAnimationFrame(() => setLoaded(true));

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.4;
  const titleOpacity = Math.max(1 - scrollY * 0.002, 0);
  const titleTranslate = scrollY * 0.15;
  // Spread effect: title lines move apart on scroll
  const spreadAmount = scrollY * 0.03;

  return (
    <section className={`hero ${loaded ? 'hero-loaded' : ''}`} ref={heroRef}>
      <div className="hero-background">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=2000&q=80"
          style={{ transform: `scale(${1 + scrollY * 0.0003}) translateY(${parallaxOffset}px)` }}
        >
          <source src="https://assets.mixkit.co/videos/47006/47006-720.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content"> 
  
  <h1 className="hero-title"> {/* <-- ESTO ES LO QUE TE FALTA */}
    <div 
      className="title-line" 
      style={{ transform: `translateY(${-spreadAmount}px)` }}
    >
      DOMINA LOS
    </div>
    
    <div className="title-line title-accent">
      MERCADOS
    </div>
    
    <div 
      className="title-line" 
      style={{ transform: `translateY(${spreadAmount}px)` }}
    >
      FINANCIEROS
    </div>
  </h1> {/* <-- CIERRE DEL PADRE */}

  <p className="hero-subtitle">
    Formación presencial en La Paz, Bolivia.
    <br />
    De principiante a trader consistente.
  </p>

        <div className="hero-buttons">
          <Link to="/registro" className="hero-cta-primary">
            INSCRIBIRSE AHORA
          </Link>
          <a href="#programa" className="hero-cta-secondary">
            EXPLORAR PROGRAMA
            <span className="arrow-down">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-line"></div>
      </div>

      {/* Marquee */}
      <div className="hero-marquee">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="marquee-content">
              <span>FOREX</span>
              <span className="marquee-dot"></span>
              <span>CRYPTO</span>
              <span className="marquee-dot"></span>
              <span>ACCIONES</span>
              <span className="marquee-dot"></span>
              <span>INDICES</span>
              <span className="marquee-dot"></span>
              <span>ANALISIS TECNICO</span>
              <span className="marquee-dot"></span>
              <span>GESTION DE RIESGO</span>
              <span className="marquee-dot"></span>
              <span>PSICOLOGIA DEL TRADER</span>
              <span className="marquee-dot"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
