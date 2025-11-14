import { Tarea, EstadoTarea, DificultadTarea } from './tarea.ts';

// Interface auxiliar para definir los datos que recolectan Index y  GestorTareas
export interface DatosCrearTarea {
  nombre: string;
  descripcion?: string;
  estado?: EstadoTarea;
  dificultad?: DificultadTarea;
  fechaVencimiento?: string;
  // El Gestor (POO) debe generar estos y pasarlos a la función pura.
  id: string; // El UUID
  fechaActual: Date; // El new Date()
}

export const crearNuevaTarea = (data: DatosCrearTarea): Tarea => {
  
  // valida nombre y descripcion
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
    id: data.id, // Usa el UUID inyectado
    nombre: data.nombre,
    descripcion: data.descripcion || 'sin descripcion', // Usa undefined si es opcional
    estado: data.estado || 'pendiente',
    dificultad: data.dificultad || 'facil',
    fechaVencimiento: data.fechaVencimiento || 'sin fecha',
    fechaCreacion: data.fechaActual, // Usa la fecha inyectada
    fechaModificacion: data.fechaActual, // Al crear, es la misma
  };
  
  // devuelve la nueva tarea inmutable (no se puede cambiar) 
  return Object.freeze(nuevaTarea);
};