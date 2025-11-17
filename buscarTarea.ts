import { Tarea } from './tarea';

/**
 * 🧩 Función Pura: Busca tareas por coincidencia en el título o descripción.
 * * Paradigma: Lógico / Funcional Puro.
 * - Es pura porque solo lee la lista de entrada y devuelve un nuevo array.
 * - Es lógica porque aplica una condición de filtrado (AND/OR).
 * * @param tareas Lista completa de tareas a buscar.
 * @param terminoBusqueda El texto a buscar.
 * @returns Un nuevo array de tareas que contienen el término de búsqueda.
 */
export const buscarTareasRelacionadas = (tareas: Tarea[], terminoBusqueda: string): Tarea[] => {
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

        // Comprobamos si el título O la descripción incluyen el término.
        const coincideEnTitulo = tituloLower.includes(terminoLower);
        const coincideEnDescripcion = descripcionLower.includes(terminoLower);

        // Devolvemos true si coincide en al menos uno de los campos.
        return coincideEnTitulo || coincideEnDescripcion;
    });
};