from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.producto import Producto
from app.models.movimiento_stock import MovimientoStock, TipoMovimiento
from app.schemas.movimiento_stock import MovimientoStockCreate, MovimientoStockResponse
from app.schemas.producto import ProductoResponse

router = APIRouter()

@router.post("/movimientos", response_model=MovimientoStockResponse, status_code=status.HTTP_201_CREATED)
def registrar_movimiento(movimiento_in: MovimientoStockCreate, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == movimiento_in.producto_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    
    stock_ant = producto.stock_actual
    
    if movimiento_in.tipo == TipoMovimiento.ENTRADA:
        if movimiento_in.cantidad <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La cantidad para entrada debe ser mayor a 0")
        nuevo_stock = stock_ant + movimiento_in.cantidad
        
    elif movimiento_in.tipo == TipoMovimiento.SALIDA:
        if movimiento_in.cantidad <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La cantidad para salida debe ser mayor a 0")
        if stock_ant < movimiento_in.cantidad:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Stock insuficiente. Stock actual: {stock_ant}")
        nuevo_stock = stock_ant - movimiento_in.cantidad
        
    elif movimiento_in.tipo == TipoMovimiento.AJUSTE:
        # En ajuste, cantidad es el nuevo valor final de stock deseado
        if movimiento_in.cantidad < 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El stock ajustado no puede ser negativo")
        nuevo_stock = movimiento_in.cantidad

    # Actualizar producto
    producto.stock_actual = nuevo_stock
    
    # Crear registro de auditoría de movimiento
    movimiento = MovimientoStock(
        producto_id=producto.id,
        tipo=movimiento_in.tipo,
        cantidad=movimiento_in.cantidad,
        stock_anterior=stock_ant,
        stock_nuevo=nuevo_stock,
        motivo=movimiento_in.motivo
    )
    
    db.add(movimiento)
    db.commit()
    db.refresh(movimiento)
    return movimiento

@router.get("/movimientos", response_model=List[MovimientoStockResponse])
def listar_movimientos(
    producto_id: int = Query(None),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(MovimientoStock)
    if producto_id:
        query = query.filter(MovimientoStock.producto_id == producto_id)
    return query.order_by(MovimientoStock.created_at.desc()).limit(limit).all()

@router.get("/alertas-bajo-stock", response_model=List[ProductoResponse])
def productos_bajo_stock(db: Session = Depends(get_db)):
    """Obtiene los productos cuyo stock actual sea menor o igual a su stock mínimo configurado."""
    return db.query(Producto).filter(
        Producto.activo == True,
        Producto.stock_actual <= Producto.stock_minimo
    ).order_by(Producto.stock_actual.asc()).all()
