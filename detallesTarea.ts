// src/logic/DetallesTarea.ts

import { v4 as uuidv4 } from 'uuid'; 

// o '../Tarea' dependiendo de la estructura exacta. 
// Asumimos que Tarea.ts está al mismo nivel que DetallesTarea.ts:
import { 
    ITarea as TareaModelo, 
    Dificultad as DificultadModelo, 
    Estado as EstadoModelo 
} from './tarea'; 
// Si Tarea.ts está un nivel arriba (ej: DetallesTarea está en 'logic' y Tarea.ts está en 'src')
// usarías: '../Tarea'


/** * Tarea Funcional (Usamos esta estructura para trabajar de forma pura). */
export interface TareaFuncional {
    id: string;
    titulo: string;
    descripcion?: string;
    estado: EstadoModelo; 
    dificultad: DificultadModelo;
    fechaVencimiento?: string;
    fechaCreacion: string;
    ultimaModificacion: string;
}

// ... (El resto del código de DetalleTarea.ts sigue igual) ...

export const crearTareaPura = (
    titulo: string,
    descripcion: string = '',
    estado: EstadoModelo = EstadoModelo.PENDIENTE,
    dificultad: DificultadModelo = DificultadModelo.FACIL,
    fechaVencimiento?: string
): TareaFuncional => {
    // ...
    const fechaActual = new Date().toISOString();

    return {
        id: uuidv4(), 
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        estado,
        dificultad,
        fechaVencimiento,
        fechaCreacion: fechaActual,
        ultimaModificacion: fechaActual,
    };
};
// ... (El resto de funciones) ...