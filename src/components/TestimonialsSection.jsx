import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import './TestimonialsSection.css';

/* ─── Shuffle array y tomar N elementos ─── */
function shuffleAndPick(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/* ─── Video Card — autoplay muted, click to toggle sound ─── */
function ReelVideo({ src, index, activeAudio, onActivateAudio, isVisible }) {
  const videoRef = useRef(null);

  // isMuted is derived: only unmuted if this is the active audio
  const isMuted = activeAudio !== index;

  // Keep the video element's muted property in sync
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = isMuted;
  }, [isMuted]);

  // Autoplay muted when visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const handleToggleSound = () => {
    if (isMuted) {
      onActivateAudio(index);
    } else {
      onActivateAudio(null);
    }
  };

  return (
    <div
      className="reel-card"
      style={{ transitionDelay: isVisible ? `${0.15 + index * 0.12}s` : '0s' }}
    >
      <video
        ref={videoRef}
        className="reel-video"
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <button
        className={`reel-sound-btn ${isMuted ? 'muted' : 'unmuted'}`}
        onClick={handleToggleSound}
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        {isMuted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 010 14.14" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
          </svg>
        )}
      </button>
      {isMuted && (
        <div className="reel-tap-hint" onClick={handleToggleSound}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" opacity="0.8" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ─── Todos los videos disponibles (public/videos/) ─── */
const ALL_VIDEOS = [
  "/videos/A menudo nos dicen que hay que esperar a terminar la universidad para empezar a generar ingresos.mp4",
  "/videos/Para Rodrigo, graduado de nuestra versión 2025, la diferencia no estuvo en los gráficos, sino en.mp4",
  "/videos/¿18 años y ya pensando en inversiones ¡Exacto! 🚀Conoce a Johans. Mientras muchos a su edad reci.mp4",
  "/videos/¿Por qué elegir un curso presencial Liliana Mañueco (Graduada de la 3ra Versión 2025) tiene la r.mp4",
  "/videos/🎙️ No lo decimos nosotros, lo dicen nuestros alumnos. 📈Conoce a Renzo Carvajal, graduado de la.mp4",
  "/videos/🎯 No es suerte, es estructura pura. Así se canta y se cobra un Take Profit EN VIVO. 💸👇El lune.mp4",
  "/videos/📍 ¿No sabes cómo llegar a nuestras oficinas en La PazTe mostramos paso a paso cómo llegar a Bul.mp4",
];

function TestimonialsSection() {
  const sectionRef = useRef(null);
  const reelsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reelsVisible, setReelsVisible] = useState(false);
  const [activeAudio, setActiveAudio] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setReelsVisible(true); },
      { threshold: 0.1 }
    );
    if (reelsRef.current) obs.observe(reelsRef.current);
    return () => obs.disconnect();
  }, []);

  const handleActivateAudio = useCallback((index) => {
    setActiveAudio(index);
  }, []);

  const testimonials = [
    {
      name: "Alejandro Quispe",
      role: "Trader Independiente",
      location: "La Paz",
      text: "Antes de Bull & Bear no tenia idea de como leer un grafico. Hoy opero de forma consistente y ya genero ingresos extras todos los meses. Los mentores son increibles.",
      rating: 5,
      image: "&#128104;&#8205;&#128188;"
    },
    {
      name: "Carla Mamani",
      role: "Estudiante de Economia",
      location: "Cochabamba",
      text: "La academia me dio las herramientas para entender los mercados financieros de verdad. La formacion practica marca la diferencia, no es solo teoria.",
      rating: 5,
      image: "&#128105;&#8205;&#128188;"
    },
    {
      name: "Roberto Fernandez",
      role: "Empresario",
      location: "Santa Cruz",
      text: "Inverti en mi educacion financiera con Bull & Bear y fue la mejor decision. Ahora diversifico mis ingresos con trading. El programa esta muy bien estructurado.",
      rating: 5,
      image: "&#128104;&#8205;&#128188;"
    }
  ];

  // Elegir 4 aleatorios al montar el componente
  const reelVideos = useMemo(() => shuffleAndPick(ALL_VIDEOS, 4), []);

  return (
    <section className={`testimonials-section ${isVisible ? 'visible' : ''}`} id="testimonios" ref={sectionRef}>
      <div className="testimonials-container">
        <div className="testimonials-header">
          <span className="section-eyebrow testimonial-eyebrow">TESTIMONIOS</span>
          <h2>Lo que dicen nuestros estudiantes</h2>
          <p>Traders que transformaron su vida financiera con Bull & Bear</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card"
              style={{ transitionDelay: `${0.2 + index * 0.15}s` }}
            >
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star">&#9733;</span>
                ))}
              </div>

              <p className="testimonial-text">&ldquo;{testimonial.text}&rdquo;</p>

              <div className="testimonial-author">
                <div className="author-avatar" dangerouslySetInnerHTML={{ __html: testimonial.image }}></div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p className="author-company">{testimonial.role}</p>
                  <p className="author-location">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Reels / Videos Section ─── */}
        <div className={`reels-section ${reelsVisible ? 'visible' : ''}`} ref={reelsRef}>
          <div className="reels-header">
            <span className="section-eyebrow reels-eyebrow">SIGUENOS EN REDES</span>
            <h3>Nuestro contenido</h3>
            <p>Clases, analisis y resultados en tiempo real</p>
          </div>

          <div className="reels-grid">
            {reelVideos.map((src, index) => (
              <ReelVideo
                key={src}
                src={src}
                index={index}
                activeAudio={activeAudio}
                onActivateAudio={handleActivateAudio}
                isVisible={reelsVisible}
              />
            ))}
          </div>

          <div className="reels-cta">
            <a
              href="https://www.instagram.com/bullandbear.lp/"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-follow-btn"
            >
              <svg className="ig-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              SEGUIR EN INSTAGRAM
            </a>
            <a
              href="https://www.tiktok.com/@bull.bear.trading"
              target="_blank"
              rel="noopener noreferrer"
              className="tiktok-follow-btn"
            >
              <svg className="tt-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17v-3.48a4.85 4.85 0 01-3.77-1.77V6.69h3.77z" />
              </svg>
              SEGUIR EN TIKTOK
            </a>
          </div>
        </div>

        <div className="testimonials-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Estudiantes Formados</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Tasa de Satisfaccion</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3+</div>
            <div className="stat-label">Anos de Experiencia</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
