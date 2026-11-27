# Web de desarrollo freelance

Web estática en euskera, castellano e inglés para presentar servicios freelance de programación de videojuegos, Technical Art, shaders, VFX y herramientas a medida, con una selección de proyectos. `i18n.js` aplica el primer idioma compatible de las preferencias del navegador. El HTML está en castellano y se usa también cuando no hay coincidencia.

[Ver la web en GitHub Pages](https://mikelarrizabalaga.github.io/Mikel-Game-Dev-Web/)

Abre `index.html` directamente o ejecuta `node dev-server.mjs` desde la carpeta del proyecto y visita [la vista local](http://127.0.0.1:4173). El servidor escucha únicamente en este equipo.

`index.html` reúne la portada, los servicios y el contacto. `proyectos.html` contiene el catálogo. `styles.css` define el diseño adaptable. `binary-background.js` dibuja el fondo y `binary-reveal.js` descifra el texto en la zona central visible, muestra binario en los márgenes y anima el 01 de la portada. `app.js` controla la navegación y las pestañas de servicios. `shader-preview.js` dibuja la muestra interactiva del polígono con WebGL.

El contacto abre un borrador en la aplicación de correo del visitante mediante un enlace `mailto:`. El pie enlaza el [aviso legal](aviso-legal.html) y la [política de privacidad](privacidad.html).

La [imagen para compartir](assets/social-preview.png) mide 1200 × 630 píxeles y usa la URL pública en los metadatos de la página. El [historial](HISTORIAL_WEB.md) y los [pendientes](PENDIENTES_WEB.md) documentan la evolución y el estado de publicación.
