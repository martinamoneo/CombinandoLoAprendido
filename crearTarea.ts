import { Tarea } from './tarea';
import { traducirEstado, traducirDificultad } from './traduccionTarea';

// interface auxiliar para definir los datos que recolectan Index y GestorTareas
export interface DatosCrearTarea {
  nombre: string;
  descripcion?: string;
  estado: string;
  dificultad: string;
  fechaVencimiento?: string;
  // el gestor de tareas pasa estos datos (porq son impuros)
  id: string; // UUID
  fechaActual: Date;
}

export const crearNuevaTarea = (data: DatosCrearTarea): Tarea => {
  
  // valida nombre y descripción
  if (!data.nombre || data.nombre.length === 0) {
    throw new Error("El nombre es obligatorio.");
  }
  if (data.nombre.length > 100) {
    throw new Error("El nombre excede los 100 caracteres.");
  }
  if (data.descripcion && data.descripcion.length > 500) {
    throw new Error("La descripción excede los 500 caracteres.");
  }

  // crea el objeto tarea
  const nuevaTarea: Tarea = {
    id: data.id, // uuid pasado por gestorTarea
    nombre: data.nombre,
    descripcion: data.descripcion || 'sin descripcion',
    estado: traducirEstado(data.estado),
    dificultad: traducirDificultad(data.dificultad),
    fechaVencimiento: data.fechaVencimiento || 'sin fecha',
    fechaCreacion: data.fechaActual, // fecha actual pasada por gestorTarea
    fechaModificacion: data.fechaActual, // misma que fechaCreacion al inicio
  };
  
  // devuelve la nueva tarea inmutable (no se puede cambiar) 
  return Object.freeze(nuevaTarea);
};