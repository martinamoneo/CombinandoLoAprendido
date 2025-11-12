// Importar funciones (a implementar en otro módulo)
import { } from '';

function mostrarMenu(): void {
  console.log('\n===== MENÚ DE GESTIÓN DE TAREAS =====');
  console.log('1. Ver tareas');
  console.log('2. Buscar tarea');
  console.log('3. Crear tarea');
  console.log('4. Eliminar tarea');
  console.log('5. Ver estadísticas');
  console.log('0. Salir');
}

function main(): void {
  mostrarMenu();

  // Simulación de elección del usuario (se puede reemplazar luego por entrada real)
  const opcion = 1; // Ejemplo: el usuario elige "1"

  console.log(`\n➡️  Opción seleccionada: ${opcion}`);

  switch (opcion) {
    case 1:
      verTarea();
      break;
    case 2:
      buscarTarea();
      break;
    case 3:
      crearTarea();
      break;
    case 4:
      eliminarTarea();
      break;
    case 5:
      verEstadisticas();
      break;
    case 0:
      console.log('\n👋 Saliendo del programa...');
      break;
    default:
      console.log('\n⚠️ Opción inválida.');
  }
}

// 🚀 Ejecución del programa
main();
