import React from 'react';
import { Search, X } from 'lucide-react';

interface BarraBusquedaProps {
  valor: string;
  onCambiar: (valor: string) => void;
  placeholder?: string;
}

export const BarraBusqueda: React.FC<BarraBusquedaProps> = ({
  valor,
  onCambiar,
  placeholder = 'BUSCAR POR NOMBRE, CEPA, VALLE O CÓDIGO SKU...',
}) => {
  return (
    <div className="buscador-casillero-wrapper">
      <Search className="buscador-icon" size={18} />
      <input
        type="text"
        className="buscador-input"
        placeholder={placeholder}
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
      />
      {valor && (
        <button
          type="button"
          className="buscador-limpiar-btn"
          onClick={() => onCambiar('')}
          title="Limpiar búsqueda"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default BarraBusqueda;
