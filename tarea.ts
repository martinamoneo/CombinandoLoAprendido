export type EstadoTarea = 'pendiente' | 'vencida' | 'terminada' | 'cancelada' | 'en curso';

export type DificultadTarea = 'fácil' | 'media' | 'difícil'; 

export interface Tarea {
  readonly id: string; // readonly porque el UUID no debe cambiar nunca
  nombre: string; // se valida en crearTarea
  descripcion?: string; 
  estado: EstadoTarea; // pendiente por defecto en crearTarea
  dificultad: DificultadTarea; // facil por defecto en crearTarea
  fechaVencimiento?: string; // aaaa-mm-dd
  readonly fechaCreacion: Date; 
  fechaModificacion: Date;
}