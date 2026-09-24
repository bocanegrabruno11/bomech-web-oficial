import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Wine } from 'lucide-react';

interface MenuOverlayProps {
  abierto: boolean;
  onCerrar: () => void;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ abierto, onCerrar }) => {
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [abierto]);

  if (!abierto) return null;

  return (
    <div className="menu-overlay-backdrop">
      <button
        type="button"
        className="menu-close-btn"
        onClick={onCerrar}
        aria-label="Cerrar Menú"
      >
        <X size={32} />
      </button>

      <div className="menu-overlay-content">
        <div className="menu-brand-header">
          <Wine size={32} className="text-amber-400 mb-2" />
          <h2 className="menu-brand-title">BOMECH</h2>
          <span className="menu-brand-tagline">Vinos & Licores Finos</span>
        </div>

        <nav className="menu-nav-links">
          <Link to="/" className="menu-link-item" onClick={onCerrar}>
            INICIO
          </Link>
          <Link to="/catalogo" className="menu-link-item" onClick={onCerrar}>
            CATÁLOGO DE VINOS & LICORES
          </Link>
        </nav>

        <div className="menu-language-selector">
          <span>ESPAÑOL</span>
        </div>

        <div className="menu-social-icons">
          <a href="#facebook" className="social-link" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          <a href="#twitter" className="social-link" aria-label="X Twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#instagram" className="social-link" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="#youtube" className="social-link" aria-label="YouTube">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;
