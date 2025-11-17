import { Tarea, EstadoTarea, DificultadTarea } from './tarea';

const mapEstados: Record<EstadoTarea, string> = {
  'pendiente': 'Pendiente',
  'vencida': 'Vencida',
  'terminada': 'Terminada',
  'cancelada': 'Cancelada',
  'en curso': 'En curso'
};

const mapDificultad: Record<DificultadTarea, string> = {
  'fácil': '⭐',
  'media': '⭐⭐',
  'difícil': '⭐⭐⭐'
};

export const mostrarDetalles = (tarea: Tarea): string => {
  
  if (!tarea) { // si no existe tarea
    return "❌ Tarea no encontrada.";
  }

  // valores default
  const estadoLegible = mapEstados[tarea.estado] || mapEstados['pendiente'];
  const dificultadEstrellas = mapDificultad[tarea.dificultad] || mapDificultad['fácil'];

  const descripcion = tarea.descripcion || "Sin descripción";
  const vencimiento = tarea.fechaVencimiento || "Sin fecha";
  
  // para que las fechas 
  const fechaCreacionStr = tarea.fechaCreacion.toLocaleString('es-AR');
  const fechaModifStr = tarea.fechaModificacion.toLocaleString('es-AR');
  
  // devuelve los detalles completos
  return `
===== DETALLES DE LA TAREA =====
ID: ${tarea.id}
Nombre: ${tarea.nombre}
Descripción: ${descripcion}
Estado: ${estadoLegible}
Dificultad: ${dificultadEstrellas}
Fecha de vencimiento: ${vencimiento}
Fecha de creación: ${fechaCreacionStr}
Última modificación: ${fechaModifStr}
================================
`;
};