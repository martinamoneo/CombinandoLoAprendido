import { Tarea, EstadoTarea } from './tarea';

// --- 1. Ordenamiento (Lógico / Funcional Puro) ---

/**
 * 🧩 Función Pura: Ordena las tareas por fecha de creación de forma ascendente.
 * (La tarea más vieja aparece primero - Requisito: Ordenar tareas por fecha de creación)
 * @param tareas Lista de tareas.
 * @returns Nueva lista de tareas ordenada.
 */
export const ordenarPorCreacionAscendente = (tareas: Tarea[]): Tarea[] => {
    // Usamos .slice() para crear una copia del array antes de ordenar, 
    // garantizando la inmutabilidad (no se muta el array original).
    return tareas.slice().sort((a, b) => 
        a.fechaCreacion.getTime() - b.fechaCreacion.getTime()
    );
};


// --- 2. Filtros (Lógico / Funcional Puro) ---

/**
 * 🧩 Función Pura: Filtra y devuelve solo las tareas que están vencidas.
 * Considera vencida si tiene fecha de vencimiento y esta es anterior a hoy.
 * @param tareas Lista de tareas.
 * @returns Nueva lista con solo tareas vencidas.
 */
export const obtenerTareasVencidas = (tareas: Tarea[]): Tarea[] => {
    const hoy = new Date();

    return tareas.filter(tarea => {
        // 1. Debe tener una fecha de vencimiento.
        if (!tarea.fechaVencimiento) return false;

        // 2. Comparamos si la fecha de vencimiento (string AAAA-MM-DD) es anterior a hoy.
        // Convertimos el string a Date para una comparación precisa.
        const fechaVencimiento = new Date(tarea.fechaVencimiento);
        
        // 3. Solo si NO está terminada, la consideramos vencida.
        return fechaVencimiento < hoy && tarea.estado !== 'terminada';
    });
};


/**
 * 🧩 Función Pura: Filtra tareas de alta prioridad (próximas a vencer).
 * Considera alta prioridad si vence en los próximos 7 días y no está terminada.
 * @param tareas Lista de tareas.
 * @returns Nueva lista con tareas de alta prioridad.
 */
export const obtenerAltaPrioridad = (tareas: Tarea[]): Tarea[] => {
    const ahora = Date.now();
    // 7 días en milisegundos
    const limitePrioridad = ahora + (7 * 24 * 60 * 60 * 1000); 

    return tareas.filter(tarea => {
        // 1. Debe tener una fecha de vencimiento.
        if (!tarea.fechaVencimiento) return false;

        const fechaVencimientoMs = new Date(tarea.fechaVencimiento).getTime();
        
        // 2. La fecha de vencimiento debe estar entre "ahora" y "limitePrioridad" (7 días).
        // 3. No debe estar terminada.
        return (
            fechaVencimientoMs > ahora && 
            fechaVencimientoMs <= limitePrioridad &&
            tarea.estado !== 'terminada'
        );
    });
};