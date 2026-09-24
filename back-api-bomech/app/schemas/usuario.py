from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.usuario import RolUsuario

class UsuarioBase(BaseModel):
    username: str
    email: EmailStr
    rol: RolUsuario = RolUsuario.CLIENTE
    activo: bool = True

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioResponse(UsuarioBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UsuarioResponse

class LoginRequest(BaseModel):
    username: str
    password: str
