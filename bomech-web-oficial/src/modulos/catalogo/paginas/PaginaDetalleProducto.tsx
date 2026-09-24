import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicioCatalogo } from '../../../servicios';
import type { ProductoDetalle } from '../../../tipos';
import InsigniaDisponibilidad from '../componentes/InsigniaDisponibilidad';
import CargandoSpinner from '../../../componentes/CargandoSpinner';
import Encabezado from '../../../componentes/Encabezado';
import PiePagina from '../../../componentes/PiePagina';
import { ArrowLeft, Wine, Globe, Droplets, Percent, Hash, Layers, ShieldCheck, AlertCircle } from 'lucide-react';

export const PaginaDetalleProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<ProductoDetalle | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setCargando(true);
    servicioCatalogo
      .obtenerDetalleProducto(Number(id))
      .then((data: ProductoDetalle) => {
        setProducto(data);
        setCargando(false);
      })
      .catch((err: unknown) => {
        console.error('Error al obtener ficha técnica:', err);
        setError('No se pudo encontrar la información técnica de esta botella.');
        setCargando(false);
      });
  }, [id]);

  return (
    <div className="pagina-principal-wrapper">
      <Encabezado />

      <main className="contenedor-general py-10">
        <div className="mb-8">
          <Link to="/catalogo" className="btn-volver-catalogo">
            <ArrowLeft size={18} />
            <span>VOLVER A LA COLECCIÓN</span>
          </Link>
        </div>

        {cargando && <CargandoSpinner mensaje="Cargando ficha técnica del vino..." />}

        {error && !cargando && (
          <div className="alerta-error-casillero">
            <AlertCircle size={20} className="text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {!cargando && producto && (
          <div className="detalle-producto-casillero">
            {/* Galería / Imagen de Botella */}
            <div className="detalle-imagen-contenedor">
              <div className="detalle-imagen-halo">
                {producto.imagen_url ? (
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="detalle-botella-img"
                  />
                ) : (
                  <div className="detalle-botella-placeholder">
                    <Wine size={88} className="text-amber-500/25" />
                    <span className="placeholder-sub mt-3">COLECCIÓN BOMECH</span>
                  </div>
                )}
                <div className="detalle-badge-posicion">
                  <InsigniaDisponibilidad disponible={producto.stock_actual > 0} tamano="md" />
                </div>
              </div>
            </div>

            {/* Información Técnica */}
            <div className="detalle-info-contenedor">
              {producto.categoria && (
                <span className="detalle-categoria-tag">{producto.categoria.nombre}</span>
              )}

              <h1 className="detalle-nombre-botella">{producto.nombre}</h1>

              <div className="detalle-sku-codigo">
                <Hash size={14} />
                <span>CÓDIGO SKU: <strong>{producto.sku}</strong></span>
              </div>

              {producto.descripcion && (
                <div className="detalle-notas-cata">
                  <h3 className="subtitulo-seccion-dorado">NOTAS DE CATA & MARIDAJE</h3>
                  <p>{producto.descripcion}</p>
                </div>
              )}

              {/* Grid de Especificaciones Técnicas */}
              <div className="especificaciones-tecnicas-caja">
                <h3 className="subtitulo-seccion-dorado">FICHA TÉCNICA DEL SOMMELIER</h3>
                <div className="especificaciones-grid">
                  <div className="especificacion-item">
                    <Wine className="spec-icon-dorado" size={20} />
                    <div>
                      <span className="spec-label-sub">Cepa / Variedad</span>
                      <strong className="spec-val-texto">{producto.cepa || 'Varietal Selecto'}</strong>
                    </div>
                  </div>

                  <div className="especificacion-item">
                    <Globe className="spec-icon-dorado" size={20} />
                    <div>
                      <span className="spec-label-sub">País de Origen</span>
                      <strong className="spec-val-texto">{producto.pais_origen || 'No especificado'}</strong>
                    </div>
                  </div>

                  <div className="especificacion-item">
                    <Droplets className="spec-icon-dorado" size={20} />
                    <div>
                      <span className="spec-label-sub">Volumen Neto</span>
                      <strong className="spec-val-texto">{producto.volumen_ml} ML</strong>
                    </div>
                  </div>

                  <div className="especificacion-item">
                    <Percent className="spec-icon-dorado" size={20} />
                    <div>
                      <span className="spec-label-sub">Graduación Alcohólica</span>
                      <strong className="spec-val-texto">
                        {producto.grado_alcohol !== null && producto.grado_alcohol !== undefined
                          ? `${producto.grado_alcohol}% VOL`
                          : 'No especificado'}
                      </strong>
                    </div>
                  </div>

                  <div className="especificacion-item">
                    <Layers className="spec-icon-dorado" size={20} />
                    <div>
                      <span className="spec-label-sub">Colección / Categoría</span>
                      <strong className="spec-val-texto">{producto.categoria?.nombre || 'Reserva'}</strong>
                    </div>
                  </div>

                  <div className="especificacion-item">
                    <ShieldCheck className="spec-icon-dorado" size={20} />
                    <div>
                      <span className="spec-label-sub">Disponibilidad en Cava</span>
                      <strong className={`spec-val-texto ${producto.stock_actual > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {producto.stock_actual > 0 ? 'Existencias Disponibles' : 'Agotado Temporalmente'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <PiePagina />
    </div>
  );
};

export default PaginaDetalleProducto;
