import { Tarea } from './tarea';

export const buscarTarea = (tareas: Tarea[], terminoBusqueda: string): Tarea[] => {
    // pasamos todo a minuscula y borramos espacios
    const terminoLower = terminoBusqueda.toLowerCase().trim();

    // si no hay nada, no se devuelve nada
    if (terminoLower.length === 0) {
        return [];
    }

    // .filter crea un vector con las tareas que cumplen la condición
    return tareas.filter(tarea => {
        const tituloLower = tarea.nombre.toLowerCase();
        const descripcionLower = tarea.descripcion ? tarea.descripcion.toLowerCase() : '';

        // buscamos la palabra en el título y la descripción
        const coincideEnTitulo = tituloLower.includes(terminoLower);
        const coincideEnDescripcion = descripcionLower.includes(terminoLower);

        // se devuelven las tareas que coinciden en título o descripción
        return coincideEnTitulo || coincideEnDescripcion;
    });
};