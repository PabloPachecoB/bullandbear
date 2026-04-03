import { useEffect, useRef, useState } from 'react';
import { useScrollProgress } from '../hooks/useScrollAnimations';
import './ContentSection.css';

function ContentSection({ title, description, imageUrl, reverse = false, sectionId = '', index = 1 }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const progress = useScrollProgress(sectionRef);

  // Parallax: image moves slower than scroll (creates depth)
  const parallaxY = (progress - 0.5) * -60;
  // Subtle scale based on scroll
  const imageScale = 1 + (1 - Math.abs(progress - 0.5) * 2) * 0.08;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Split title into words for staggered reveal
  const titleWords = title.split(' ');

  return (
    <section
      ref={sectionRef}
      className={`content-section ${reverse ? 'reverse' : ''} ${isVisible ? 'visible' : ''}`}
      id={sectionId}
    >
      <div className="content-image-wrap">
        <div
          className="content-image"
          style={{
            backgroundImage: `url(${imageUrl})`,
            transform: `scale(${isVisible ? imageScale : 1.2}) translateY(${parallaxY}px)`,
          }}
          role="img"
          aria-label={title}
        ></div>
        <div className="image-reveal-overlay"></div>
      </div>

      <div className="content-text">
        <div className="content-text-inner">
          <span className="content-index">0{index}</span>
          <div className="text-reveal-wrap">
            <h2>
              {titleWords.map((word, i) => (
                <span key={i} className="word-reveal-wrap">
                  <span className="word-reveal" style={{ transitionDelay: `${0.5 + i * 0.08}s` }}>
                    {word}
                  </span>
                  {i < titleWords.length - 1 && ' '}
                </span>
              ))}
            </h2>
          </div>
          <div className="text-reveal-wrap">
            <p>{description}</p>
          </div>
          <div className="content-line"></div>
        </div>
      </div>
    </section>
  );
}

export default ContentSection;
