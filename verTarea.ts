import { Tarea, EstadoTarea } from './tarea';

// comparar fecha
const parseFechaLocal = (fechaStr: string): Date => {
    return new Date(fechaStr + "T00:00:00");
};

// ordenar de más vieja a más nueva, sin modificar el vector original
export const ordenPorCreacion = (tareas: Tarea[]): Tarea[] => {
    return tareas.slice().sort((a, b) => 
        a.fechaCreacion.getTime() - b.fechaCreacion.getTime()
    );
};

// tareas vencidas
export const filtrarVencidas = (tareas: Tarea[]): Tarea[] => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const filtradas = tareas.filter(tarea => {
        if (!tarea.fechaVencimiento || tarea.fechaVencimiento === 'sin fecha') return false;
        // Si ya terminó o se canceló, no cuenta como vencida
        if (tarea.estado === 'terminada' || tarea.estado === 'cancelada') return false;

        const fechaVenc = parseFechaLocal(tarea.fechaVencimiento);
        return fechaVenc < hoy;
    });

    // se ordenan las tareas antes de devolverlas
    return ordenPorCreacion(filtradas);
};

// alta prioridad (vencen en 7 días)
export const filtrarAltaPrioridad = (tareas: Tarea[]): Tarea[] => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + 7); // Próximos 7 días

    const filtradas = tareas.filter(tarea => {
        if (!tarea.fechaVencimiento || tarea.fechaVencimiento === 'sin fecha') return false;
        if (tarea.estado === 'terminada' || tarea.estado === 'cancelada') return false;

        const fechaVenc = parseFechaLocal(tarea.fechaVencimiento);
        return fechaVenc >= hoy && fechaVenc <= limite;
    });

    // ordenar
    return ordenPorCreacion(filtradas);
};

// estado 
export const filtrarPorEstado = (tareas: Tarea[], estadoBuscado: EstadoTarea): Tarea[] => {
    const filtradas = tareas.filter(t => t.estado === estadoBuscado);
    
    // ordenar
    return ordenPorCreacion(filtradas);
};