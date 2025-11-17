import { Tarea } from './tarea';

export const buscarTarea = (tareas: Tarea[], terminoBusqueda: string): Tarea[] => {
    // Convertimos el término de búsqueda a minúsculas y eliminamos espacios extra
    const terminoLower = terminoBusqueda.toLowerCase().trim();

    // Si el término está vacío, devolvemos un array vacío (o la lista completa, si se prefiere).
    if (terminoLower.length === 0) {
        return [];
    }

    // Usamos .filter() para crear el nuevo array inmutable.
    return tareas.filter(tarea => {
        const tituloLower = tarea.nombre.toLowerCase();
        const descripcionLower = tarea.descripcion ? tarea.descripcion.toLowerCase() : '';

        // Comprobamos si el título o la descripción incluyen el término.
        const coincideEnTitulo = tituloLower.includes(terminoLower);
        const coincideEnDescripcion = descripcionLower.includes(terminoLower);

        // Devolvemos true si coincide en al menos uno de los campos.
        return coincideEnTitulo || coincideEnDescripcion;
    });
};

// LÓGICO | lo voy a revisar cuando den la teoria del tema -martina