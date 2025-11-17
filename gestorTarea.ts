import { Tarea } from './tarea';
import { crearNuevaTarea, DatosCrearTarea } from './crearTarea';
import { actualizarTarea, DatosEditarTarea } from './editarTarea';
import { eliminarTarea } from './eliminarTarea';
// import { guardarTareas, cargarTareas } from './Persistencia'; // Módulo de Persistencia (DEBES CREARLO)

/**
 * GestorTareas (POO / Impuro)
 * Encapsula la lista de tareas y controla la lógica de negocio Impura (fechas y I/O).
 */
export class GestorTareas {
    // La lista de tareas es un estado privado, pilar del Encapsulamiento POO.
    private tareas: Tarea[] = [];

    constructor() {
        // Al instanciar el Gestor, se carga el estado desde el almacenamiento.
        this.cargarTareasIniciales();
    }

    // --- Métodos de Control de Estado (Impuros) ---

    /**
     * Carga las tareas desde el almacenamiento (Simulación de I/O, IMPURO).
     */
    private cargarTareasIniciales(): void {
        // TODO: Reemplazar con la llamada a Persistencia.cargarTareas()
        // this.tareas = cargarTareas(); 
        console.log("🛠️ Tareas cargadas/inicializadas (simulación).");

        // Simulación de inicialización de ejemplo si está vacío
        if (this.tareas.length === 0) {
            this.simularInicializacion();
        }
    }

    /**
     * Guarda la lista de tareas en el almacenamiento (I/O, IMPURO).
     */
    private guardar(): void {
        // TODO: Reemplazar con la llamada a Persistencia.guardarTareas(this.tareas)
        // guardarTareas(this.tareas);
        console.log("💾 Tareas guardadas (simulación de persistencia).");
    }

    /**
     * Simulación para tener datos al iniciar.
     */
    private simularInicializacion(): void {
        // Usamos la función pura de creación, inyectándole los datos impuros (UUID, fechas)
        const fechaHoy = new Date();
        
        // Tarea 1: La más vieja para el ordenamiento
        const tarea1: DatosCrearTarea = {
            id: 'a123-old', nombre: "Tarea 1 (Vieja)", descripcion: "Creada hace tiempo.",
            fechaActual: new Date(2025, 0, 1), estado: 'pendiente'
        };
        // Tarea 2: Para prioridad/vencimiento
        const fechaVence = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // Vence en 3 días
        const tarea2: DatosCrearTarea = {
            id: 'b456-prio', nombre: "Tarea 2 (Alta Prioridad)", descripcion: "Tarea crítica.",
            fechaActual: fechaHoy, dificultad: 'dificil', fechaVencimiento: fechaVence.toISOString().split('T')[0]
        };

        this.tareas.push(crearNuevaTarea(tarea1));
        this.tareas.push(crearNuevaTarea(tarea2));
        this.guardar();
    }

    // --- Métodos Públicos de Acceso y Mutación Controlada ---

    /**
     * Retorna una copia de la lista de tareas (Abstracción).
     * @returns Array de tareas.
     */
    public getTareas(): readonly Tarea[] {
        // Devolvemos una copia para evitar que el código externo mute el estado directamente.
        return [...this.tareas];
    }

    /**
     * Agrega una nueva tarea a la lista.
     * @param tareaData Datos necesarios para la creación (excepto el UUID y fechas).
     */
    public agregarTarea(data: Omit<DatosCrearTarea, 'id' | 'fechaActual'>): void {
        // Generación Impura de datos necesarios para la función pura
        const id = crypto.randomUUID(); // Generación Impura de UUID
        const fechaActual = new Date(); // Generación Impura de fecha

        const datosCompletos: DatosCrearTarea = {
            ...data,
            id,
            fechaActual,
        };
        
        // Llamada a la función Pura
        const nuevaTarea = crearNuevaTarea(datosCompletos); 
        
        this.tareas.push(nuevaTarea);
        this.guardar();
    }

    /**
     * Elimina una tarea por su ID.
     * @param id El ID de la tarea a eliminar.
     * @returns true si se eliminó, false si no se encontró.
     */
    public eliminarTareaPorId(id: string): boolean {
        const tareasAntes = this.tareas.length;
        
        // Llamada a la función Pura de eliminación (Hard Delete)
        this.tareas = eliminarTarea(this.tareas, id);
        
        const eliminada = this.tareas.length < tareasAntes;
        if (eliminada) {
            this.guardar();
        }
        return eliminada;
    }

    /**
     * Edita una tarea. Este es el punto clave de la impureza controlada.
     * @param id El ID de la tarea a editar.
     * @param cambios Los campos a modificar.
     * @returns La tarea actualizada o undefined si no se encontró.
     */
    public editarTarea(id: string, cambios: DatosEditarTarea): Tarea | undefined {
        const tareaIndex = this.tareas.findIndex(t => t.id === id);

        if (tareaIndex !== -1) {
            const tareaOriginal = this.tareas[tareaIndex];
            
            // Generación Impura de la fecha de modificación
            const fechaModificacionImpura = new Date(); 

            // Llamada a la función Pura de edición
            const tareaActualizada = actualizarTarea(
                tareaOriginal,
                cambios
                // Nota: La fecha de modificación ya se aplica DENTRO de actualizarTarea,
                // usando el new Date() que pusiste en editarTarea.ts, lo que la hace 
                // semi-pura, o pura si inyectamos la fecha aquí:

                // Si quieres 100% pureza de actualizarTarea, debes modificarla para que
                // reciba la fecha de modificación como tercer argumento, y luego se la inyectas aquí:
                // , fechaModificacionImpura 
            );

            this.tareas[tareaIndex] = tareaActualizada; // Mutación controlada
            this.guardar();
            return tareaActualizada;
        }
        return undefined;
    }
}