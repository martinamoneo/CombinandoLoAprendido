import promptSync from 'prompt-sync';
import { GestorTareas } from './gestorTarea';
import { Tarea } from './tarea';
import { mostrarDetalles } from './detallesTarea';

const prompt = promptSync();
const gestor = new GestorTareas(); // llama al gestor de tareas

// mostrar las tareas más simple
const mostrarLista = (tareas: Tarea[]) => {
  if (tareas.length === 0) {
    console.log("(No hay tareas para mostrar)");
    return;
  }
  
  console.log("------------------------------------------------");
  tareas.forEach((t, index) => { // recorre las tareas
    const fecha = new Date(t.fechaCreacion); // buscamos fecha de creación
    const fechaStr = `[${fecha.toLocaleDateString()}]`; // la ponemos en forma dd/mm/aaaa
    // muestra: 1. [26/11/2025] Nombre (Estado)
    console.log(`${index + 1}. ${fechaStr} ${t.nombre} (${t.estado})`);
  });
  console.log("------------------------------------------------");
};
// funciones auxiliares
function gestionarAccionesDeTarea(tareaSeleccionada: Tarea): void {
    
    // mostrar detalles
    console.log(mostrarDetalles(tareaSeleccionada));

    let enMenuAcciones = true;

    while (enMenuAcciones) {
        console.log("\n ¿Qué desea hacer con esta tarea?");
        console.log("[E] Editar | [D] Eliminar | [0] Volver");
        
        const accion = prompt("Elija una acción: ").toUpperCase();

        // volver
        if (accion === '0') {
            enMenuAcciones = false; // Rompe el bucle y la función termina (vuelve a la lista)
        }
        
        // editar
        else if (accion === 'E') {
            console.log("Instrucciones: Enter para mantener. Escriba 'b' para borrar el dato.");
            const nombre = prompt("Nuevo Nombre: ") || undefined;
            const descIngresada = prompt("Nueva Descripción: ");
            const descripcion = descIngresada.toLowerCase() === 'b' ? "" : (descIngresada || undefined);
            const estado = prompt("Nuevo Estado [P]endiente, [E]n curso, [T]erminada, [C]ancelada: ") || undefined;
            const dificultad = prompt("Nueva Dificultad [1: fácil /2: media /3: difícil]: ") || undefined;
            const fechaIngresada = prompt("Nueva Fecha Venc. (AAAA-MM-DD): ");
            const fechaVenc = fechaIngresada.toLowerCase() === 'b' ? "" : (fechaIngresada || undefined);

            gestor.editarTarea(tareaSeleccionada.id, {
                nombre, descripcion, estado, dificultad, fechaVencimiento: fechaVenc
            });
            console.log("Tarea actualizada.");
            enMenuAcciones = false; // volvemos a la lista tras editar
        }
        
        // eliminar
        else if (accion === 'D') {
            const confirmacion = prompt(`¿Seguro que desea eliminar "${tareaSeleccionada.nombre}"? [S/N]: `).toUpperCase();
            
            if (confirmacion === 'S') {
                gestor.eliminarTarea(tareaSeleccionada.id);
                console.log("Tarea eliminada.");
                enMenuAcciones = false; // Volvemos a la lista porque la tarea ya no existe
            } else {
                console.log("Operación cancelada.");
            }
        }
        else {
            console.log("❌ Opción inválida. Ingrese E, D o 0.");
        }
    }
}

function pedirFechaValida(mensaje: string, esEdicion: boolean = false): string | undefined {
    while (true) {
        const input = prompt(mensaje).trim();

        // caso 1: enter (dejar como está)
        if (input === "") {
            return undefined; // mantiene el valor
        }

        // caso 2: borrar fecha (solo en edición)
        if (esEdicion && (input.toUpperCase() === 'B')) {
            return ""; // borra la fecha
        }

        // caso 3: ingresa una fecha
        // valida que sea aaaa-mm-dd
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(input)) {
            console.log("Formato inválido. Use AAAA-MM-DD (ej: 2025-12-31).");
            continue; // repite la peticion hasta que se ingrese algo valido
        }

        // valida que la fecha no sea anterior a hoy
        const fechaIngresada = new Date(input + "T00:00:00");
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Reseteamos la hora de hoy a medianoche

        if (isNaN(fechaIngresada.getTime())) {
            console.log("Fecha inexistente.");
        } else if (fechaIngresada < hoy) {
            console.log("La fecha no puede ser anterior a hoy.");
        } else {
            // si todo funciona acepta la fecha
            return input;
        }
    }
}

function pedirOpcionValida(mensaje: string, opcionesValidas: string[]): string {
    while (true) {
        const input = prompt(mensaje).toUpperCase().trim();

        // si lo que ingreso esta en dentro de las opciones
        if (opcionesValidas.includes(input)) {
            return input; // si es valido, lo devuelve
        }

        // si no esta en las opciones, muestra error
        console.log(`Opción inválida. Solo se permite: [${opcionesValidas.filter(o => o !== '').join(', ')}] o Enter (si estás creando o editando).`);
    }
}

// menu
function mostrarMenu(): void {
  console.log('\n===== MENÚ DE GESTIÓN DE TAREAS =====');
  console.log('1. Ver / Editar Tarea');
  console.log('2. Buscar Tarea');
  console.log('3. Crear Tarea');
  console.log('4. Ver Estadísticas');
  console.log('0. Salir');
}

