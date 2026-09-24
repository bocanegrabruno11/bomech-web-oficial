import React, { useEffect, useState } from 'react';
import { servicioCatalogo } from '../../../servicios';
import type { ProductoPublico, Categoria } from '../../../tipos';
import TarjetaProducto from '../componentes/TarjetaProducto';
import FiltroCategorias from '../componentes/FiltroCategorias';
import BarraBusqueda from '../componentes/BarraBusqueda';
import CargandoSpinner from '../../../componentes/CargandoSpinner';
import Encabezado from '../../../componentes/Encabezado';
import PiePagina from '../../../componentes/PiePagina';
import { Wine, AlertCircle } from 'lucide-react';

export const PaginaCatalogo: React.FC = () => {
  const [productos, setProductos] = useState<ProductoPublico[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    servicioCatalogo
      .obtenerCategorias()
      .then((data: Categoria[]) => setCategorias(data))
      .catch((err: unknown) => console.error('Error cargando categorías:', err));
  }, []);

  useEffect(() => {
    let isMounted = true;
    setCargando(true);
    setError(null);

    const debounceTimer = setTimeout(() => {
      servicioCatalogo
        .obtenerCatalogo(categoriaSeleccionada || undefined, busqueda || undefined)
        .then((data: ProductoPublico[]) => {
          if (isMounted) {
            setProductos(data);
            setCargando(false);
          }
        })
        .catch((err: unknown) => {
          if (isMounted) {
            console.error('Error al consultar catálogo:', err);
            setError('No se pudo cargar la colección de productos.');
            setCargando(false);
          }
        });
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [categoriaSeleccionada, busqueda]);

  return (
    <div className="pagina-principal-wrapper">
      <Encabezado />

      <section className="catalogo-banner-header">
        <div className="contenedor-general text-center">
          <span className="subtitulo-dorado">CATÁLOGO EXCLUSIVO</span>
          <h1 className="titulo-seccion-grande">COLECCIÓN DE VINOS & LICORES</h1>
          <p className="catalogo-banner-sub">
            Explora las etiquetas más finas, notas de cata y disponibilidad inmediata de nuestra bodega.
          </p>
        </div>
      </section>

      <main className="contenedor-general py-10">
        <div className="catalogo-filtros-contenedor">
          <BarraBusqueda valor={busqueda} onCambiar={setBusqueda} />
          <FiltroCategorias
            categorias={categorias}
            categoriaSeleccionadaSlug={categoriaSeleccionada}
            onSeleccionarCategoria={setCategoriaSeleccionada}
          />
        </div>

        {cargando && <CargandoSpinner mensaje="Buscando en la cava de BOMECH..." />}

        {error && !cargando && (
          <div className="alerta-error-casillero">
            <AlertCircle size={20} className="text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {!cargando && !error && (
          <>
            {productos.length > 0 ? (
              <div className="grilla-vinos-casillero">
                {productos.map((producto) => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))}
              </div>
            ) : (
              <div className="vacio-box">
                <Wine size={56} className="text-stone-600 mb-4" />
                <h3 className="text-lg font-serif text-stone-200 uppercase tracking-wider">
                  No se encontraron botellas
                </h3>
                <p className="text-sm text-stone-400 max-w-md mt-2">
                  Prueba seleccionando otra categoría o utilizando términos de búsqueda más generales.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <PiePagina />
    </div>
  );
};

export default PaginaCatalogo;
