from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.movimiento_stock import TipoMovimiento

class MovimientoStockCreate(BaseModel):
    producto_id: int
    tipo: TipoMovimiento
    cantidad: int
    motivo: str

class MovimientoStockResponse(BaseModel):
    id: int
    producto_id: int
    tipo: TipoMovimiento
    cantidad: int
    stock_anterior: int
    stock_nuevo: int
    motivo: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
