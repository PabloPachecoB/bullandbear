import './PricingSection.css';

function PricingSection({ onOpenContact }) {
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
      popular: false
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
        "Portal de gestión WiFi",
        "Sistema de publicidad"
      ],
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
        "Dashboard empresarial",
        "Analytics en tiempo real",
        "Descuento por volumen"
      ],
      popular: false
    }
  ];

  return (
    <section className="pricing-section" id="planes">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2>Planes Diseñados para tu Negocio</h2>
          <p>Elige el plan que mejor se adapte a tu flota de transporte</p>
        </div>

        <div className="pricing-cards">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">Más Popular</div>
              )}
              
              <div className="plan-header">
                <h3>{plan.title}</h3>
                <p className="plan-subtitle">{plan.subtitle}</p>
              </div>

              <div className="plan-specs">
                <div className="spec-item">
                  <span className="spec-label">Capacidad</span>
                  <span className="spec-value">{plan.capacity}</span>
                </div>
                <div className="spec-item">
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
                className="plan-button"
                onClick={onOpenContact}
              >
                Solicitar Cotización
              </button>
            </div>
          ))}
        </div>

        <p className="pricing-note">
          * Los precios varían según la cantidad de vehículos y configuración específica. 
          Contacta con nosotros para una cotización personalizada.
        </p>
      </div>
    </section>
  );
}

export default PricingSection;
