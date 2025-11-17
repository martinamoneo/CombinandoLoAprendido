import { Tarea } from './tarea';
import { DatosCrearTarea } from './crearTarea';
import { actualizarTarea } from './editarTarea';
import { eliminarTarea } from './eliminarTarea';
import { calcularEstadisticas, EstadisticasTareas } from './verEstadisticas';
import { mostrarDetalles } from './detallesTarea';
import { buscarTarea } from './buscarTarea';
import { TareasVencidas, AltaPrioridad } from './verTarea';
// import { guardar, cargar } from './Persistencia';
import { randomUUID } from 'crypto';

/**
 * Interface auxiliar simple para los datos que vienen del Menú (Index.ts)
 */
export interface DatosDelPrompt {
  nombre: string;
  descripcion?: string;
  estado: string;     // 'P', 'E', 'T', 'C', 'V', o ""
  dificultad: string; // '1', '2', '3', o ""
  fechaVencimiento?: string;
}

/**
 * GESTOR DE TAREAS (Paradigma POO)
 * Es el "Gerente" que gestiona el estado y conecta todos los paradigmas.
 */
export class GestorTareas {
  
  // 1. GESTIÓN DE ESTADO (POO):
  // La lista de tareas es privada. Nadie de afuera puede tocarla.
  private tasks: Tarea[] = [];

  constructor() {
    // Carga el estado desde el disco al iniciar
    this.tasks = cargar(); // PROBLEMA PERSISTENCIA
    console.log("Sistema iniciado. Tareas cargadas.");
  }

  // 2. MÉTODO PRIVADO (POO / IMPURO):
  // Es el único que sabe cómo llamar al archivista.
  private guardar(): void {
    guardar(this.tasks); // PROBLEMA PERSISTENCIA
    console.log("Tareas guardadas en persistencia.");
  }

  // --- MÉTODOS PÚBLICOS (La "Puerta de Entrada" para Index.ts) ---

  /**
   * CREAR TAREA
   * (Impuro -> Llama a Funcional)
   */
  public crearTarea(dataFromPrompt: DatosDelPrompt): Tarea {
    
    // 1. El Gerente (Impuro) genera las impurezas
    const id = randomUUID();
    const fechaActual = new Date();

    // 2. Prepara la "Orden de Trabajo" para la fábrica pura
    const datosCompletos: DatosCrearTarea = {
      ...dataFromPrompt,
      id: id,
      fechaActual: fechaActual,
    };

    // 3. DELEGA la creación a la fábrica Pura (Funcional)
    const nuevaTarea = crearNuevaTarea(datosCompletos);

    // 4. GESTIONA el estado (POO) y Delega el guardado
    this.tasks.push(nuevaTarea);
    this.guardar();
    
    return nuevaTarea;
  }

  /**
   * EDITAR TAREA
   * (Impuro -> Llama a Funcional)
   */
  public editarTarea(id: string, cambios: DatosEditarTarea): Tarea | undefined {
    const tareaOriginal = this.tasks.find(t => t.id === id);
    if (!tareaOriginal) {
      console.log("Error: Tarea no encontrada para editar.");
      return undefined;
    }

    // 1. El Gerente (Impuro) genera la fecha
    const fechaDeEdicion = new Date();

    // 2. DELEGA la actualización a la fábrica Pura (Funcional)
    // Inyecta la impureza (la fecha)
    const tareaNueva = actualizarTarea(
      tareaOriginal,
      cambios,
      fechaDeEdicion 
    );

    // 3. GESTIONA el estado (POO) y Delega el guardado
    this.tasks = this.tasks.map(t => (t.id === id ? tareaNueva : t));
    this.guardar();
    
    return tareaNueva;
  }

  /**
   * ELIMINAR TAREA (Hard Delete)
   * (Impuro -> Llama a Funcional)
   */
  public eliminarTareaPorId(id: string): boolean {
    const tareasAntes = this.tasks.length;
    
    // 1. DELEGA el cálculo a la función Pura (Funcional)
    this.tasks = eliminarTarea(this.tasks, id);
    
    // 2. GESTIONA el estado (POO) y Delega el guardado
    const eliminada = this.tasks.length < tareasAntes;
    if (eliminada) {
      this.guardar();
    }
    return eliminada;
  }

  // --- MÉTODOS DE CONSULTA (POO -> Llama a Lógico/Funcional) ---

  /**
   * Devuelve todas las tareas (para "Todas")
   */
  public getAllTasks(): readonly Tarea[] {
    return this.tasks;
  }
  
  /**
   * VER TAREA (Paradigma Lógico)
   */
  public getTareasVencidas(): Tarea[] {
    // Delega a la regla lógica "isOverdue"
    return this.tasks.filter(isOverdue);
  }

  public getTareasPrioridadAlta(): Tarea[] {
    // Delega a la regla lógica "isHighPriority"
    return this.tasks.filter(isHighPriority);
  }

  public getTareasPorVencer(): Tarea[] {
    // Delega a la regla lógica "isDueSoon"
    return this.tasks.filter(isDueSoon);
  }

  /**
   * BUSCAR TAREA (Paradigma Lógico/Funcional)
   */
  public buscarTareas(term: string): Tarea[] {
    // Delega a la función pura de búsqueda
    return buscarTareas(this.tasks, term);
  }

  /**
   * VER ESTADÍSTICAS (Paradigma Funcional)
   */
  public getEstadisticas(): EstadisticasTareas {
    // Delega a la función pura de cálculo
    return calcularEstadisticas(this.tasks);
  }
}

// muchos errores que se van a solucionar una vez terminados todos los archivos
// para eso debo revisar verTareas y buscarTareas -martina
// NO TOQUEN NADA 