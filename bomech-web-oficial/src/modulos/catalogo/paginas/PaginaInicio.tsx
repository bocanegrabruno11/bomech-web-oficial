import React, { useEffect, useState } from 'react';
import { servicioCatalogo } from '../../../servicios';
import type { ProductoPublico, Categoria } from '../../../tipos';
import TarjetaProducto from '../componentes/TarjetaProducto';
import FiltroCategorias from '../componentes/FiltroCategorias';
import BarraBusqueda from '../componentes/BarraBusqueda';
import CargandoSpinner from '../../../componentes/CargandoSpinner';
import Encabezado from '../../../componentes/Encabezado';
import PiePagina from '../../../componentes/PiePagina';
import { Wine, AlertCircle, ArrowDown } from 'lucide-react';

export const PaginaInicio: React.FC = () => {
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
            console.error('Error al cargar catálogo:', err);
            setError('No se pudo cargar la colección de productos. Verifica el servidor backend.');
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

      {/* Hero Principal */}
      <section className="hero-casillero">
        <div className="hero-casillero-overlay"></div>
        <div className="hero-casillero-contenido">
          <span className="subtitulo-dorado">COLECCIÓN PRIVADA & DESTILADOS</span>
          <h1 className="hero-casillero-titulo">BOMECH</h1>
          <p className="hero-casillero-descripcion">
            Explora nuestro catálogo selecto de vinos finos, piscos y licores nobles. Calidad, detalle técnico y disponibilidad en tiempo real.
          </p>
          <a href="#catalogo" className="btn-dorado-hero">
            <span>VER CATÁLOGO</span>
            <ArrowDown size={18} />
          </a>
        </div>
      </section>

      {/* Sección Catálogo de Productos */}
      <main id="catalogo" className="contenedor-general py-12">
        <div className="destacados-header text-center mb-8">
          <span className="subtitulo-dorado">NUESTRA CAVA</span>
          <h2 className="titulo-seccion-grande">CATÁLOGO DE PRODUCTOS</h2>
          <div className="separador-dorado"></div>
        </div>

        {/* Buscador y Filtros */}
        <div className="catalogo-filtros-contenedor">
          <BarraBusqueda valor={busqueda} onCambiar={setBusqueda} />
          <FiltroCategorias
            categorias={categorias}
            categoriaSeleccionadaSlug={categoriaSeleccionada}
            onSeleccionarCategoria={setCategoriaSeleccionada}
          />
        </div>

        {/* Estado de Carga / Error */}
        {cargando && <CargandoSpinner mensaje="Cargando botellas disponibles..." />}

        {error && !cargando && (
          <div className="alerta-error-casillero">
            <AlertCircle size={20} className="text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Grilla de Vinos */}
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
                  No se encontraron productos
                </h3>
                <p className="text-sm text-stone-400 max-w-md mt-2">
                  Prueba seleccionando otra categoría o borrando los términos de búsqueda.
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

export default PaginaInicio;
