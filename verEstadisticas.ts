import { Tarea, EstadoTarea, DificultadTarea } from './tarea';

export interface ItemEstadistica {
  cantidad: number;
  porcentaje: number;
}
// estadisticas tiene estos campos con esos tipos
export interface EstadisticasTareas {
  totalTareas: number;
  porEstado: Record<EstadoTarea, ItemEstadistica>;
  porDificultad: Record<DificultadTarea, ItemEstadistica>;
}

// recibe la lista de tareas y promete devolver las estadísticas
export const calcularEstadisticas = (tasks: Tarea[]): EstadisticasTareas => { 
  
  // calcular tareas totales
  const totalTareas = tasks.length;

  // definimos el valor inicial
  const contadorInicial = {
    estados: {
      'pendiente': 0, 'vencida': 0, 'terminada': 0, 
      'cancelada': 0, 'en curso': 0
    },
    dificultades: {
      'fácil': 0, 'media': 0, 'difícil': 0
    }
  };

  // calcular cantidad de tareas por estado y dificultad
  const conteoFinal = tasks.reduce((acumulador, tareaActual) => {
    
    // se suma 1 a la cuenta de los estados
    acumulador.estados[tareaActual.estado]++;
    
    // se suma 1 a la cuenta de las dificultades
    acumulador.dificultades[tareaActual.dificultad]++;
    
    // pasa la cuenta actualizada a la siguiente tarea
    return acumulador; 

  }, contadorInicial); 

  // calcular porcentajes
  const calcularPorcentajes = (
    conteos: Record<string, number> // ej -> facil : 2
  ): Record<string, ItemEstadistica> => { // ej -> facil : { cantidad: 2, porcentaje: 40 }
    
    return Object.fromEntries( // Convierte un array de [clave, valor] en un objeto
      Object.entries(conteos) // Convierte el objeto { 'facil': 1 } en un array [ ['facil', 1] ]
        .map(([key, count]) => [ // convierte cada [ 'facil', 1 ] en [ 'facil', { cantidad: 1, porcentaje: 20 } ]
          key,
          {
            cantidad: count,
            porcentaje: totalTareas > 0 ? (count / totalTareas) * 100 : 0
          }
        ])
    );
  };

  // se devuelven las estadisticas con numero y porcentaje
  return {
    totalTareas: totalTareas,
    porEstado: calcularPorcentajes(conteoFinal.estados) as Record<EstadoTarea, ItemEstadistica>,
    porDificultad: calcularPorcentajes(conteoFinal.dificultades) as Record<DificultadTarea, ItemEstadistica>
  };
};