// opciones
function main(): void {
  let continuar = true;

  while (continuar) {
    console.clear();

    mostrarMenu();
    const opcion = parseInt(prompt('Seleccione una opción: '));

    switch (opcion) {
      
      case 1: // ver / editar tarea
        let filtro = "";
        let esValido = false;
        
        while (!esValido) {
            console.log("\n ¿Qué tareas desea ver?");
            console.log("[T] Todas");
            console.log("[V] Vencidas");
            console.log("[P] Prioridad Alta");
            console.log("[E] Por Estado");
            console.log("[0] Volver");
            
            filtro = prompt("Elija una opción: ").toUpperCase();

            const opcionesPermitidas = ['T', 'V', 'P', 'E', '0'];

            if (opcionesPermitidas.includes(filtro)) {
                esValido = true; // Rompe el bucle y avanza
            } else {
                console.log("Opción incorrecta. Intente de nuevo.");
                // El bucle vuelve a empezar automáticamente
            }
        }
        if (filtro === '0') break; // si pone 0, se vuelve

        let listaActual: Tarea[] = []; // busca la lista segun el filtro

        if (filtro === 'V') listaActual = gestor.obtenerVencidas();
        else if (filtro === 'P') listaActual = gestor.obtenerPrioridadAlta();
        else if (filtro === 'E') {
             const letra = pedirOpcionValida (
                "Ingrese la letra ([P]endiente, [E]n curso, [T]erminada, [C]ancelada): ", 
                    ['P', 'E', 'T', 'C']).toUpperCase();
             listaActual = gestor.obtenerPorEstado(letra);
        } 
        else if (filtro === 'T') {
            listaActual = gestor.obtenerTodas();
        }

        // se muestra la lista de tareas
        mostrarLista(listaActual);

        if (listaActual.length === 0) { // si no hay tares 
            prompt("\nPresione Enter para volver al menú principal..."); 
            break; 
        }

        // seleccionar tarea para ver detalles / editar
        const numSeleccion = parseInt(prompt("Número de tarea para ver detalles (0 volver): "));
        // caso 1: volver
        if (numSeleccion === 0) {
            break; 
        }
        // caso 2: número válido
        else if (numSeleccion > 0 && numSeleccion <= listaActual.length) {
            const tareaSeleccionada = listaActual[numSeleccion - 1];
            gestionarAccionesDeTarea(tareaSeleccionada);
        }
        // caso 3: número inválido
        else {
            console.log("Número inválido. Esa tarea no existe.");
        }
        prompt("\nPresione Enter para volver al menú...");
        break;

      case 2: // buscar tarea
      console.clear();
        const termino = prompt("Ingrese palabra clave (o Enter para volver): ");
        if (!termino) break; // si no se escribe nada, vuelve al menú

        // se hace la busqueda
        const resultados = gestor.buscar(termino);

        if (resultados.length > 0) {
            console.log(`\nSe encontraron ${resultados.length} coincidencias:`);
            // se muestra la lista
            mostrarLista(resultados);
            
            // ver detalles / editar tarea seleccionada
            const numSeleccion = parseInt(prompt("Número de tarea para ver acciones (0 para volver): "));
            
            if (numSeleccion > 0 && numSeleccion <= resultados.length) {
                // se le da un numero a cada tarea
                const tareaSeleccionada = resultados[numSeleccion - 1];
                gestionarAccionesDeTarea(tareaSeleccionada);
            }

        } else {
            console.log("No se encontraron coincidencias.");
        }
        prompt("\nPresione Enter para volver al menú...");
        break;

      case 3: // crear tarea
      console.clear();
        console.log("\n--- NUEVA TAREA ---");
        // validaciones
        let nombre = "";
        while (!nombre || nombre.length > 100) {
            nombre = prompt("Nombre (Obligatorio, max 100): ");
        }
        const descripcion = prompt("Descripción (Opcional): ");
        const estado = pedirOpcionValida (
            "Estado [P]endiente, [E]n curso, [T]erminada, [C]ancelada (Default P): ", 
                ['P', 'E', 'T', 'C', '']);
        const dificultad = pedirOpcionValida (
            "Dificultad [1: fácil /2: media /3: difícil] (Default 1): ", 
                ['1', '2', '3', '']);
        const fechaVencimiento = pedirFechaValida("Fecha Vencimiento AAAA-MM-DD (Opcional): ", false);

        gestor.crearTarea({
            nombre, 
            descripcion, 
            estado, 
            dificultad, 
            fechaVencimiento: fechaVencimiento || undefined
        });

        console.log("✅ Tarea creada exitosamente.");
        prompt("\nPresione Enter para volver al menú...");
        break;

      case 4: // estadisticas
      console.clear();
      const stats = gestor.obtenerEstadisticas();
        
        console.log("\n === ESTADÍSTICAS ===");
        console.log(`Total de Tareas: ${stats.totalTareas}`);
        
        console.log("\n--- Por Estado ---");
        // Iteramos el objeto de estadísticas (Estructurado)
        for (const [estado, data] of Object.entries(stats.porEstado)) {
            // Formateamos el porcentaje aquí (Vista)
            console.log(`- ${estado}: ${data.cantidad} (${data.porcentaje.toFixed(1)}%)`);
        }

        console.log("\n--- Por Dificultad ---");
        for (const [dif, data] of Object.entries(stats.porDificultad)) {
            console.log(`- ${dif}: ${data.cantidad} (${data.porcentaje.toFixed(1)}%)`);
        }
        // Pausa para leer
        prompt("\nPresione Enter para volver...");
        break;

      case 0:
        console.log('\n Saliendo del programa...');
        continuar = false;
        break;

      default:
        console.log('\n⚠️ Opción inválida.');
        prompt("Presione Enter...");
    }
  }
}

// 🚀 Ejecución del programa
main();
