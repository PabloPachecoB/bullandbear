import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import Logo from './Logo';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isAdmin = location.pathname === '/admin';
  const isRegistro = location.pathname === '/registro';

  // No mostrar header en admin
  if (isAdmin) return null;

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <Logo size={50} />
          </Link>

          <div className="nav-links">
            {isHome ? (
              <>
                <a href="#programa">Programa</a>
                <a href="#beneficios">Beneficios</a>
                <a href="#testimonios">Testimonios</a>
              </>
            ) : (
              <Link to="/">Inicio</Link>
            )}
            {!isRegistro && <Link to="/registro" className="nav-cta">Inscribirse</Link>}
          </div>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className="menu-icon">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <button className="close-button" onClick={() => setMenuOpen(false)}>
            ✕
          </button>
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          {isHome && (
            <>
              <a href="#programa" onClick={() => setMenuOpen(false)}>Programa</a>
              <a href="#beneficios" onClick={() => setMenuOpen(false)}>Beneficios</a>
              <a href="#testimonios" onClick={() => setMenuOpen(false)}>Testimonios</a>
            </>
          )}
          {!isRegistro && (
            <Link to="/registro" onClick={() => setMenuOpen(false)} className="mobile-cta">Inscribirse</Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
