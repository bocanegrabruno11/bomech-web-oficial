import React from 'react';
import type { Categoria } from '../../../tipos';

interface FiltroCategoriasProps {
  categorias: Categoria[];
  categoriaSeleccionadaSlug: string;
  onSeleccionarCategoria: (slug: string) => void;
}

export const FiltroCategorias: React.FC<FiltroCategoriasProps> = ({
  categorias,
  categoriaSeleccionadaSlug,
  onSeleccionarCategoria,
}) => {
  return (
    <div className="filtro-categorias-casillero">
      <button
        type="button"
        className={`filtro-btn-item ${categoriaSeleccionadaSlug === '' ? 'activo' : ''}`}
        onClick={() => onSeleccionarCategoria('')}
      >
        <span>TODAS LAS COLECCIONES</span>
      </button>

      {categorias.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`filtro-btn-item ${categoriaSeleccionadaSlug === cat.slug ? 'activo' : ''}`}
          onClick={() => onSeleccionarCategoria(cat.slug)}
        >
          <span>{cat.nombre.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};

export default FiltroCategorias;
