from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.core.database import get_db
from app.models.producto import Producto
from app.models.categoria import Categoria
from app.schemas.producto import ProductoResponse, ProductoPublicCatalog

router = APIRouter()

@router.get("/productos", response_model=List[ProductoPublicCatalog])
def listar_catalogo_publico(
    categoria_slug: Optional[str] = Query(None, description="Filtrar por slug de categoría"),
    search: Optional[str] = Query(None, description="Búsqueda por nombre, cepa, país o SKU"),
    db: Session = Depends(get_db)
):
    query = db.query(Producto).join(Producto.categoria).filter(Producto.activo == True)

    if categoria_slug:
        query = query.filter(Categoria.slug == categoria_slug)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Producto.nombre.ilike(search_pattern),
                Producto.cepa.ilike(search_pattern),
                Producto.pais_origen.ilike(search_pattern),
                Producto.sku.ilike(search_pattern)
            )
        )

    productos = query.order_by(Producto.nombre.asc()).all()

    return [
        ProductoPublicCatalog(
            id=p.id,
            nombre=p.nombre,
            sku=p.sku,
            descripcion=p.descripcion,
            cepa=p.cepa,
            pais_origen=p.pais_origen,
            grado_alcohol=p.grado_alcohol,
            volumen_ml=p.volumen_ml,
            imagen_url=p.imagen_url,
            disponible=(p.stock_actual > 0),
            categoria_nombre=p.categoria.nombre if p.categoria else None
        )
        for p in productos
    ]

@router.get("/productos/{producto_id}", response_model=ProductoResponse)
def obtener_detalle_publico(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id, Producto.activo == True).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado o inactivo")
    return producto
