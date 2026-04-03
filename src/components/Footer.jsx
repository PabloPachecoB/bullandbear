import { Link } from 'react-router-dom';
import './Footer.css';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Link to="/admin" className="footer-logo">
          <Logo size={70} />
        </Link>

        <div className="footer-links">
          <Link to="/">Inicio</Link>
          <a href="#programa">Programa</a>
          <Link to="/registro">Inscribirse</Link>
          <a href="https://www.instagram.com/bullandbear.lp/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>

        <div className="footer-bottom">
          <div className="social-links">
            <a href="https://www.instagram.com/bullandbear.lp/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              &#128247;
            </a>
          </div>

          <div className="copyright">
            Bull & Bear Trading Academy &copy; 2026 - Todos los derechos reservados
          </div>

          <div className="spacex-link">
            Academia de Trading en Bolivia
            <br />
            &#128205; La Paz, Bolivia
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
