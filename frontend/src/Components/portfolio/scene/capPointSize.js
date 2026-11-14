/**
 * Square GL points grow without limit as the camera flies through the particle
 * field, and each GPU/driver clamps huge points differently — that is the big
 * blocky white blob seen on some phones/laptops. Cap the on-screen size so
 * every device renders the same soft speck.
 */
export const capPointSize = (shader) => {
  shader.vertexShader = shader.vertexShader.replace(
    '#include <fog_vertex>',
    '#include <fog_vertex>\n  gl_PointSize = min(gl_PointSize, 6.0);'
  );
};
