function enablePolygonPreview() {
  const canvas = document.querySelector('#polygon-preview');
  const preview = canvas.closest('.shader-preview');
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  const vertexSource = `
    attribute vec2 position;
    uniform float aspectRatio;
    varying vec2 point;

    void main() {
      point = position * vec2(aspectRatio, 1.0);
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
    precision mediump float;
    varying vec2 point;
    uniform float sides;
    uniform float rotation;

    void main() {
      const float pi = 3.14159265;
      float sector = 2.0 * pi / sides;
      float angle = atan(point.y, point.x) - rotation - pi / 2.0;
      float edgeAngle = mod(angle, sector) - sector / 2.0;
      float edgeDistance = length(point) * cos(edgeAngle) - 0.76 * cos(sector / 2.0);
      float fill = 1.0 - smoothstep(-0.01, 0.01, edgeDistance);
      float outline = smoothstep(-0.035, -0.015, edgeDistance);

      vec2 cell = abs(fract(point * 5.0 + 0.5) - 0.5);
      float grid = 1.0 - smoothstep(0.0, 0.045, min(cell.x, cell.y));
      vec3 paper = mix(vec3(1.0), vec3(0.92, 0.87, 0.84), grid);
      vec3 shape = mix(vec3(1.0, 0.79, 0.69), vec3(0.66, 0.20, 0.09), outline);
      gl_FragColor = vec4(mix(paper, shape, fill), 1.0);
    }
  `;

  const program = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
    const shader = gl.createShader(type);
    if (!shader) return;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return;
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const position = gl.getAttribLocation(program, 'position');
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const sides = document.querySelector('#polygon-sides');
  const rotation = document.querySelector('#polygon-rotation');
  const sidesValue = document.querySelector('#sides-value');
  const rotationValue = document.querySelector('#rotation-value');
  const sidesUniform = gl.getUniformLocation(program, 'sides');
  const rotationUniform = gl.getUniformLocation(program, 'rotation');
  gl.uniform1f(gl.getUniformLocation(program, 'aspectRatio'), canvas.width / canvas.height);

  function renderPolygon() {
    sidesValue.value = sides.value;
    rotationValue.value = rotation.value + '°';
    const unit = rotation.valueAsNumber === 1 ? ' grado' : ' grados';
    rotation.setAttribute('aria-valuetext', rotation.value + unit);
    gl.uniform1f(sidesUniform, sides.valueAsNumber);
    gl.uniform1f(rotationUniform, rotation.valueAsNumber * Math.PI / 180);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  sides.addEventListener('input', renderPolygon);
  rotation.addEventListener('input', renderPolygon);
  canvas.addEventListener('webglcontextlost', () => { preview.hidden = true; });
  renderPolygon();
  preview.hidden = false;
}

enablePolygonPreview();
