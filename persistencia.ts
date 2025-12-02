import { writeFileSync, readFileSync } from 'fs'; // 
import { Tarea } from './tarea';
const ARCHIVO_DB = './tareas.json'; // archivo que sera la BD

export const guardar = (tareas: Tarea[]): void => { // escribe la lista de tareas en el archivo Json
  try {
    // convierte la lista de tareas en un string JSON para que se pueda guardar 
    const data = JSON.stringify(tareas, null, 2);
    
    // lo escribe en el archivo
    writeFileSync(ARCHIVO_DB, data, { encoding: 'utf-8' });
    
  } catch (error) {
    console.error("Error al guardar las tareas:", error);
  }
};

export const cargar = (): Tarea[] => { // lee el archivo JSON y lo pasa a un vector de tareas
  try {
    // lee el disco 
    const data = readFileSync(ARCHIVO_DB, { encoding: 'utf-8' });
    
    // convierte lo que esta en el archivo a un array de tareas
    const tareasGuardadas = JSON.parse(data);

    // el archivo json guarda las fechas en string, por lo que hay que convertirlas de nuevo a Date
    return tareasGuardadas.map((tarea: any) => ({
      ...tarea,
      fechaCreacion: new Date(tarea.fechaCreacion),
      fechaModificacion: new Date(tarea.fechaModificacion),
    }));

  } catch (error) {
    // si no hay tareas o hay un error, no se devuelve nada
    return [];
  }
};