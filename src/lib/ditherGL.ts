"use client";

import { gsap } from "@/lib/gsapSetup";

/**
 * WebGL dither renderer — a faithful port of the original site's Three.js
 * canvas (one fixed full-viewport canvas at z-index -1; every photo is a
 * quad running the ordered-dither shader, perturbed by a mouse trail FBO).
 *
 * Shaders and every constant below are lifted verbatim from the original
 * bundle: Bayer 4x4 under the cursor trail switches to 8x8, the trail
 * intensity enlarges the luminance sampling pixel (uPixelSizeMultiplier)
 * and raises the dither bias, and a slow 3D Perlin drift keeps the pattern
 * breathing. Trail: velocity-driven line segments drawn into a ping-pong
 * render target that decays 5.7% per frame.
 */

/* ---------------------------------------------------------------- shaders */

const MEDIA_VERT = /* glsl */ `#version 300 es
precision highp float;
in vec2 position;
uniform vec4 uRect;       // x, y (CSS px, top-left), w, h
uniform vec2 uViewport;   // CSS px
out vec2 vUv;
void main() {
  vUv = vec2(position.x, 1.0 - position.y); // v=1 at quad top
  vec2 px = uRect.xy + position * uRect.zw;
  vec2 clip = vec2(px.x / uViewport.x * 2.0 - 1.0, 1.0 - px.y / uViewport.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
}
`;

// Original fragment shader (Uj), converted to GLSL ES 3.00.
// vUv here: v=1 at the TOP of the plane (matches three.js PlaneGeometry
// after its flipY texture upload — we flip the texture on upload too).
const MEDIA_FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec2 uTextureSize;
uniform vec2 uPlaneSize;

uniform vec2 uResolution;
uniform vec3 uColorDark;
uniform vec3 uColorLight;
uniform float uMatrixSize;
uniform float uBias;
uniform float uDitherAmount;
uniform float uScaleResolution;
uniform float uOpacity;
uniform float uZoom;
uniform float uPixelSize;
uniform float uPixelSizeMultiplier;
uniform float uTime;
uniform sampler2D uTrail;
uniform float uTrailIntensityMultiplier;
uniform float uBiasNoiseScale;
uniform float uBiasNoiseSpeed;
uniform float uBiasPulseSpeed;
uniform float uBiasNoiseWeight;
uniform float uBiasPulseWeight;
uniform float uBiasAnimationStrength;

in vec2 vUv;
out vec4 fragColor;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

const float bayerMatrix2x2[4] = float[4](
  0.0 / 4.0, 2.0 / 4.0,
  3.0 / 4.0, 1.0 / 4.0
);

const float bayerMatrix4x4[16] = float[16](
   0.0 / 16.0,  8.0 / 16.0,  2.0 / 16.0, 10.0 / 16.0,
  12.0 / 16.0,  4.0 / 16.0, 14.0 / 16.0,  6.0 / 16.0,
   3.0 / 16.0, 11.0 / 16.0,  1.0 / 16.0,  9.0 / 16.0,
  15.0 / 16.0,  7.0 / 16.0, 13.0 / 16.0,  5.0 / 16.0
);

const float bayerMatrix8x8[64] = float[64](
    0.0/ 64.0, 48.0/ 64.0, 12.0/ 64.0, 60.0/ 64.0,  3.0/ 64.0, 51.0/ 64.0, 15.0/ 64.0, 63.0/ 64.0,
  32.0/ 64.0, 16.0/ 64.0, 44.0/ 64.0, 28.0/ 64.0, 35.0/ 64.0, 19.0/ 64.0, 47.0/ 64.0, 31.0/ 64.0,
    8.0/ 64.0, 56.0/ 64.0,  4.0/ 64.0, 52.0/ 64.0, 11.0/ 64.0, 59.0/ 64.0,  7.0/ 64.0, 55.0/ 64.0,
  40.0/ 64.0, 24.0/ 64.0, 36.0/ 64.0, 20.0/ 64.0, 43.0/ 64.0, 27.0/ 64.0, 39.0/ 64.0, 23.0/ 64.0,
    2.0/ 64.0, 50.0/ 64.0, 14.0/ 64.0, 62.0/ 64.0,  1.0/ 64.0, 49.0/ 64.0, 13.0/ 64.0, 61.0/ 64.0,
  34.0/ 64.0, 18.0/ 64.0, 46.0/ 64.0, 30.0/ 64.0, 33.0/ 64.0, 17.0/ 64.0, 45.0/ 64.0, 29.0/ 64.0,
  10.0/ 64.0, 58.0/ 64.0,  6.0/ 64.0, 54.0/ 64.0,  9.0/ 64.0, 57.0/ 64.0,  5.0/ 64.0, 53.0/ 64.0,
  42.0/ 64.0, 26.0/ 64.0, 38.0/ 64.0, 22.0/ 64.0, 41.0/ 64.0, 25.0/ 64.0, 37.0/ 64.0, 21.0 / 64.0
);

