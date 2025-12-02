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

    return tareas.filter(tarea => {
        if (!tarea.fechaVencimiento || tarea.fechaVencimiento === 'sin fecha') return false;
        // si la tarea está terminada o cancelada, no cuenta
        if (tarea.estado === 'terminada' || tarea.estado === 'cancelada') return false;
        // compara fechas para ver si está vencida
        const fechaVenc = new Date(tarea.fechaVencimiento + "T00:00:00");
        return fechaVenc < hoy;
    });
};

// alta prioridad (vencen en 7 días)
export const filtrarAltaPrioridad = (tareas: Tarea[]): Tarea[] => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + 7); // Próximos 7 días

    return tareas.filter(tarea => {
        // si no tiene fecha, descartada
        if (!tarea.fechaVencimiento || tarea.fechaVencimiento === 'sin fecha') return false;
        // si está terminada o cancelada, descartada 
        if (tarea.estado === 'terminada' || tarea.estado === 'cancelada') return false;

        const fechaVenc = parseFechaLocal(tarea.fechaVencimiento);
        return fechaVenc >= hoy && fechaVenc <= limite;
    });

    
};

// estado 
export const filtrarPorEstado = (tareas: Tarea[], estadoBuscado: EstadoTarea): Tarea[] => {
    return tareas.filter(t => t.estado === estadoBuscado);
};