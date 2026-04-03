import './Logo.css';

const Logo = ({ size = 55, className = '' }) => {
  return (
    <div className={`bb-logo-wrap ${className}`} style={{ '--logo-size': `${size}px` }}>
      {/* Rotating glow ring */}
      <div className="logo-glow-ring"></div>
      {/* Particles */}
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className="logo-particle"
          style={{
            '--angle': `${(i / 10) * 360}deg`,
            '--delay': `${i * 0.3}s`,
            '--duration': `${2 + (i % 3) * 0.5}s`,
            '--distance': `${4 + (i % 4) * 3}px`,
          }}
        />
      ))}
      {/* Logo image */}
      <img
        className="bb-logo-img"
        src="/images/logo_bull&bear_negro.png"
        alt="Bull & Bear Academy"
      />
    </div>
  );
};

export default Logo;
