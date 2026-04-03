import { useState, useEffect } from 'react';
import './PlansModal.css';

function PlansModal({ isOpen, onClose, onOpenContact }) {
  const [stars, setStars] = useState([]);
  const [backgroundStars, setBackgroundStars] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Generar estrellas que suben y desaparecen
      const newStars = Array.from({ length: 800 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 0.8 + Math.random() * 0.8
      }));
      setStars(newStars);

      // Generar estrellas que se quedan en el fondo
      const bgStars = Array.from({ length: 150 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 0.5,
        size: 2 + Math.random() * 3
      }));
      setBackgroundStars(bgStars);

      // Limpiar estrellas animadas después de que terminen de subir
      const cleanupTimer = setTimeout(() => {
        setStars([]);
      }, 1800);

      return () => clearTimeout(cleanupTimer);
    } else {
      // Limpiar todo cuando se cierra el modal
      setStars([]);
      setBackgroundStars([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const plans = [
    {
      title: "Plan Minibus",
      subtitle: "Para vans y minibuses",
      capacity: "Hasta 15 pasajeros",
      speed: "100 Mbps",
      features: [
        "Datos ilimitados",
        "Instalación incluida",
        "Router WiFi profesional",
        "Soporte técnico 24/7",
        "Mantenimiento mensual"
      ],
      icon: "🚐"
    },
    {
      title: "Plan Bus de Turismo",
      subtitle: "Para buses interdepartamentales",
      capacity: "30-50 pasajeros",
      speed: "200 Mbps",
      features: [
        "Datos ilimitados",
        "Instalación premium",
        "Router de alta capacidad",
        "Soporte prioritario 24/7",
        "Mantenimiento quincenal",
        "Portal de gestión WiFi"
      ],
      icon: "🚌",
      popular: true
    },
    {
      title: "Plan Flota Empresarial",
      subtitle: "Para múltiples vehículos",
      capacity: "Ilimitado",
      speed: "200+ Mbps",
      features: [
        "Datos ilimitados",
        "Instalación en toda la flota",
        "Gestión centralizada",
        "Soporte dedicado 24/7",
        "Mantenimiento semanal",
        "Dashboard empresarial"
      ],
      icon: "🏢"
    }
  ];

  return (
    <div className="plans-modal-overlay" onClick={onClose}>
      {/* Estrellas animadas desde abajo */}
      <div className="modal-stars">
        {stars.map(star => (
          <div
            key={star.id}
            className="modal-star"
            style={{
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
      </div>

      {/* Estrellas de fondo que se quedan */}
      <div className="background-stars">
        {backgroundStars.map(star => (
          <div
            key={`bg-${star.id}`}
            className="background-star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      <div className="plans-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <h2>Elige tu Plan Ideal</h2>
          <p>Conectividad satelital para tu flota de transporte</p>
        </div>

        <div className="plans-grid">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`plan-modal-card ${plan.popular ? 'popular-plan' : ''}`}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="popular-badge">⭐ Más Popular</div>
              )}
              
              <div className="plan-icon">{plan.icon}</div>
              
              <h3>{plan.title}</h3>
              <p className="plan-subtitle">{plan.subtitle}</p>
              
              <div className="plan-specs">
                <div className="spec">
                  <span className="spec-label">Capacidad</span>
                  <span className="spec-value">{plan.capacity}</span>
                </div>
                <div className="spec">
                  <span className="spec-label">Velocidad</span>
                  <span className="spec-value">{plan.speed}</span>
                </div>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="check-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className="btn-plan-select"
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
              >
                Solicitar este plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlansModal;
