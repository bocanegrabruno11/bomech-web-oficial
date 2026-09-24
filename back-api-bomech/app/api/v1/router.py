from fastapi import APIRouter
from app.api.v1.endpoints import catalogo, productos, categorias, stock

api_router = APIRouter()

api_router.include_router(catalogo.router, prefix="/catalogo", tags=["Catálogo Público"])
api_router.include_router(productos.router, prefix="/productos", tags=["Gestión de Productos"])
api_router.include_router(categorias.router, prefix="/categorias", tags=["Categorías"])
api_router.include_router(stock.router, prefix="/stock", tags=["Control de Stock e Inventario"])
