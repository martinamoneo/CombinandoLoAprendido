import { Tarea } from './tarea';
import { traducirEstado, traducirDificultad } from './traduccionTarea';

export interface DatosEditarTarea {
  nombre?: string;
  descripcion?: string;
  estado?: string;
  dificultad?: string;
  fechaVencimiento?: string;
}

export const actualizarTarea = (
  tareaOriginal: Tarea,
  nuevosDatos: DatosEditarTarea,
  fechaDeEdicion: Date // Impureza inyectada (desde el Gestor POO)
): Tarea => {
  // se crea una copia de la tarea original
  const tareaActualizada: Tarea = { ...tareaOriginal };
  
  // nombre
  if (nuevosDatos.nombre !== undefined) {
    const nombreTrim = nuevosDatos.nombre.trim();
    if (nombreTrim.length > 0 && nombreTrim.length <= 100) {
      tareaActualizada.nombre = nombreTrim;
    } else {
      throw new Error('El nombre es obligatorio y no debe exceder los 100 carácteres.');
    }
  }

  // descripción
  if (nuevosDatos.descripcion !== undefined) {
    const descTrim = nuevosDatos.descripcion.trim();
    // si no pone nada se guarda el default
    tareaActualizada.descripcion = descTrim.substring(0, 500) || 'sin descripcion';
  }
  
  // estado
  if (nuevosDatos.estado !== undefined) {
    // se traduce p a pendiente, etc
    tareaActualizada.estado = traducirEstado(nuevosDatos.estado);
  }
  
  // dificultad
  if (nuevosDatos.dificultad !== undefined) {
    // se traduce 1 a fácil, etc
    tareaActualizada.dificultad = traducirDificultad(nuevosDatos.dificultad);
  }

  // fecha de vencimiento
  if (nuevosDatos.fechaVencimiento !== undefined) {
    // si no pone nada se guarda el default
    tareaActualizada.fechaVencimiento = nuevosDatos.fechaVencimiento || 'sin fecha';
  }

  // fecha de modificacion - viene de gestorTarea
  tareaActualizada.fechaModificacion = fechaDeEdicion;

  // se devuelve la tarea actualizada 
  return Object.freeze(tareaActualizada);
};
