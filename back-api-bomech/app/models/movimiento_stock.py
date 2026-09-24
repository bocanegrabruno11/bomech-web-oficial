import enum
from sqlalchemy import Column, Integer, BigInteger, String, Enum, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class TipoMovimiento(str, enum.Enum):
    ENTRADA = "ENTRADA"
    SALIDA = "SALIDA"
    AJUSTE = "AJUSTE"

class MovimientoStock(Base):
    __tablename__ = "movimientos_stock"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    producto_id = Column(Integer, ForeignKey("productos.id", ondelete="RESTRICT"), nullable=False, index=True)
    tipo = Column(Enum(TipoMovimiento), nullable=False)
    cantidad = Column(Integer, nullable=False)
    stock_anterior = Column(Integer, nullable=False)
    stock_nuevo = Column(Integer, nullable=False)
    motivo = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())

    producto = relationship("Producto", back_populates="movimientos")
