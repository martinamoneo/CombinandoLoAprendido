import { Tarea } from './tarea';

export const ordenPorCreacion = (tareas: Tarea[]): Tarea[] => {
    return tareas.slice().sort((a, b) => 
        a.fechaCreacion.getTime() - b.fechaCreacion.getTime()
    );
};

export const TareasVencidas = (tareas: Tarea[]): Tarea[] => {
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

export const AltaPrioridad = (tareas: Tarea[]): Tarea[] => {
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

// el orden debe ser para todas las opciones
// falta ver tareas por estado
// LÓGICO | lo voy a revisar cuando den la teoria del tema -martina