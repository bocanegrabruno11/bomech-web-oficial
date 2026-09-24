from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id", ondelete="RESTRICT"), nullable=False, index=True)
    nombre = Column(String(150), nullable=False)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    descripcion = Column(Text, nullable=True)
    cepa = Column(String(100), nullable=True)
    pais_origen = Column(String(80), nullable=True)
    grado_alcohol = Column(Numeric(4, 2), nullable=True)
    volumen_ml = Column(Integer, nullable=False)
    stock_actual = Column(Integer, nullable=False, default=0)
    stock_minimo = Column(Integer, nullable=False, default=5)
    imagen_url = Column(String(500), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    categoria = relationship("Categoria", back_populates="productos")
    movimientos = relationship("MovimientoStock", back_populates="producto", cascade="all, delete-orphan")
