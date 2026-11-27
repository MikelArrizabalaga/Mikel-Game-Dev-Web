# Web de desarrollo freelance

Web estática en español para presentar servicios freelance de programación de videojuegos, Technical Art, shaders, VFX y herramientas a medida, con una selección de proyectos.

[Ver la web en GitHub Pages](https://mikelarrizabalaga.github.io/Mikel-Game-Dev-Web/)

Abre `index.html` directamente o ejecuta `node dev-server.mjs` desde la carpeta del proyecto y visita [la vista local](http://127.0.0.1:4173). El servidor escucha únicamente en este equipo.

`index.html` reúne la portada, los servicios y el contacto. `proyectos.html` contiene el catálogo. `styles.css` define el diseño adaptable. `binary-background.js` dibuja el fondo y `binary-reveal.js` anima los títulos principales una sola vez. `app.js` controla la navegación, los servicios y el formulario. `shader-preview.js` dibuja la muestra interactiva del polígono con WebGL.

El formulario de encargos guarda cada envío de prueba como un JSON en la carpeta temporal que imprime `node dev-server.mjs`. La vista local no envía correos.

En GitHub Pages, el formulario usa [FormSubmit](https://formsubmit.co/documentation) para enviar los encargos a `arrizamikel@gmail.com`. FormSubmit exige activar la dirección con un enlace que envía al buzón al recibir el primer encargo. El endpoint público se configura en `data-endpoint` de `#project-form` en `index.html` y la página conserva el correo directo como alternativa.

La [imagen para compartir](assets/social-preview.png) mide 1200 × 630 píxeles y usa la URL pública en los metadatos de la página. El [historial](HISTORIAL_WEB.md) y los [pendientes](PENDIENTES_WEB.md) documentan la evolución y el estado de publicación.
