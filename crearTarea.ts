// src/CrearTarea.ts

//    Importamos la clase Tarea solo para tipado.
import { Tarea } from './tarea';

// 2. Importamos la función de creación Pura desde DetallesTarea.ts
import { crearTareaPura, TareaFuncional } from './detallesTarea';

//    Tipamos la lista con la interfaz Tarea.

/**
 * Función (Impura/Estructurada) para solicitar y manejar la creación de una tarea.
 * @param listaTareas La lista de tareas (para tipado).
 */
const datosTarea = (listaTareas: TareaFuncional[]): TareaFuncional => {
    // *** Lógica Impura: Petición de datos al usuario (Simulación) ***

    // Datos simulados
    const titulo = "Nueva Tarea Creada"; 
    const descripcion = "Ejemplo de creación funcional";
    
    // *** Lógica Pura: Llamada a la función de creación ***
    const nuevaTarea = crearTareaPura(titulo, descripcion);

    // Nota: El llamado al Gestor (agregar a lista y guardar) se haría en index.ts

    return nuevaTarea;
};

// Si necesitas exportar la función para usarla en index.ts
export { datosTarea };