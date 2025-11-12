// src/models/Tarea.ts

import { v4 as uuidv4 } from 'uuid'; 

/** Enumeración para el estado de una tarea. */
export enum Estado {
    PENDIENTE = 'P',
    EN_PROGRESO = 'E',
    COMPLETADA = 'T',
    CANCELADA = 'C',
    VENCIDA = 'V',
}

/** Enumeración para la dificultad de una tarea. */
export enum Dificultad {
    FACIL = 'facil',
    MEDIANA = 'media',
    DIFICIL = 'dificil',
}

/** Interfaz ITarea: Define el contrato de la entidad. */
export interface ITarea {
    id: string; 
    titulo: string; 
    descripcion?: string; 
    estado: Estado; 
    dificultad: Dificultad; 
    fechaVencimiento?: Date; 
    fechaCreacion: Date; 
    ultimaModificacion: Date; 
}

/** Clase Tarea (POO): Define el molde y el comportamiento de inicialización. */
export class Tarea implements ITarea {
    readonly id: string;
    readonly fechaCreacion: Date;
    
    titulo: string;
    descripcion?: string;
    estado: Estado;
    dificultad: Dificultad;
    fechaVencimiento?: Date;
    ultimaModificacion: Date;

    constructor(
        titulo: string,
        descripcion?: string,
        dificultad: Dificultad = Dificultad.FACIL,
        fechaVencimiento?: Date
    ) {
        this.id = uuidv4(); 
        this.fechaCreacion = new Date();
        this.ultimaModificacion = this.fechaCreacion;

        this.titulo = titulo.substring(0, 100);
        this.estado = Estado.PENDIENTE;
        this.dificultad = dificultad;

        if (descripcion) {
            this.descripcion = descripcion.substring(0, 500);
        }
        if (fechaVencimiento) {
            this.fechaVencimiento = fechaVencimiento;
        }
    }
}