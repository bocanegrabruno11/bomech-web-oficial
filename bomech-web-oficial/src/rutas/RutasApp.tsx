import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CargandoSpinner from '../componentes/CargandoSpinner';

// Code-splitting mediante React.lazy
const PaginaInicio = lazy(() => import('../modulos/catalogo/paginas/PaginaInicio'));
const PaginaCatalogo = lazy(() => import('../modulos/catalogo/paginas/PaginaCatalogo'));
const PaginaDetalleProducto = lazy(() => import('../modulos/catalogo/paginas/PaginaDetalleProducto'));

export const RutasApp: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<CargandoSpinner mensaje="Abriendo cava de BOMECH..." />}>
        <Routes>
          {/* Rutas Públicas de Clientes */}
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/catalogo" element={<PaginaCatalogo />} />
          <Route path="/vinos" element={<PaginaCatalogo />} />
          <Route path="/producto/:id" element={<PaginaDetalleProducto />} />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default RutasApp;
