import { Tarea } from './tarea';

// no modifica la lista de tareas original.
// devuelve una nueva lista que contiene todas las tareas excepto la que se quiso eliminar

export const eliminarTarea = (
  listaTareas: Tarea[], 
  idAEliminar: string
): Tarea[] => {
  // mantene (return true) solo las tareas cuyo ID no sea el que queremos eliminar
  return listaTareas.filter(tarea => tarea.id !== idAEliminar);
};