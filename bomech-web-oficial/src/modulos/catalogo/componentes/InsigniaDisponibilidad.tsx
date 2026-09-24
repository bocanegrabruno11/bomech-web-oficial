import React from 'react';
import { Check, X } from 'lucide-react';

interface InsigniaDisponibilidadProps {
  disponible: boolean;
  tamano?: 'sm' | 'md';
}

export const InsigniaDisponibilidad: React.FC<InsigniaDisponibilidadProps> = ({
  disponible,
  tamano = 'sm',
}) => {
  if (disponible) {
    return (
      <span className={`insignia-disponibilidad disponible ${tamano === 'md' ? 'tamano-md' : ''}`}>
        <Check size={tamano === 'md' ? 14 : 12} />
        <span>DISPONIBLE</span>
      </span>
    );
  }

  return (
    <span className={`insignia-disponibilidad agotado ${tamano === 'md' ? 'tamano-md' : ''}`}>
      <X size={tamano === 'md' ? 14 : 12} />
      <span>AGOTADO</span>
    </span>
  );
};

export default InsigniaDisponibilidad;
