import type { Categoria } from './categoria';

export interface ProductoPublico {
  id: number;
  nombre: string;
  sku: string;
  descripcion?: string;
  cepa?: string;
  pais_origen?: string;
  grado_alcohol?: number;
  volumen_ml: number;
  imagen_url?: string;
  disponible: boolean;
  categoria_nombre?: string;
}

export interface ProductoDetalle {
  id: number;
  categoria_id: number;
  nombre: string;
  sku: string;
  descripcion?: string;
  cepa?: string;
  pais_origen?: string;
  grado_alcohol?: number;
  volumen_ml: number;
  stock_actual: number;
  imagen_url?: string;
  activo: boolean;
  categoria?: Categoria;
}
