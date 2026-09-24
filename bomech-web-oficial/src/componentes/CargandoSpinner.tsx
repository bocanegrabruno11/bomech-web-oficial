import React from 'react';
import { Wine } from 'lucide-react';

export const CargandoSpinner: React.FC<{ mensaje?: string }> = ({
  mensaje = 'Consultando colección exclusiva...',
}) => {
  return (
    <div className="cargando-wrapper">
      <div className="cargando-spinner-ring">
        <Wine size={28} className="cargando-icon animate-pulse" />
      </div>
      <p className="cargando-texto">{mensaje}</p>
    </div>
  );
};

export default CargandoSpinner;
