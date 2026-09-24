from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.producto import Producto
from app.models.categoria import Categoria
from app.schemas.producto import ProductoCreate, ProductoUpdate, ProductoResponse

router = APIRouter()

@router.get("/", response_model=List[ProductoResponse])
def listar_productos_admin(
    categoria_id: Optional[int] = Query(None),
    solo_activos: bool = Query(False),
    db: Session = Depends(get_db)
):
    query = db.query(Producto)
    if categoria_id:
        query = query.filter(Producto.categoria_id == categoria_id)
    if solo_activos:
        query = query.filter(Producto.activo == True)
    return query.order_by(Producto.id.desc()).all()

@router.get("/{producto_id}", response_model=ProductoResponse)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto

@router.post("/", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def crear_producto(producto_in: ProductoCreate, db: Session = Depends(get_db)):
    # Validar SKU único
    existente_sku = db.query(Producto).filter(Producto.sku == producto_in.sku).first()
    if existente_sku:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un producto con el SKU '{producto_in.sku}'"
        )
    
    # Validar categoría
    categoria = db.query(Categoria).filter(Categoria.id == producto_in.categoria_id).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La categoría especificada no existe"
        )
    
    producto = Producto(**producto_in.model_dump())
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto

@router.put("/{producto_id}", response_model=ProductoResponse)
def actualizar_producto(producto_id: int, producto_in: ProductoUpdate, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    
    update_data = producto_in.model_dump(exclude_unset=True)
    
    if "sku" in update_data and update_data["sku"] != producto.sku:
        existente = db.query(Producto).filter(Producto.sku == update_data["sku"]).first()
        if existente:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El SKU ya está en uso")

    if "categoria_id" in update_data and update_data["categoria_id"] != producto.categoria_id:
        categoria = db.query(Categoria).filter(Categoria.id == update_data["categoria_id"]).first()
        if not categoria:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La categoría no existe")

    for field, value in update_data.items():
        setattr(producto, field, value)
        
    db.commit()
    db.refresh(producto)
    return producto

@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_o_desactivar_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    
    # Soft delete (desactivación)
    producto.activo = False
    db.commit()
    return None
