import { useState, useEffect, useRef } from 'react';
import './OptimizedImage.css';

function OptimizedImage({ 
  src, 
  alt = '', 
  lowQualitySrc = null,
  className = '',
  style = {}
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={`optimized-image-container ${className}`}
      style={style}
    >
      {/* Imagen de baja calidad (placeholder) */}
      {lowQualitySrc && !isLoaded && (
        <img
          src={lowQualitySrc}
          alt={alt}
          className="optimized-image-placeholder"
          style={{ filter: 'blur(10px)' }}
        />
      )}
      
      {/* Imagen de alta calidad */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`optimized-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={handleLoad}
          loading="lazy"
        />
      )}
      
      {/* Loading spinner */}
      {!isLoaded && (
        <div className="image-loader"></div>
      )}
    </div>
  );
}

export default OptimizedImage;
