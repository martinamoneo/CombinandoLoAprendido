import { Tarea } from './tarea';

import { crearNuevaTarea, DatosCrearTarea } from './crearTarea';
import { actualizarTarea, DatosEditarTarea } from './editarTarea';
import { eliminarTarea } from './eliminarTarea';
import { buscarTarea } from './buscarTarea';
import { calcularEstadisticas, EstadisticasTareas } from './verEstadisticas';
import { 
    filtrarVencidas, 
    filtrarAltaPrioridad, 
    filtrarPorEstado, 
    ordenPorCreacion 
} from './verTarea';
import { traducirEstado } from './traduccionTarea'; 

import { guardar, cargar } from './persistencia';
import { randomUUID } from 'crypto';

export class GestorTareas {
    private tasks: Tarea[] = []; // lista de tareas privada

    constructor() {
        // se cargan las tareas al iniciar
        this.tasks = cargar();
        console.log("Sistema iniciado. Tareas cargadas.");
    }

    // --- Crear, Editar, Eliminar ---
    public crearTarea(datosUsuario: { 
        nombre: string, 
        descripcion?: string, 
        estado: string, 
        dificultad: string, 
        fechaVencimiento?: string 
    }): void {
        
        // genera los datos impuros
        const idUnico = randomUUID();
        const fechaDeHoy = new Date();

        // le pasa esos datos a la funcion pura
        const datosCompletos: DatosCrearTarea = {
            ...datosUsuario,
            id: idUnico,           // ponemos el id
            fechaActual: fechaDeHoy // ponemos la fecha de creación
        };

        // se crea la nueva tarea completa
        const nuevaTarea = crearNuevaTarea(datosCompletos);

        // se añade la tarea a la lista
        this.tasks.push(nuevaTarea);

        // se guarda la lista con la nueva tarea
        guardar(this.tasks);
    }

    public editarTarea(id: string, cambios: DatosEditarTarea): boolean {
        // se busca la tarea original
        const tareaOriginal = this.tasks.find(t => t.id === id);
        
        if (!tareaOriginal) return false; // No se encontró

        // se genera la fecha de edición
        const fechaEdicion = new Date();

        // se actualiza la tarea con los cambios hechos
        const tareaActualizada = actualizarTarea(
            tareaOriginal, 
            cambios, 
            fechaEdicion // Inyectamos la fecha
        );

        // se reemplaza la tarea en la lista
        this.tasks = this.tasks.map(t => t.id === id ? tareaActualizada : t);

        // se guarda la lista con la tarea actualizada
        guardar(this.tasks);
        return true;
    }

    public eliminarTarea(id: string): boolean {
        const cantidadAntes = this.tasks.length; // cantidad de tareas que hay antes de eliminar

        // eliminar la tarea que coincida con el id
        this.tasks = eliminarTarea(this.tasks, id);

        // confirmar si la tarea fue eliminada
        const seElimino = this.tasks.length < cantidadAntes;

        // se guardan los cambios
        if (seElimino) {
            guardar(this.tasks);
        }
        return seElimino;
    }

    // --- Ver, Buscar, Estadísticas ---

    public obtenerTodas(): Tarea[] { 
        // se devuelve la lista ordenada por creación
        return ordenPorCreacion(this.tasks);
    }

    public buscar(termino: string): Tarea[] {
        // llama a la funcion buscarTarea
        const resultados = buscarTarea(this.tasks, termino);
        // se ordena el resultado para mostrar
        return ordenPorCreacion(resultados);
    }

    public obtenerVencidas(): Tarea[] { 
        // llama a la funcion filtrarVencidas
        const resultados = filtrarVencidas(this.tasks);
        // se ordena
        return ordenPorCreacion(resultados);
    }

    public obtenerPrioridadAlta(): Tarea[] {
        // llama a la funcion filtrarAltaPrioridad
        const resultados = filtrarAltaPrioridad(this.tasks);
        // se ordena
        return ordenPorCreacion(resultados);
    }

    public obtenerPorEstado(estadoLetra: string): Tarea[] { 
        // se traduce la letra al estado completo
        const estadoReal = traducirEstado(estadoLetra);
    
        // llama a la funcion filtrarPorEstado
        const resultados = filtrarPorEstado(this.tasks, estadoReal);
        // se ordena
        return ordenPorCreacion(resultados);
    }

    public obtenerEstadisticas(): EstadisticasTareas { 
        // llama a la funcion calcularEstadisticas
        return calcularEstadisticas(this.tasks);
    }
}