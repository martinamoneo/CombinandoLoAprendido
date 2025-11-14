// src/editarTarea.ts

/**
 * Actualizar/editar una tarea (versión adaptada a tu proyecto).
 * - No modifica la tarea original (devuelve una copia).
 * - Valida mínimamente campos (longitudes y valores permitidos).
 * - Si un campo entrante es inválido, se IGNORA (no se aplica).
 * - Actualiza fechaModificacion a la fecha actual.
 */

import { Tarea, EstadoTarea, DificultadTarea } from './tarea';

/**
 * Tipo para los datos que se pueden editar.
 * No incluimos 'id' ni 'fechaCreacion' porque esos NO deben cambiar.
 */
export type DatosEditarTarea = Partial<Pick<
  Tarea,
  'nombre' | 'descripcion' | 'estado' | 'dificultad' | 'fechaVencimiento'
>>;

/**
 * Función que actualiza una tarea existente en forma inmutable.
 * - tareaOriginal: la tarea que queremos actualizar (no se muta).
 * - nuevosDatos: objeto con los campos que se desean modificar.
 * Devuelve: una nueva Tarea con los cambios aplicados (Object.freeze).
 */
export const actualizarTarea = (
  tareaOriginal: Tarea,
  nuevosDatos: DatosEditarTarea
): Tarea => {
  // 1) Copia superficial de la tarea original para no mutarla.
  const tareaActualizada: Tarea = { ...tareaOriginal };

  // 2) Validaciones / asignaciones por campo

  // --- Nombre: obligatorio si se provee; max 100 caracteres; ignoramos si inválido.
  if (typeof nuevosDatos.nombre === 'string') {
    const nombreTrim = nuevosDatos.nombre.trim();
    if (nombreTrim.length > 0 && nombreTrim.length <= 100) {
      tareaActualizada.nombre = nombreTrim;
    } else {
      // Si querés que un nombre inválido lance error, reemplazá este comentario por:
      // throw new Error('Nombre inválido: debe tener 1-100 caracteres.');
    }
  }

  // --- Descripción: opcional; si se provee, se recorta a 500 chars y se asigna.
  if (typeof nuevosDatos.descripcion === 'string') {
    const descTrim = nuevosDatos.descripcion.trim();
    // Permitimos descripción vacía (""), que quedará como "".
    tareaActualizada.descripcion = descTrim.substring(0, 500);
  }

  // --- Estado: solo se aplica si coincide con uno de los tipos permitidos.
  if (typeof nuevosDatos.estado === 'string') {
    const posibleEstado = nuevosDatos.estado as EstadoTarea;
    const estadosValidos: EstadoTarea[] = ['pendiente', 'vencida', 'terminada', 'cancelada', 'en curso'];
    if (estadosValidos.includes(posibleEstado)) {
      tareaActualizada.estado = posibleEstado;
    } else {
      // Ignoramos estado inválido. Si preferís lanzar error, podés hacerlo aquí.
    }
  }

  // --- Dificultad: solo si es uno de los valores permitidos.
  if (typeof nuevosDatos.dificultad === 'string') {
    const posibleDificultad = nuevosDatos.dificultad as DificultadTarea;
    const dificultadesValidas: DificultadTarea[] = ['facil', 'media', 'dificil'];
    if (dificultadesValidas.includes(posibleDificultad)) {
      tareaActualizada.dificultad = posibleDificultad;
    } else {
      // Ignoramos valor inválido.
    }
  }

  // --- Fecha de vencimiento: si se provee, aceptamos strings en formato 'AAAA-MM-DD'
  if (typeof nuevosDatos.fechaVencimiento === 'string') {
    const fecha = nuevosDatos.fechaVencimiento.trim();
    // Validación simple por regex (AAAA-MM-DD). No parseamos a Date aquí.
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoDateRegex.test(fecha)) {
      tareaActualizada.fechaVencimiento = fecha;
    } else {
      // Ignoramos formato inválido. Si querés validar más, parsear con Date o una librería.
    }
  }

  // 3) Actualizar la fecha de modificación siempre (puedes opcionalmente chequear si hubo cambios reales).
  tareaActualizada.fechaModificacion = new Date();

  // 4) Devolver la tarea resultante como inmutable para evitar mutaciones externas accidentales.
  return Object.freeze(tareaActualizada);
};
