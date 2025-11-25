import promptSync from 'prompt-sync';
import { GestorTareas } from './gestorTarea';
import { Tarea } from './tarea';
import { mostrarDetalles } from './detallesTarea';

const prompt = promptSync();
const gestor = new GestorTareas(); // Instancia única del "Gerente" (POO)

// mostrar las tareas más simple
const mostrarLista = (tareas: Tarea[]) => {
  if (tareas.length === 0) {
    console.log("(No hay tareas para mostrar)");
    return;
  }
  
  console.log("------------------------------------------------");
  tareas.forEach((t, index) => { // recorre las tareas
    let fechaStr = "[Sin fecha]"; // defecto
    if (t.fechaVencimiento && t.fechaVencimiento !== 'sin fecha') { // si tiene fecha se cambia
      fechaStr = `[${t.fechaVencimiento}]`;
    }
    // Muestra: 1. [2025-11-15] Comprar pan (pendiente)
    console.log(`${index + 1}. ${fechaStr} ${t.nombre} (${t.estado})`);
  });
  console.log("------------------------------------------------");
};

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
            console.log("Deje vacío para mantener el valor actual.");
            const nombre = prompt("Nuevo Nombre: ") || undefined;
            const descripcion = prompt("Nueva Descripción: ") || undefined;
            const estado = prompt("Nuevo Estado [P/E/T/C]: ") || undefined;
            const dificultad = prompt("Nueva Dificultad [1/2/3]: ") || undefined;
            const fechaVenc = prompt("Nueva Fecha Venc. (AAAA-MM-DD): ") || undefined;

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
        if (filtro === '0') break;
        let listaActual: Tarea[] = [];
        if (filtro === 'V') listaActual = gestor.obtenerVencidas();
        else if (filtro === 'P') listaActual = gestor.obtenerPrioridadAlta();
        else if (filtro === 'E') {
             const letra = prompt("Ingrese la letra ([P]endiente, [E]n curso, [T]erminada, [C]ancelada): ").toUpperCase();
             listaActual = gestor.obtenerPorEstado(letra);
        } 
        else if (filtro === 'T') {
            listaActual = gestor.obtenerTodas();
        }

        // se muestra la lista de tareas
        mostrarLista(listaActual);

        // seleccionar tarea para ver detalles / editar
        const numSeleccion = parseInt(prompt("Número de tarea para editar / eliminar (0 volver): "));
        if (numSeleccion > 0 && numSeleccion <= listaActual.length) {
            // se le pone un numero a cada tarea
            const tareaSeleccionada = listaActual[numSeleccion - 1];
            gestionarAccionesDeTarea(tareaSeleccionada);
        }
        break;

      case 2: // buscar tarea
        const termino = prompt("Ingrese palabra clave: ");
        if (!termino) break; // si no se escribe nada, vuelve al menú

        // se hace la busqueda
        const resultados = gestor.buscar(termino);

        if (resultados.length > 0) {
            console.log(`\nSe encontraron ${resultados.length} coincidencias:`);
            // se muestra la lista
            mostrarLista(resultados);
            
            // ver detalles / editar tarea seleccionada
            const numSeleccion = parseInt(prompt("Número de tarea para ver detalles (0 para volver): "));
            
            if (numSeleccion > 0 && numSeleccion <= resultados.length) {
                // se le da un numero a cada tarea
                const tareaSeleccionada = resultados[numSeleccion - 1];
                gestionarAccionesDeTarea(tareaSeleccionada);
            }

        } else {
            console.log("No se encontraron coincidencias.");
        }
        break;

      case 3: // crear tarea
        console.log("\n--- NUEVA TAREA ---");
        // validaciones
        let nombre = "";
        while (!nombre || nombre.length > 100) {
            nombre = prompt("Nombre (Obligatorio, max 100): ");
        }
        const descripcion = prompt("Descripción (Opcional): ");
        const estado = prompt("Estado [P/E/T/C] (Default P): ");
        const dificultad = prompt("Dificultad [1/2/3] (Default 1): ");
        const fechaVencimiento = prompt("Fecha Vencimiento AAAA-MM-DD (Opcional): ");

        gestor.crearTarea({
            nombre, descripcion, estado, dificultad, fechaVencimiento
        });
        console.log("✅ Tarea creada exitosamente.");
        break;

      case 4: // estadisticas
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
        console.log('\n👋 Saliendo del programa...');
        continuar = false;
        break;

      default:
        console.log('\n⚠️ Opción inválida.');
    }
  }
}

// 🚀 Ejecución del programa
main();
