from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.schemas.categoria import CategoriaResponse

class ProductoBase(BaseModel):
    nombre: str
    sku: str
    descripcion: Optional[str] = None
    cepa: Optional[str] = None
    pais_origen: Optional[str] = None
    grado_alcohol: Optional[Decimal] = None
    volumen_ml: int
    stock_minimo: int = 5
    imagen_url: Optional[str] = None
    activo: bool = True

class ProductoCreate(ProductoBase):
    categoria_id: int
    stock_actual: int = 0

class ProductoUpdate(BaseModel):
    categoria_id: Optional[int] = None
    nombre: Optional[str] = None
    sku: Optional[str] = None
    descripcion: Optional[str] = None
    cepa: Optional[str] = None
    pais_origen: Optional[str] = None
    grado_alcohol: Optional[Decimal] = None
    volumen_ml: Optional[int] = None
    stock_minimo: Optional[int] = None
    imagen_url: Optional[str] = None
    activo: Optional[bool] = None

class ProductoResponse(ProductoBase):
    id: int
    categoria_id: int
    stock_actual: int
    created_at: datetime
    updated_at: datetime
    categoria: Optional[CategoriaResponse] = None

    model_config = ConfigDict(from_attributes=True)

class ProductoPublicCatalog(BaseModel):
    id: int
    nombre: str
    sku: str
    descripcion: Optional[str] = None
    cepa: Optional[str] = None
    pais_origen: Optional[str] = None
    grado_alcohol: Optional[Decimal] = None
    volumen_ml: int
    imagen_url: Optional[str] = None
    disponible: bool
    categoria_nombre: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