vec3 orderedDither(vec2 uv, float lum, float trailIntensity, float animatedBias) {
  float threshold = 0.0;

  if (uMatrixSize == 2.0) {
    int x = int(mod(floor(uv.x * uResolution.x), 2.0));
    int y = int(mod(floor(uv.y * uResolution.y), 2.0));
    threshold = bayerMatrix2x2[y * 2 + x];
  } else if (trailIntensity < 0.5) {
    int x = int(mod(floor(uv.x * uResolution.x), 4.0));
    int y = int(mod(floor(uv.y * uResolution.y), 4.0));
    threshold = bayerMatrix4x4[y * 4 + x];
  } else {
    int x = int(mod(floor(uv.x * uResolution.x), 8.0));
    int y = int(mod(floor(uv.y * uResolution.y), 8.0));
    threshold = bayerMatrix8x8[y * 8 + x];
  }

  float value = threshold + animatedBias * (1.0 + 2.0 * trailIntensity);

  vec3 color = mix(uColorDark, uColorLight, step(value, lum));
  return color;
}

void main() {
  float textureAspect = uTextureSize.x / uTextureSize.y;
  float planeAspect   = uPlaneSize.x / uPlaneSize.y;

  vec2 scale;
  vec2 offset;

  if (textureAspect > planeAspect) {
      float s = planeAspect / textureAspect;
      scale  = vec2(s, 1.0);
      offset = vec2((1.0 - s) * 0.5, 0.0);
  } else {
      float s = textureAspect / planeAspect;
      scale  = vec2(1.0, s);
      offset = vec2(0.0, (1.0 - s) * 0.5);
  }

  // zoom with top-left origin
  vec2 zoomedUv = vUv / uZoom;
  zoomedUv.y = 1.0 - (1.0 - vUv.y) / uZoom;

  vec2 coverUv = zoomedUv * scale + offset;
  vec2 safeUv = clamp(coverUv, 0.0, 1.0);

  vec2 screenUv = gl_FragCoord.xy / uResolution.xy;
  float trailIntensity = texture(uTrail, screenUv).r;

  vec2 normalizedPixelSize = uPixelSize / uResolution;
  vec2 uvPixel = normalizedPixelSize * floor(safeUv / normalizedPixelSize);

  vec4 color = texture(tMap, uvPixel);

  float dynamicPixelSize = mix(uPixelSize, uPixelSize * uPixelSizeMultiplier, trailIntensity);
  vec2 normalizedDynamicPixelSize = dynamicPixelSize / uResolution;
  vec2 uvPixelDynamic = normalizedDynamicPixelSize * floor(safeUv / normalizedDynamicPixelSize);

  vec4 colorForLum = texture(tMap, uvPixelDynamic);
  float lum = dot(vec3(0.2126, 0.7152, 0.0722), colorForLum.rgb);

  float noiseValue = cnoise(vec3(safeUv * uBiasNoiseScale, uTime * uBiasNoiseSpeed));
  float timePulse = sin(uTime * uBiasPulseSpeed) * 0.5 + 0.5;
  float animatedBias = uBias + (noiseValue * uBiasNoiseWeight + timePulse * uBiasPulseWeight) * uBiasAnimationStrength;

  vec3 dither = orderedDither(gl_FragCoord.xy / (uResolution.xy * uScaleResolution), lum, trailIntensity * uTrailIntensityMultiplier, animatedBias);

  color.rgb = mix(color.rgb, dither.rgb, uDitherAmount);
  color.a = uOpacity;

  fragColor = color;
}
`;

const TRAIL_VERT = /* glsl */ `#version 300 es
precision highp float;
in vec3 position;
out vec2 vUv;
void main() {
  vUv = position.xy * .5 + .5;
  gl_Position = vec4(position, 1.0);
}
`;

// Original trail shader (Hj). DECAY_SUB kicks in only on the 8-bit
// fallback, where pure multiplicative decay would stall above zero.
const TRAIL_FRAG = (decaySub: string) => /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 uPointer;
uniform vec2 uLastPointer;
uniform float uAspect;
uniform float uVelocity;
uniform float uInitialRadius;
uniform float uInitialRadiusMultiplier;
uniform float uBorderSize;
uniform float uBorderSizeMultiplier;
uniform float uDecayRate;

in vec2 vUv;
out vec4 gColor;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
  uv -= disc_center;
  uv.x *= uAspect;
  float dist = sqrt(dot(uv, uv));
  return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}

float lineSegment(vec2 p, vec2 a, vec2 b, float radius, float border) {
  p.x *= uAspect;
  a.x *= uAspect;
  b.x *= uAspect;

  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  float dist = length(pa - ba * h);

  return smoothstep(radius + border, radius - border, dist);
}

void main() {
  vec4 color = texture(u_texture, vUv);

  float line = lineSegment(vUv, uLastPointer, uPointer, uInitialRadius + uVelocity * uInitialRadiusMultiplier, uBorderSize + uVelocity * uBorderSizeMultiplier);
  float currentCircle = circle(vUv, uPointer, uInitialRadius + uVelocity * uInitialRadiusMultiplier, uBorderSize + uVelocity * uBorderSizeMultiplier);

  color.rgb += max(line, currentCircle) * uVelocity;
  color.rgb = mix(color.rgb, vec3(0.0), uDecayRate);
  ${decaySub}
  color.rgb = clamp(color.rgb, vec3(0.0), vec3(1.0));
  color.a = 1.0;

  gColor = color;
}
`;

