import { clienteApi } from './clienteApi';
import type { ProductoPublico, ProductoDetalle, Categoria } from '../tipos';

export const servicioCatalogo = {
  async obtenerCategorias(): Promise<Categoria[]> {
    const respuesta = await clienteApi.get<Categoria[]>('/categorias/');
    return respuesta.data;
  },

  async obtenerCatalogo(categoriaSlug?: string, busqueda?: string): Promise<ProductoPublico[]> {
    const params: Record<string, string> = {};
    if (categoriaSlug) params.categoria_slug = categoriaSlug;
    if (busqueda) params.search = busqueda;

    const respuesta = await clienteApi.get<ProductoPublico[]>('/catalogo/productos', { params });
    return respuesta.data;
  },

  async obtenerDetalleProducto(id: number): Promise<ProductoDetalle> {
    const respuesta = await clienteApi.get<ProductoDetalle>(`/catalogo/productos/${id}`);
    return respuesta.data;
  },
};
