import { EstadoTarea, DificultadTarea } from './tarea.ts';

export const traducirEstado = (input: string = ""): EstadoTarea => {
  const mapa: Record<string, EstadoTarea> = {
    'P': 'pendiente',
    'E': 'en curso',
    'T': 'terminada',
    'C': 'cancelada',
    'V': 'vencida',
    '': 'pendiente' // Default si el usuario presiona Enter
  };
  return mapa[input.toUpperCase()] || 'pendiente';
};

export const traducirDificultad = (input: string = ""): DificultadTarea => {
  const mapa: Record<string, DificultadTarea> = {
    '1': 'fácil',
    '2': 'media',
    '3': 'difícil',
    '': 'fácil' // Default si el usuario presiona Enter
  };
  return mapa[input] || 'facil';
};

// se usa en crearTarea y editarTarea para traducir las entradas del usuario