/* ------------------------------------------------------------- constants */

const rgb = (r: number, g: number, b: number) => [r / 255, g / 255, b / 255];

/** Global dither defaults ($s / Cr in the original bundle). */
const GLOBALS = {
  uMatrixSize: 8,
  uBias: 0.1,
  uScaleResolution: 1,
  uColorDark: rgb(200, 16, 24),
  uColorLight: rgb(211, 185, 183),
  uPixelSizeMultiplier: 7.7,
  uTrailIntensityMultiplier: 1.02,
  uBiasNoiseScale: 1.4,
  uBiasNoiseSpeed: 94,
  uBiasPulseSpeed: 3.1,
  uBiasNoiseWeight: 0.77,
  uBiasPulseWeight: 0.87,
  uBiasAnimationStrength: 0.29,
};

/** Trail FBO defaults (Gj in the original bundle). */
const TRAIL = {
  uInitialRadius: 0.066,
  uInitialRadiusMultiplier: 0.015,
  uBorderSize: 0.129,
  uBorderSizeMultiplier: 0.054,
  uDecayRate: 0.057,
  velocitySmoothing: 0.63,
  velocityAmplifier: 32,
};

/* ----------------------------------------------------------------- types */

export interface MediaParams {
  zoom?: number;
  opacity?: number;
}

export interface MediaHandle {
  readonly ready: Promise<void>;
  /** original `prepareOnEnter`: park dark/hidden until the reveal */
  prepareOnEnter(): void;
  /** original `onEnter`: 2s power4.out form-up (bias 1→0.1, pixel 20→1, fade in) */
  onEnter(): void;
  showOriginal(): void;
  showDither(): void;
  /** tweenable uniform refs (e.g. hero zoom 1.2 → 1) */
  readonly zoom: { value: number };
  destroy(): void;
}

interface Media {
  el: HTMLElement;
  tex: WebGLTexture;
  texSize: [number, number];
  texReady: boolean;
  uBias: { value: number };
  uDitherAmount: { value: number };
  uOpacity: { value: number };
  uZoom: { value: number };
  uPixelSize: { value: number };
}

/* --------------------------------------------------------------- manager */

