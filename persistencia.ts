import { writeFileSync, readFileSync } from 'fs'; // 
import { Tarea } from './tarea';
const ARCHIVO_DB = './tareas.json'; // arcihvo que sera la BD

export const guardar = (tareas: Tarea[]): void => { // escribe la lista de tareas en el archivo Json
  try {
    // 1. Convierte el array de objetos Tarea a un string JSON "bonito"
    const data = JSON.stringify(tareas, null, 2);
    
    // 2. Da la instrucción (Imperativo) de escribir en el disco
    writeFileSync(ARCHIVO_DB, data, { encoding: 'utf-8' });
    
  } catch (error) {
    console.error("Error al guardar las tareas:", error);
  }
};

export const cargar = (): Tarea[] => { // Lee el archivo JSON y lo convierte de nuevo en un array de Tareas.
  try {
    // 1. Da la instrucción (Imperativo) de leer el disco
    const data = readFileSync(ARCHIVO_DB, { encoding: 'utf-8' });
    
    // 2. Convierte el string JSON en un array de objetos
    const tareasGuardadas = JSON.parse(data);

    // 3. ¡IMPORTANTE! Re-hidratar las fechas.
    // JSON no guarda objetos 'Date', guarda strings.
    // Debemos convertir esos strings de vuelta a 'Date'.
    return tareasGuardadas.map((tarea: any) => ({
      ...tarea,
      fechaCreacion: new Date(tarea.fechaCreacion),
      fechaModificacion: new Date(tarea.fechaModificacion),
    }));

  } catch (error) {
    // Si el archivo no existe (primera vez que corre) o está vacío,
    // devuelve una lista vacía.
    return [];
  }
};