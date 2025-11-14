export type EstadoTarea = 'pendiente' | 'vencida' | 'terminada' | 'cancelada' | 'en curso';

export type DificultadTarea = 'facil' | 'media' | 'dificil'; 

export interface Tarea {
  readonly id: string; // readonly porque el UUID no debe cambiar nunca
  nombre: string; // La lógica en 'Crear Tarea' validará los 100 caracteres.
  descripcion?: string; 
  estado: EstadoTarea; //La lógica en 'Crear Tarea' pondrá 'pendiente' por defecto.
  dificultad: DificultadTarea; // La lógica en 'Crear Tarea'pondrá 'facil' por defecto.
  fechaVencimiento?: string; // Acepta un string "AAAA-MM-DD"
  readonly fechaCreacion: Date; 
  fechaModificacion: Date;
}