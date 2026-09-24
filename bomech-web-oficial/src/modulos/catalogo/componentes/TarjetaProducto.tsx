import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductoPublico } from '../../../tipos';
import InsigniaDisponibilidad from './InsigniaDisponibilidad';
import { Wine, ArrowRight } from 'lucide-react';

interface TarjetaProductoProps {
  producto: ProductoPublico;
}

export const TarjetaProducto: React.FC<TarjetaProductoProps> = ({ producto }) => {
  return (
    <article className="tarjeta-vino-casillero">
      <div className="tarjeta-vino-imagen-caja">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="tarjeta-vino-img"
            loading="lazy"
          />
        ) : (
          <div className="tarjeta-vino-placeholder">
            <Wine size={54} className="text-amber-500/30" />
            <span className="placeholder-sub">BOMECH RESERVA</span>
          </div>
        )}
        <div className="tarjeta-vino-badge">
          <InsigniaDisponibilidad disponible={producto.disponible} />
        </div>
      </div>

      <div className="tarjeta-vino-cuerpo">
        {producto.categoria_nombre && (
          <span className="tarjeta-vino-categoria">{producto.categoria_nombre}</span>
        )}

        <h3 className="tarjeta-vino-titulo" title={producto.nombre}>
          {producto.nombre}
        </h3>

        <div className="tarjeta-vino-detalles">
          {producto.cepa && (
            <span className="detalle-tag">Cepa: {producto.cepa}</span>
          )}
          {producto.pais_origen && (
            <span className="detalle-tag">Origen: {producto.pais_origen}</span>
          )}
          {producto.volumen_ml && (
            <span className="detalle-tag">{producto.volumen_ml} ML</span>
          )}
          {producto.grado_alcohol !== undefined && producto.grado_alcohol !== null && (
            <span className="detalle-tag">{producto.grado_alcohol}% VOL</span>
          )}
        </div>

        <div className="tarjeta-vino-pie">
          <span className="sku-codigo">SKU: {producto.sku}</span>
          <Link
            to={`/producto/${producto.id}`}
            className="btn-ver-ficha-casillero"
          >
            <span>VER FICHA</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TarjetaProducto;
