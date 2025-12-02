import { Tarea } from './tarea';

// no modifica la lista de tareas original
// devuelve una nueva lista que contiene todas las tareas excepto la que se quiso eliminar

export const eliminarTarea = (
  listaTareas: Tarea[], 
  idAEliminar: string
): Tarea[] => {
  // va a devolver solo las tareas cuyo ID NO sea el que queremos eliminar
  return listaTareas.filter(tarea => tarea.id !== idAEliminar);
};