class DitherManager {
  private canvas!: HTMLCanvasElement;
  private gl!: WebGL2RenderingContext;
  private media: Media[] = [];
  private mediaProg!: WebGLProgram;
  private trailProg!: WebGLProgram;
  private quadVao!: WebGLVertexArrayObject;
  private triVao!: WebGLVertexArrayObject;
  private mediaLoc: Record<string, WebGLUniformLocation | null> = {};
  private trailLoc: Record<string, WebGLUniformLocation | null> = {};
  private rt: { fb: WebGLFramebuffer; tex: WebGLTexture }[] = [];
  private rtIndex = 0;
  private trailW = 0;
  private trailH = 0;
  private pointer = { x: -1, y: -1 };
  private lastPointer = { x: -1, y: -1 };
  private velocity = 0;
  private skipNextDraw = true;
  private tick?: (time: number) => void;
  private cleanup: (() => void)[] = [];
  failed = false;

  constructor() {
    try {
      this.init();
    } catch {
      this.failed = true;
    }
  }

  private init() {
    const canvas = document.createElement("canvas");
    canvas.className = "dither-canvas";
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      zIndex: "-1",
      pointerEvents: "none",
    });
    const gl = canvas.getContext("webgl2", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("no webgl2");
    this.canvas = canvas;
    this.gl = gl;
    // Prepend so sibling decorations that also sit at z-index -1 (mercury
    // rails etc., later in DOM order) still paint above the canvas.
    document.body.insertBefore(canvas, document.body.firstChild);

    const halfFloat =
      !!gl.getExtension("EXT_color_buffer_float") ||
      !!gl.getExtension("EXT_color_buffer_half_float");

    this.mediaProg = this.program(MEDIA_VERT, MEDIA_FRAG);
    this.trailProg = this.program(
      TRAIL_VERT,
      TRAIL_FRAG(halfFloat ? "" : "color.rgb = max(color.rgb - 0.004, 0.0);"),
    );
    for (const name of [
      "uRect", "uViewport", "tMap", "uTextureSize", "uPlaneSize", "uResolution",
      "uColorDark", "uColorLight", "uMatrixSize", "uBias", "uDitherAmount",
      "uScaleResolution", "uOpacity", "uZoom", "uPixelSize", "uPixelSizeMultiplier",
      "uTime", "uTrail", "uTrailIntensityMultiplier", "uBiasNoiseScale",
      "uBiasNoiseSpeed", "uBiasPulseSpeed", "uBiasNoiseWeight", "uBiasPulseWeight",
      "uBiasAnimationStrength",
    ]) {
      this.mediaLoc[name] = gl.getUniformLocation(this.mediaProg, name);
    }
    for (const name of [
      "u_texture", "uPointer", "uLastPointer", "uAspect", "uVelocity",
      "uInitialRadius", "uInitialRadiusMultiplier", "uBorderSize",
      "uBorderSizeMultiplier", "uDecayRate",
    ]) {
      this.trailLoc[name] = gl.getUniformLocation(this.trailProg, name);
    }

    // unit quad (two triangles), positions in [0,1]
    this.quadVao = gl.createVertexArray()!;
    gl.bindVertexArray(this.quadVao);
    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(this.mediaProg, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // fullscreen triangle for the trail passes
    this.triVao = gl.createVertexArray()!;
    gl.bindVertexArray(this.triVao);
    const triBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
      gl.STATIC_DRAW,
    );
    const triPosLoc = gl.getAttribLocation(this.trailProg, "position");
    gl.enableVertexAttribArray(triPosLoc);
    gl.vertexAttribPointer(triPosLoc, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    this.resize(halfFloat);

    const onResize = () => this.resize(halfFloat);
    window.addEventListener("resize", onResize);
    this.cleanup.push(() => window.removeEventListener("resize", onResize));

    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      if (this.skipNextDraw) {
        this.lastPointer = { x, y };
        this.skipNextDraw = false;
      }
      this.pointer = { x, y };
    };
    const reset = () => {
      this.skipNextDraw = true;
      this.velocity = 0;
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    this.cleanup.push(() => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    });

    this.tick = (time: number) => this.render(time);
    gsap.ticker.add(this.tick);
    this.cleanup.push(() => gsap.ticker.remove(this.tick!));
  }

  private program(vertSrc: string, fragSrc: string) {
    const gl = this.gl;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(s) || "shader compile failed");
      }
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(p) || "program link failed");
    }
    return p;
  }

  private resize(halfFloat: boolean) {
    const gl = this.gl;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(window.innerWidth * dpr);
    this.canvas.height = Math.round(window.innerHeight * dpr);
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";

    // trail render targets at viewport CSS resolution (like the original)
    this.trailW = window.innerWidth;
    this.trailH = window.innerHeight;
    for (const rt of this.rt) {
      gl.deleteFramebuffer(rt.fb);
      gl.deleteTexture(rt.tex);
    }
    this.rt = [0, 1].map(() => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D, 0,
        halfFloat ? gl.RGBA16F : gl.RGBA8,
        this.trailW, this.trailH, 0,
        gl.RGBA,
        halfFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE,
        null,
      );
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { fb, tex };
    });
  }

  register(el: HTMLElement, src: string, params: MediaParams = {}): MediaHandle | null {
    if (this.failed) return null;
    const gl = this.gl;

    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([200, 16, 24, 255]));

    const media: Media = {
      el,
      tex,
      texSize: [1, 1],
      texReady: false,
      uBias: { value: GLOBALS.uBias },
      uDitherAmount: { value: 1 },
      uOpacity: { value: params.opacity ?? 1 },
      uZoom: { value: params.zoom ?? 1 },
      uPixelSize: { value: 1 },
    };
    this.media.push(media);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    const ready = img
      .decode()
      .then(() => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        media.texSize = [img.naturalWidth, img.naturalHeight];
        media.texReady = true;
      })
      .catch(() => {});

    const manager = this;
    return {
      ready,
      prepareOnEnter() {
        gsap.set(media.uBias, { value: 1 });
        if (params.opacity === undefined || params.opacity !== 0) {
          gsap.set(media.uOpacity, { value: 0 });
        }
      },
      onEnter() {
        gsap.fromTo(media.uBias, { value: 1 },
          { value: GLOBALS.uBias, duration: 2, ease: "power4.out" });
        gsap.fromTo(media.uPixelSize, { value: 20 },
          { value: 1, duration: 2, ease: "power4.out" });
        if (params.opacity === undefined || params.opacity !== 0) {
          gsap.fromTo(media.uOpacity, { value: 0 },
            { value: 1, duration: 2, ease: "power4.out" });
        }
      },
      showOriginal() {
        gsap.to(media.uDitherAmount, { value: 0, duration: 0.5 });
      },
      showDither() {
        gsap.to(media.uDitherAmount, { value: 1, duration: 0.5 });
      },
      zoom: media.uZoom,
      destroy() {
        const i = manager.media.indexOf(media);
        if (i !== -1) manager.media.splice(i, 1);
        gl.deleteTexture(tex);
      },
    };
  }

  private updateTrail() {
    const gl = this.gl;
    const dx = this.pointer.x - this.lastPointer.x;
    const dy = this.pointer.y - this.lastPointer.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.velocity += (dist - this.velocity) * TRAIL.velocitySmoothing;
    const v = Math.min(this.velocity * TRAIL.velocityAmplifier, 1);

    const read = this.rt[this.rtIndex];
    const write = this.rt[this.rtIndex === 0 ? 1 : 0];

    gl.bindFramebuffer(gl.FRAMEBUFFER, write.fb);
    gl.viewport(0, 0, this.trailW, this.trailH);
    gl.disable(gl.BLEND);
    gl.useProgram(this.trailProg);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, read.tex);
    gl.uniform1i(this.trailLoc.u_texture, 0);
    gl.uniform2f(this.trailLoc.uPointer, this.pointer.x, this.pointer.y);
    gl.uniform2f(this.trailLoc.uLastPointer, this.lastPointer.x, this.lastPointer.y);
    gl.uniform1f(this.trailLoc.uAspect, this.trailW / this.trailH);
    gl.uniform1f(this.trailLoc.uVelocity, v);
    gl.uniform1f(this.trailLoc.uInitialRadius, TRAIL.uInitialRadius);
    gl.uniform1f(this.trailLoc.uInitialRadiusMultiplier, TRAIL.uInitialRadiusMultiplier);
    gl.uniform1f(this.trailLoc.uBorderSize, TRAIL.uBorderSize);
    gl.uniform1f(this.trailLoc.uBorderSizeMultiplier, TRAIL.uBorderSizeMultiplier);
    gl.uniform1f(this.trailLoc.uDecayRate, TRAIL.uDecayRate);
    gl.bindVertexArray(this.triVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.lastPointer = { ...this.pointer };
    this.rtIndex = this.rtIndex === 0 ? 1 : 0;
  }

  private render(time: number) {
    const gl = this.gl;
    this.updateTrail();

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!this.media.length) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.mediaProg);
    gl.bindVertexArray(this.quadVao);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const loc = this.mediaLoc;
    gl.uniform2f(loc.uViewport, vw, vh);
    gl.uniform2f(loc.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform3fv(loc.uColorDark, GLOBALS.uColorDark);
    gl.uniform3fv(loc.uColorLight, GLOBALS.uColorLight);
    gl.uniform1f(loc.uMatrixSize, GLOBALS.uMatrixSize);
    gl.uniform1f(loc.uScaleResolution, GLOBALS.uScaleResolution);
    gl.uniform1f(loc.uPixelSizeMultiplier, GLOBALS.uPixelSizeMultiplier);
    gl.uniform1f(loc.uTrailIntensityMultiplier, GLOBALS.uTrailIntensityMultiplier);
    gl.uniform1f(loc.uBiasNoiseScale, GLOBALS.uBiasNoiseScale);
    gl.uniform1f(loc.uBiasNoiseSpeed, GLOBALS.uBiasNoiseSpeed);
    gl.uniform1f(loc.uBiasPulseSpeed, GLOBALS.uBiasPulseSpeed);
    gl.uniform1f(loc.uBiasNoiseWeight, GLOBALS.uBiasNoiseWeight);
    gl.uniform1f(loc.uBiasPulseWeight, GLOBALS.uBiasPulseWeight);
    gl.uniform1f(loc.uBiasAnimationStrength, GLOBALS.uBiasAnimationStrength);
    // the original feeds gsap's ticker time (s) through a ×0.001 — keep it
    gl.uniform1f(loc.uTime, time * 0.001);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.rt[this.rtIndex].tex);
    gl.uniform1i(loc.uTrail, 1);

    for (const m of this.media) {
      const rect = m.el.getBoundingClientRect();
      if (
        rect.width === 0 ||
        rect.height === 0 ||
        rect.bottom < 0 ||
        rect.top > vh ||
        m.uOpacity.value <= 0.001
      ) {
        continue;
      }
      // CSS opacity/visibility on the placeholder's ancestors must affect
      // the GL quad too (News/Services crossfade stacked images that way).
      let cssOpacity = 1;
      let node: HTMLElement | null = m.el;
      for (let d = 0; node && d < 5 && cssOpacity > 0.001; d++) {
        const st = getComputedStyle(node);
        if (st.visibility === "hidden" || st.display === "none") {
          cssOpacity = 0;
        } else {
          const o = parseFloat(st.opacity);
          cssOpacity *= Number.isNaN(o) ? 1 : o;
        }
        node = node.parentElement;
      }
      if (cssOpacity <= 0.001) continue;
      gl.uniform4f(loc.uRect, rect.left, rect.top, rect.width, rect.height);
      gl.uniform2f(loc.uTextureSize, m.texSize[0], m.texSize[1]);
      gl.uniform2f(loc.uPlaneSize, rect.width, rect.height);
      gl.uniform1f(loc.uBias, m.uBias.value);
      gl.uniform1f(loc.uDitherAmount, m.uDitherAmount.value);
      gl.uniform1f(loc.uOpacity, m.uOpacity.value * cssOpacity);
      gl.uniform1f(loc.uZoom, m.uZoom.value);
      gl.uniform1f(loc.uPixelSize, m.uPixelSize.value);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, m.tex);
      gl.uniform1i(loc.tMap, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    gl.bindVertexArray(null);
  }

  destroy() {
    this.cleanup.forEach((fn) => fn());
    this.canvas?.remove();
  }
}

let manager: DitherManager | null = null;

/** Lazily creates the shared canvas; returns null when WebGL2 is missing. */
export function getDitherManager(): DitherManager | null {
  if (typeof window === "undefined") return null;
  if (!manager) manager = new DitherManager();
  return manager.failed ? null : manager;
}
