import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Wine } from 'lucide-react';
import MenuOverlay from './MenuOverlay';

export const Encabezado: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header-casillero ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="header-casillero-inner">
          <Link to="/" className="brand-casillero">
            <Wine size={20} className="text-amber-400" />
            <span className="brand-name">BOMECH</span>
          </Link>

          <nav className="nav-desktop">
            <Link to="/" className={`nav-desk-link ${location.pathname === '/' ? 'active' : ''}`}>
              INICIO
            </Link>
            <Link to="/catalogo" className={`nav-desk-link ${location.pathname === '/catalogo' ? 'active' : ''}`}>
              CATÁLOGO DE LICORES
            </Link>
          </nav>

          <button
            type="button"
            className="btn-menu-trigger"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir Menú de Navegación"
          >
            <span className="menu-trigger-text">MENÚ</span>
            <Menu size={20} />
          </button>
        </div>
      </header>

      <MenuOverlay abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
    </>
  );
};

export default Encabezado;
