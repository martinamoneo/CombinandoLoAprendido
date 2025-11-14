import { Tarea, EstadoTarea, DificultadTarea } from './tarea';

export interface ItemEstadistica {
  cantidad: number;
  porcentaje: number;
}

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
      'facil': 0, 'media': 0, 'dificil': 0
    }
  };

  // se recorren las tareas y se cuentan NUMEROS
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
    conteos: Record<string, number>
  ): Record<string, ItemEstadistica> => {
    
    return Object.fromEntries( // Convierte un array de [clave, valor] en un objeto
      Object.entries(conteos) // Convierte el objeto { 'facil': 1 } en un array [ ['facil', 1] ]
        .map(([key, count]) => [ // .map() es funcional (sin bucles)
          key, // 'pendiente', 'facil', etc.
          {
            cantidad: count,
            porcentaje: totalTareas > 0 ? (count / totalTareas) * 100 : 0
          }
        ])
    );
  };

  // 5. Devolvemos el objeto final
  return {
    totalTareas: totalTareas,
    porEstado: calcularPorcentajes(conteoFinal.estados) as Record<EstadoTarea, ItemEstadistica>,
    porDificultad: calcularPorcentajes(conteoFinal.dificultades) as Record<DificultadTarea, ItemEstadistica>
  };
};