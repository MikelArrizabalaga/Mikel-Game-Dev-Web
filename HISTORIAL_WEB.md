# Historial de la web de Mikel Arrizabalaga

Actualizado el 26 de noviembre de 2026.

La web presenta los servicios freelance de Mikel Arrizabalaga a estudios de videojuegos y empresas. El objetivo es que una visita pueda entender qué hace Mikel, ver un ejemplo de encargo y preparar un correo de contacto.

- [Web pública en GitHub Pages](https://mikelarrizabalaga.github.io/Mikel-Game-Dev-Web/)
- [Repositorio en GitHub](https://github.com/MikelArrizabalaga/Mikel-Game-Dev-Web)

## Del plan interno a la web comercial

1. **Preparación del proyecto.** Se inicializó Git y se eligió una web estática con HTML, CSS y JavaScript. Se instalaron las skills `playwright` y `playwright-interactive` para la revisión en navegador.
2. **Primer prototipo.** A partir de `Plan_emprendimiento_2027.md` se creó un panel local con escenarios de facturación, información de Curly Studios, vías de financiación y una hoja de ruta.
3. **Cambio de enfoque.** Mikel pidió una web para ofrecer servicios a empresas. Se sustituyó el panel por una página comercial y se retiraron del sitio y su código las cifras, la financiación, la hoja de ruta y los detalles internos de Curly Studios. Se adoptó **Mikel Arrizabalaga** como nombre profesional.
4. **Primera portada comercial.** Se probó un diseño oscuro con acentos violetas.
5. **Búsqueda de referencias.** Se revisaron portfolios de freelancers, webs que usan el 3D para navegar y sitios comerciales que convierten una interacción en una muestra de sus servicios.
6. **Demo de bajo coste.** Se preparó una vista previa interactiva con un puente levadizo que se podía abrir, girar y ver en modo técnico. Sirvió para probar la idea de mostrar una mecánica en la portada.
7. **Identidad tipográfica.** A partir de las imágenes que compartió Mikel, se cambió la dirección visual a fondo blanco, números binarios, texto oscuro y contornos naranja rojizo. Primero se mostró una maqueta y después se aplicó el diseño a toda la web.
8. **Revisión de la portada.** Se quitó el recuadro y el degradado que rodeaban al `01` grande. Se separaron las letras de «Technical Art» y se dejó transparente su interior y el del `0`, para que se viera el fondo a través del contorno.
9. **Animación del fondo.** Se probaron pulsos y desplazamientos en dígitos individuales. Tras la revisión de Mikel, se sustituyeron por un desplazamiento continuo de toda la capa binaria, fija a la ventana e independiente del scroll.
10. **Publicación y pulido.** Se conectó el proyecto a GitHub y se publicó la primera versión. Después se instaló y aplicó la skill `frontend-design` para simplificar la navegación y el catálogo de servicios, unificar el formulario con el borrador de correo y dar prioridad a «Cuéntame tu proyecto». Esta revisión también se publicó.

## Referencias de diseño

| Referencia | Qué se estudió |
| --- | --- |
| [Arnau Lafuente](https://arlaf.com/es/), [Aday Melián](https://adaymelian.es/desarrollador-unity-freelance-canarias/) y [Arthur Bais](https://arthurbais.com/) | Cómo presentar el perfil freelance, los servicios y los proyectos con un contacto visible. |
| [Bill Truong](https://www.billthedev.com/), [Baptiste Remy](https://www.gameartisan.dev/) y [Maciej Sojka](https://maciejsojka.dev/) | Cómo acompañar un servicio con una muestra y explicar la aportación propia en cada proyecto. |
| [DangryGames](https://www.dangrygames.uk/), [Gustav Morving](https://www.gustav-morving.dk/landing-pages/en/apps/technical-artist-for-game-studios), [Artem Shkabura](https://artemshkabura.com/) y [Exoa](https://exoa.dev/hire) | Cómo concretar los problemas que resuelve cada servicio, qué se entrega y cómo se integra el trabajo en un equipo. |
| [Mohammed Marzouq](https://alsharefee.github.io/portfolio/index.html) y [Bozhidar Petrov Valchev](https://bossyfi.dev/) | Dos formatos de portfolio. Uno con filtros por especialidad y otro breve, con enlaces directos a las muestras. |
| [Bruno Simon](https://bruno-simon.com/), [Henry Heffernan](https://henryheffernan.com/) y [Where Worlds Take Shape](https://paodao.fr/) | Portfolios donde la interacción y la exploración forman parte de la navegación. |
| [Molazone](https://www.mola-zone.com/), [Susurrus](https://susurrus.vercel.app/), [Aengel Lab](https://lab.aengel.io/) y [Lando Norris](https://landonorris.com/) | Usos del 3D como recurso narrativo, experimentación visual o elemento protagonista de la portada. |
| [LLAMA 3D Studio](https://llama3d.studio/), [Bcube](https://www.bcube.ae/), [Wyrelane Studio](https://studio.wyrelanesolutions.com/), [VirtualAxis](https://www.virtualaxis.dev/) y [TRIONN](https://trionn.com/) | Cómo usar demos e interacciones para mostrar lo que un cliente puede contratar. |

## Qué incluye la versión pública

- **Portada.** Presenta el trabajo freelance en videojuegos y Technical Art. «Cuéntame tu proyecto» lleva al contacto y «Ver servicios» abre el catálogo.
- **Catálogo.** Cinco pestañas para videojuegos y programación, Technical Art, shaders, VFX y software y herramientas. Cada una explica el servicio, da un ejemplo de encargo y describe una posible entrega. «Preparar este encargo» selecciona el servicio en el formulario.
- **Cómo trabajo.** Las tres etapas y sus explicaciones se muestran directamente para definir el alcance, probar avances y preparar la entrega.
- **Contacto.** El formulario prepara en el navegador un resumen con el servicio, la fase y la descripción. Se puede copiar o abrir como borrador dirigido a `arrizamikel@gmail.com`. El visitante decide cuándo enviarlo desde su aplicación de correo.
- **Fondo.** Repite `mikel arrizabalaga` en binario sobre blanco. El patrón se desplaza como una sola capa y permanece anclado a la ventana al navegar. El pie incluye «Pausar fondo», y se respeta la preferencia de reducir movimiento del dispositivo.

La secuencia que eligió Mikel para el fondo es:

```text
01101101 01101001 01101011 01100101 01101100 00100000 01100001 01110010 01110010 01101001 01111010 01100001 01100010 01100001 01101100 01100001 01100111 01100001
```

## Revisión del 26 de noviembre de 2026

- «Trabajos» aparece entre «Servicios» y «Cómo trabajo». La ficha del paquete de shaders explica cómo se generan y reutilizan formas procedurales, incluye una vista en WebGL con controles de lados y giro y enlaza al [paquete público en GitHub](https://github.com/MikelArrizabalaga/Shader-Graph-Master-Sample).
- La ficha de *The Next Stop* recoge la colaboración de Mikel en programación y arte técnico y enlaza a la página del juego de Paranoid Delusion. [Créditos del equipo](https://mikelarrizabalaga.github.io/The-Next-Stop/) y [página del juego en Steam](https://store.steampowered.com/app/3795470/The_Next_Stop/).
- El catálogo incorpora Unity, C#, Shader Graph, HLSL y URP en los servicios correspondientes. Se añadieron una URL canónica y metadatos para compartir la web con una imagen binaria de 1200 × 630 px.
- Los textos se descifran letra a letra al entrar en la zona visible y vuelven a `0` y `1` al salir. Los dígitos usan la tipografía del texto y ocupan el espacio que queda por descifrar en cada palabra. Los controles se resuelven primero, seguidos del texto y de los títulos. Con movimiento reducido el texto se muestra de inmediato.
- La descripción del encargo conserva los saltos de línea al codificar el enlace de correo. Chromium verificó el destinatario, asunto y cuerpo del enlace con texto de varias líneas, tildes, símbolos y un emoji. También verificó la copia al portapapeles y la selección manual tras una denegación, en escritorio y móvil emulado.
- Se revisaron 12 anchos de 320 a 1920 px, el orden de tabulación, el foco visible, la interacción de la demo y la disponibilidad de ambos enlaces y del correo directo sin JavaScript. La demo pesa unos 3 KB de JavaScript y la imagen social unos 166 KiB. Los proyectos enlazan a las muestras sin cargar vídeos externos en la página.

Al abrir el enlace desde Edge en este equipo no apareció un borrador en un cliente de correo. Queda pendiente comprobar la recepción del borrador con un cliente operativo y un móvil físico.

## Archivos y ejecución

La revisión de rendimiento prepara el descifrado al acercarse a cada texto y agrupa las mediciones de posición antes de mover los dígitos. El resumen del formulario usa texto normal durante la edición y la demo inicializa WebGL al aproximarse a la pantalla. En Chromium local, con una ventana de 390 × 844 px, la mediana de cinco cargas pasó de 4.505 a 927 elementos HTML. Al añadir 20 caracteres a una descripción de 1.000 caracteres, el tiempo de tareas del navegador pasó de 207 a 54 ms en esa prueba.

| Archivo | Función |
| --- | --- |
| `index.html` | Portada, servicios, trabajos, proceso de colaboración y contacto. |
| `styles.css` | Identidad visual, diseño adaptable, contornos y animación del fondo. |
| `binary-background.js` | Genera el patrón en binario y gestiona la pausa. |
| `binary-reveal.js` | Activa el descifrado de los textos al entrar en pantalla. |
| `app.js` | Pestañas, navegación por anclas, resumen del encargo y borrador de correo. |
| `shader-preview.js` | Vista en WebGL del polígono procedural. |
| `assets/favicon.png` | Icono de la pestaña con el `01`. |
| `assets/social-preview.png` | Imagen para compartir el enlace, de 1200 × 630 px. |
| `dev-server.mjs` | Servidor local para revisar la web con Node.js. |
| `.nojekyll` | Hace que GitHub Pages sirva directamente los archivos estáticos. |
| `LICENSE` | Licencia MIT que ya existía en el repositorio. |

Para revisar la web en el equipo, se puede abrir `index.html` directamente o ejecutar:

```bash
node dev-server.mjs
```

El servidor local escucha en [127.0.0.1:4173](http://127.0.0.1:4173). La web no requiere instalación de paquetes ni un paso de compilación.

## Publicación

Se conectó el repositorio local con el remoto `origin`, se conservó el commit de la licencia y se configuró GitHub Pages para publicar por HTTPS desde la raíz de `main`. Los cambios que llegan a esa rama se despliegan automáticamente.

| Commit | Qué contiene |
| --- | --- |
| [`9c75660`](https://github.com/MikelArrizabalaga/Mikel-Game-Dev-Web/commit/9c75660651c0279f801197be0262b9daf30c323c) | Commit inicial del repositorio remoto con la licencia MIT. |
| [`41eae4b`](https://github.com/MikelArrizabalaga/Mikel-Game-Dev-Web/commit/41eae4bc8b1e91f095e99287a0d5c29d8da7e8a2) | Primera versión publicada de la web. |
| [`e06600d`](https://github.com/MikelArrizabalaga/Mikel-Game-Dev-Web/commit/e06600d19fb9f9e1763a3fbc5342d11b443e5bab) | Revisión de la presentación, el catálogo y el contacto, con el control para pausar el fondo. |
| [`cee8235`](https://github.com/MikelArrizabalaga/Mikel-Game-Dev-Web/commit/cee8235c8ac66045f57c02f8eb532bb177a0d9b5) | Portfolio, demo de shaders, tarjeta social y descifrado letra a letra. Se contrastaron los recursos públicos con los del commit tras el despliegue. |

## Revisiones y pruebas

- Se comprobó el diseño en **12 anchos**, de 320 a 1920 píxeles, y se revisaron capturas de móvil y escritorio.
- Se probaron la navegación con teclado, las pestañas de servicios y las etapas desplegables de colaboración.
- Se verificaron la selección de servicio desde el catálogo, el resumen, la copia al portapapeles y el enlace al borrador. También se probó la alternativa para seleccionar el texto cuando el navegador bloquea la copia.
- Se comprobó que el fondo mantiene su posición al hacer scroll, que se puede pausar y reanudar, y que la animación se desactiva con la preferencia de movimiento reducido.
- Se verificó que, sin JavaScript, siguen disponibles la descripción de los cinco servicios y el correo directo.
- El último despliegue se comprobó en la URL pública en móvil y escritorio. Se verificaron el selector de servicios, la pausa del fondo y el borrador de correo.
