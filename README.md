Autor: César Augusto Aróstegui Alzamora

# Heurísticas Aplicadas - Landing Page: Corporación Santa Rosita

Este documento resume las heurísticas de diseño, estructura y usabilidad aplicadas en el desarrollo de la landing page e-commerce para la empresa **Corporación Santa Rosita E.I.R.L.**.

---

## 🧩 Heurísticas de Diseño (Nielsen)

### 1. Consistencia y estándares  
Se aplicaron estilos visuales coherentes en toda la interfaz: misma paleta de colores (azul corporativo), tipografía Poppins y estructura modular por secciones. El menú horizontal y su versión vertical en móvil siguen convenciones típicas de navegación web, lo cual reduce la curva de aprendizaje del usuario y respeta los estándares de usabilidad.

### 2. Visibilidad del estado del sistema  
El sistema proporciona retroalimentación inmediata. Por ejemplo, al enviar un formulario exitosamente aparece el mensaje “Mensaje enviado correctamente”, y al modificar el carrito de compras, el total se actualiza dinámicamente. Estas señales visuales mantienen al usuario informado de sus acciones en tiempo real.

### 3. Prevención de errores  
Se incluyen validaciones en el formulario de contacto para evitar envíos con campos vacíos, mostrando mensajes de advertencia en rojo junto a los inputs. Asimismo, se bloquea el botón de "Comprar productos" si el carrito está vacío, lo que evita operaciones sin sentido o con datos incompletos.

### 4. Reconocimiento antes que memorización  
Se emplean etiquetas explícitas, íconos reconocibles (carrito, redes sociales) y agrupaciones visuales claras que permiten a los usuarios comprender la funcionalidad sin tener que memorizar flujos. Esto se complementa con una navegación clara y un diseño familiar.

### 5. Diseño estético y minimalista  
Cada sección se mantiene limpia y enfocada en su propósito. Se evitó el uso de decoraciones innecesarias y se priorizó la legibilidad y la jerarquía visual. En móvil, la interfaz se adapta para mantener la limpieza visual mediante diseño responsive, reduciendo elementos a lo esencial.

---

## 🏗️ Heurísticas de Estructura (Arquitectura de Información)

### 6. Organización clara por secciones  
La landing page está estructurada en bloques lógicos: Home, Repuestos, Blog, Contacto, Productos, Carrito y Pago. Cada bloque tiene un `id` definido para facilitar la navegación directa desde el menú. Esto permite una experiencia intuitiva y reduce la carga cognitiva del usuario.

### 7. Navegación jerárquica intuitiva  
El menú superior ofrece acceso rápido a las secciones principales, y en la sección de productos se permite filtrar por categorías clave (marca, modelo, año, precio), organizadas en una columna lateral. La jerarquía visual de títulos, botones y tarjetas permite escanear rápidamente la información.

### 8. Agrupación lógica y modularidad  
Los productos están agrupados por tarjetas visuales que siguen una estructura común. Los filtros están colocados a la izquierda, separados del contenido principal, lo que sigue un patrón visual bien establecido en e-commerce. Esto mejora el enfoque y la exploración dirigida.

---

## 👥 Heurísticas de Usabilidad (Interacción y Experiencia)

### 9. Control y libertad del usuario  
El usuario puede modificar su carrito producto por producto, eliminarlos uno por uno o vaciarlo por completo. También puede usar los filtros para refinar la vista o restablecerlos para ver todo el catálogo. Este nivel de control mejora la percepción de eficiencia y flexibilidad.

### 10. Flexibilidad y eficiencia de uso  
La interfaz permite una experiencia eficiente para usuarios con experiencia mediante la combinación de múltiples filtros simultáneamente. Para nuevos usuarios, los botones y controles están claramente identificados, y las acciones no requieren más de dos clics para completarse.

### 11. Accesibilidad en dispositivos móviles  
Se implementaron media queries para adaptar la interfaz a pantallas pequeñas. El menú se convierte en hamburguesa, las secciones se reorganizan verticalmente, y el espaciado se ajusta para mantener la legibilidad y la interacción táctil adecuada.
