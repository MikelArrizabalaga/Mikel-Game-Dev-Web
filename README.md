# Web de desarrollo freelance

Web estática en español para presentar servicios freelance de programación de videojuegos, Technical Art, shaders, VFX y herramientas a medida, con una selección de proyectos.

[Ver la web en GitHub Pages](https://mikelarrizabalaga.github.io/Mikel-Game-Dev-Web/)

Abre `index.html` directamente o ejecuta `node dev-server.mjs` desde la carpeta del proyecto y visita [la vista local](http://127.0.0.1:4173). El servidor escucha únicamente en este equipo.

`index.html` reúne la portada, los servicios y el contacto. `proyectos.html` contiene el catálogo. `styles.css` define el diseño adaptable. `binary-background.js` dibuja el fondo y `binary-reveal.js` anima los títulos principales una sola vez. `app.js` controla la navegación, los servicios y el formulario. `shader-preview.js` dibuja la muestra interactiva del polígono con WebGL.

El formulario de encargos guarda cada envío de prueba como un JSON en la carpeta temporal que imprime `node dev-server.mjs`. La vista local no envía correos.

Para habilitar el envío en GitHub Pages, introduce un endpoint de formulario en el atributo `data-endpoint` de `#project-form` en `index.html`. Por ejemplo, un [formulario de Formspree](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/) configurado con el correo destinatario. El endpoint recibe un POST con los campos `email`, `message`, `service` y `phase`, de tipo `application/x-www-form-urlencoded`. Con el atributo vacío se muestra el acceso directo al correo.

La [imagen para compartir](assets/social-preview.png) mide 1200 × 630 píxeles y usa la URL pública en los metadatos de la página. El [historial](HISTORIAL_WEB.md) y los [pendientes](PENDIENTES_WEB.md) documentan la evolución y el estado de publicación.
