import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface GameSceneOptions {
  container: HTMLDivElement;
  modelUrl?: string;
  reducedMotion: boolean;
  onReady: () => void;
  onFallback: () => void;
}

export interface GameSceneHandle {
  resize: () => void;
  setPointer: (x: number, y: number) => void;
  pulse: (x: number, y: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
}

interface SceneMaterials {
  cosmic: THREE.MeshPhysicalMaterial;
  suit: THREE.MeshStandardMaterial;
  shell: THREE.MeshPhysicalMaterial;
  metal: THREE.MeshStandardMaterial;
  cyan: THREE.MeshStandardMaterial;
  cyanGlow: THREE.MeshBasicMaterial;
  violetGlow: THREE.MeshBasicMaterial;
  glass: THREE.MeshPhysicalMaterial;
  visor: THREE.MeshPhysicalMaterial;
}

interface OperatorRig {
  group: THREE.Group;
  update: (delta: number) => void;
  dispose: () => void;
}

const UP = new THREE.Vector3(0, 1, 0);

function seededRandom(seed = 0x51a7c0de) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function addMesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material | THREE.Material[],
  position: THREE.Vector3,
  rotation = new THREE.Euler(),
  scale = new THREE.Vector3(1, 1, 1),
) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.rotation.copy(rotation);
  mesh.scale.copy(scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addCapsuleBetween(
  parent: THREE.Object3D,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
) {
  const direction = end.clone().sub(start);
  const distance = direction.length();
  const geometry = new THREE.CapsuleGeometry(radius, Math.max(0.02, distance - radius * 2), 6, 12);
  const mesh = addMesh(parent, geometry, material, start.clone().add(end).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(UP, direction.normalize());
  return mesh;
}

function makeCosmicMaterial(time: { value: number }) {
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xd5e2ed,
    metalness: 0.82,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    iridescence: 1,
    iridescenceIOR: 1.65,
    iridescenceThicknessRange: [160, 520],
    emissive: 0x03182c,
    emissiveIntensity: 0.7,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCosmicTime = time;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vCosmicPosition;`,
      )
      .replace(
        "#include <skinning_vertex>",
        `#include <skinning_vertex>
vCosmicPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uCosmicTime;
varying vec3 vCosmicPosition;
float cosmicHash(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
float cosmicWave = 0.5 + 0.5 * sin(vCosmicPosition.y * 7.0 + vCosmicPosition.x * 3.0 - uCosmicTime * 0.7);
float cosmicCloud = cosmicHash(floor(vCosmicPosition * 5.5 + vec3(uCosmicTime * 0.06)));
float cosmicSpark = step(0.965, cosmicHash(floor(vCosmicPosition * 22.0 - vec3(uCosmicTime * 0.08))));
vec3 cosmicNavy = vec3(0.015, 0.045, 0.12);
vec3 cosmicCyan = vec3(0.1, 0.82, 1.0);
diffuseColor.rgb = mix(diffuseColor.rgb, cosmicNavy, 0.34 + cosmicCloud * 0.22);
diffuseColor.rgb += cosmicCyan * cosmicWave * 0.16;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
totalEmissiveRadiance += vec3(0.08, 0.72, 1.0) * (cosmicWave * 0.13 + cosmicSpark * 1.8);`,
      );
  };
  material.customProgramCacheKey = () => "cosmic-armor-v1";
  return material;
}

function createMaterials(cosmicTime: { value: number }): SceneMaterials {
  return {
    cosmic: makeCosmicMaterial(cosmicTime),
    suit: new THREE.MeshStandardMaterial({ color: 0x070b13, metalness: 0.45, roughness: 0.62 }),
    shell: new THREE.MeshPhysicalMaterial({ color: 0x111923, metalness: 0.88, roughness: 0.24, clearcoat: 0.75, clearcoatRoughness: 0.18 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x202c36, metalness: 0.9, roughness: 0.3 }),
    cyan: new THREE.MeshStandardMaterial({ color: 0x4de8ff, emissive: 0x087f9a, emissiveIntensity: 2.1, metalness: 0.35, roughness: 0.25 }),
    cyanGlow: new THREE.MeshBasicMaterial({ color: 0x68efff, transparent: true, opacity: 0.88, toneMapped: false }),
    violetGlow: new THREE.MeshBasicMaterial({ color: 0x9b7cff, transparent: true, opacity: 0.72, toneMapped: false }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x18364b,
      transparent: true,
      opacity: 0.13,
      metalness: 0.1,
      roughness: 0.08,
      clearcoat: 1,
      side: THREE.BackSide,
      depthWrite: false,
    }),
    visor: new THREE.MeshPhysicalMaterial({
      color: 0x071923,
      emissive: 0x0aa9c4,
      emissiveIntensity: 1.45,
      metalness: 0.72,
      roughness: 0.08,
      clearcoat: 1,
      transparent: true,
      opacity: 0.94,
    }),
  };
}

function createStarField(mobile: boolean) {
  const random = seededRandom();
  const count = mobile ? 780 : 1450;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cold = new THREE.Color(0x83d9ff);
  const warm = new THREE.Color(0xffd7a3);
  const color = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const theta = random() * Math.PI * 2;
    const cosine = random() * 2 - 1;
    const sine = Math.sqrt(1 - cosine * cosine);
    const radius = 42 + random() * 34;
    const offset = index * 3;
    positions[offset] = Math.cos(theta) * sine * radius;
    positions[offset + 1] = cosine * radius + 5;
    positions[offset + 2] = Math.sin(theta) * sine * radius - 8;
    color.copy(cold).lerp(warm, random() * 0.38);
    const intensity = 0.55 + random() * 0.45;
    colors[offset] = color.r * intensity;
    colors[offset + 1] = color.g * intensity;
    colors[offset + 2] = color.b * intensity;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: mobile ? 0.12 : 0.15,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.88,
    vertexColors: true,
    depthWrite: false,
    fog: false,
  });
  const stars = new THREE.Points(geometry, material);
  stars.renderOrder = -5;
  return stars;
}

function createPlanet(scene: THREE.Scene) {
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(8.2, 64, 40),
    new THREE.MeshStandardMaterial({
      color: 0x14214b,
      emissive: 0x080b24,
      emissiveIntensity: 0.85,
      metalness: 0.08,
      roughness: 0.78,
    }),
  );
  planet.position.set(-18, 10, -35);
  planet.receiveShadow = true;
  scene.add(planet);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(8.72, 64, 40),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}`,
      fragmentShader: `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float rim = pow(clamp(1.0 - abs(dot(vNormal, vView)), 0.0, 1.0), 2.5);
  gl_FragColor = vec4(vec3(0.14, 0.62, 1.0) * rim, rim * 0.58);
}`,
    }),
  );
  atmosphere.position.copy(planet.position);
  scene.add(atmosphere);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(10.2, 13.8, 128),
    new THREE.MeshBasicMaterial({ color: 0x7896c7, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
  );
  ring.position.copy(planet.position);
  ring.rotation.set(1.18, 0.18, -0.24);
  scene.add(ring);
  return planet;
}

function createOffice(scene: THREE.Scene, materials: SceneMaterials) {
  const office = new THREE.Group();
  office.name = "Aerospace office";
  scene.add(office);

  addMesh(office, new THREE.CylinderGeometry(12.8, 12.8, 0.28, 72), materials.shell, new THREE.Vector3(1.2, -2.04, 0));
  addMesh(office, new THREE.CylinderGeometry(4.6, 5.1, 0.22, 64), materials.metal, new THREE.Vector3(2.5, -1.82, 0));

  const grid = new THREE.GridHelper(25, 30, 0x2dd9ef, 0x153444);
  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
  for (const material of gridMaterials) {
    material.transparent = true;
    material.opacity = 0.22;
  }
  grid.position.set(1.2, -1.87, 0);
  office.add(grid);

  for (const radius of [4.9, 8.1, 12.4]) {
    const ringMaterial = materials.cyanGlow.clone();
    ringMaterial.opacity = radius === 4.9 ? 0.58 : 0.24;
    addMesh(
      office,
      new THREE.TorusGeometry(radius, 0.035, 6, 128),
      ringMaterial,
      new THREE.Vector3(1.2, -1.84, 0),
      new THREE.Euler(Math.PI / 2, 0, 0),
    );
  }

  const panorama = addMesh(
    office,
    new THREE.CylinderGeometry(17, 17, 10, 72, 1, true, Math.PI * 0.14, Math.PI * 1.72),
    materials.glass,
    new THREE.Vector3(1.2, 3, 0),
  );
  panorama.castShadow = false;

  for (let index = -5; index <= 5; index += 1) {
    const angle = index * 0.205;
    const x = 1.2 + Math.sin(angle) * 16.72;
    const z = -Math.cos(angle) * 16.72;
    addMesh(office, new THREE.CylinderGeometry(0.055, 0.055, 10, 8), materials.metal, new THREE.Vector3(x, 3, z));
  }

  for (const y of [-1.65, 3, 7.65]) {
    addMesh(
      office,
      new THREE.TorusGeometry(16.75, 0.07, 7, 160),
      materials.metal,
      new THREE.Vector3(1.2, y, 0),
      new THREE.Euler(Math.PI / 2, 0, 0),
    );
  }

  const desk = new THREE.Group();
  desk.position.set(-2.7, -0.65, -0.15);
  desk.rotation.y = -0.18;
  office.add(desk);
  addMesh(desk, new THREE.BoxGeometry(3.8, 0.18, 1.25), materials.shell, new THREE.Vector3(0, 0, 0));
  addMesh(desk, new THREE.BoxGeometry(0.18, 1.25, 0.85), materials.metal, new THREE.Vector3(-1.5, -0.7, 0));
  addMesh(desk, new THREE.BoxGeometry(0.18, 1.25, 0.85), materials.metal, new THREE.Vector3(1.5, -0.7, 0));
  addMesh(desk, new THREE.BoxGeometry(3.35, 0.035, 0.08), materials.cyanGlow, new THREE.Vector3(0, 0.13, 0.58));

  const holograms = new THREE.Group();
  holograms.position.set(-2.7, 0.28, -0.35);
  holograms.rotation.y = -0.18;
  office.add(holograms);
  const panelMaterial = new THREE.MeshBasicMaterial({ color: 0x4ce6ff, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false });
  for (let index = 0; index < 3; index += 1) {
    const panel = addMesh(
      holograms,
      new THREE.PlaneGeometry(0.9, 0.58),
      panelMaterial,
      new THREE.Vector3((index - 1) * 1.03, index === 1 ? 0.18 : 0, 0),
      new THREE.Euler(-0.08, 0, 0),
    );
    panel.castShadow = false;
  }

  addMesh(
    office,
    new THREE.TorusGeometry(4.25, 0.09, 8, 96),
    materials.violetGlow,
    new THREE.Vector3(2.5, 6.4, -0.6),
    new THREE.Euler(Math.PI / 2, 0, 0),
  );
  return holograms;
}

function createChair(materials: SceneMaterials) {
  const chair = new THREE.Group();
  chair.name = "Aerospace executive chair";

  addMesh(chair, new THREE.CylinderGeometry(0.72, 0.95, 0.2, 48), materials.shell, new THREE.Vector3(0, -1.72, -0.05));
  addMesh(chair, new THREE.CylinderGeometry(0.26, 0.36, 1.05, 32), materials.metal, new THREE.Vector3(0, -1.18, -0.05));
  addMesh(
    chair,
    new THREE.TorusGeometry(0.98, 0.075, 8, 64),
    materials.cyan,
    new THREE.Vector3(0, -1.64, -0.05),
    new THREE.Euler(Math.PI / 2, 0, 0),
  );

  addMesh(chair, new THREE.BoxGeometry(2.05, 0.34, 1.8), materials.shell, new THREE.Vector3(0, -0.48, 0.12), new THREE.Euler(-0.05, 0, 0));
  addMesh(
    chair,
    new THREE.CapsuleGeometry(0.82, 1.75, 10, 20),
    materials.shell,
    new THREE.Vector3(0, 0.62, -0.62),
    new THREE.Euler(-0.22, 0, 0),
    new THREE.Vector3(1.02, 1, 0.29),
  );
  addMesh(
    chair,
    new THREE.CapsuleGeometry(0.52, 0.34, 8, 18),
    materials.metal,
    new THREE.Vector3(0, 1.82, -0.93),
    new THREE.Euler(-0.18, 0, 0),
    new THREE.Vector3(1.2, 1, 0.36),
  );

  for (const side of [-1, 1]) {
    addMesh(chair, new THREE.BoxGeometry(0.18, 0.22, 1.35), materials.metal, new THREE.Vector3(side * 1.04, 0.05, 0.18), new THREE.Euler(0, 0, side * -0.04));
    addMesh(chair, new THREE.BoxGeometry(0.08, 0.04, 1.1), materials.cyanGlow, new THREE.Vector3(side * 1.04, 0.18, 0.18));
    const rail = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.92, -1.58, -0.1),
      new THREE.Vector3(side * 1.22, -0.55, -0.22),
      new THREE.Vector3(side * 1.17, 0.65, -0.62),
      new THREE.Vector3(side * 0.68, 1.78, -0.95),
    ]);
    addMesh(chair, new THREE.TubeGeometry(rail, 48, 0.065, 8, false), materials.metal, new THREE.Vector3());
  }

  addMesh(chair, new THREE.BoxGeometry(1.25, 0.035, 0.07), materials.cyanGlow, new THREE.Vector3(0, 1.76, -0.74), new THREE.Euler(-0.2, 0, 0));
  return chair;
}

function createShoulderLauncher(materials: SceneMaterials) {
  const launcher = new THREE.Group();
  launcher.name = "Three-tube shoulder launcher";
  launcher.position.set(0.79, 1.54, -0.42);
  launcher.rotation.set(-0.08, -0.06, -0.12);
  addMesh(launcher, new THREE.BoxGeometry(0.5, 0.38, 0.9), materials.shell, new THREE.Vector3(0, 0, 0));
  addMesh(launcher, new THREE.BoxGeometry(0.62, 0.08, 0.72), materials.cosmic, new THREE.Vector3(0, 0.21, -0.02));
  for (const x of [-0.16, 0, 0.16]) {
    addMesh(
      launcher,
      new THREE.CylinderGeometry(0.065, 0.09, 0.78, 12),
      materials.metal,
      new THREE.Vector3(x, 0, 0.08),
      new THREE.Euler(Math.PI / 2, 0, 0),
    );
    addMesh(launcher, new THREE.TorusGeometry(0.075, 0.018, 6, 18), materials.cyanGlow, new THREE.Vector3(x, 0, 0.48));
  }
  return launcher;
}

function createProceduralOperator(materials: SceneMaterials) {
  const operator = new THREE.Group();
  operator.name = "Procedural armored operator";

  addMesh(operator, new THREE.SphereGeometry(0.48, 24, 16), materials.suit, new THREE.Vector3(0, -0.04, -0.02), new THREE.Euler(), new THREE.Vector3(1.08, 0.78, 0.9));
  addMesh(
    operator,
    new THREE.CapsuleGeometry(0.48, 0.82, 8, 18),
    materials.suit,
    new THREE.Vector3(0, 0.83, -0.3),
    new THREE.Euler(-0.28, 0, 0),
    new THREE.Vector3(1, 1, 0.78),
  );
  addMesh(operator, new THREE.BoxGeometry(1.12, 0.74, 0.38), materials.cosmic, new THREE.Vector3(0, 1.1, -0.19), new THREE.Euler(-0.28, 0, 0));

  for (let index = 0; index < 3; index += 1) {
    addMesh(
      operator,
      new THREE.BoxGeometry(0.78 - index * 0.08, 0.16, 0.3),
      materials.cosmic,
      new THREE.Vector3(0, 0.62 - index * 0.2, -0.02 + index * 0.03),
      new THREE.Euler(-0.2, 0, 0),
    );
  }

  const helmet = addMesh(
    operator,
    new THREE.SphereGeometry(0.44, 30, 22),
    materials.cosmic,
    new THREE.Vector3(0, 1.92, -0.51),
    new THREE.Euler(-0.12, 0, 0),
    new THREE.Vector3(0.9, 1.08, 1),
  );
  helmet.castShadow = true;
  addMesh(operator, new THREE.BoxGeometry(0.62, 0.22, 0.08), materials.visor, new THREE.Vector3(0, 1.98, -0.08), new THREE.Euler(-0.08, 0, 0));
  addMesh(operator, new THREE.BoxGeometry(0.52, 0.24, 0.16), materials.cosmic, new THREE.Vector3(0, 1.72, -0.12), new THREE.Euler(-0.16, 0, 0));
  addMesh(operator, new THREE.ConeGeometry(0.08, 0.58, 5), materials.cyan, new THREE.Vector3(0, 2.42, -0.61), new THREE.Euler(0.2, 0, 0));

  operator.add(createShoulderLauncher(materials));

  const shoulderLeft = new THREE.Vector3(-0.66, 1.25, -0.28);
  const shoulderRight = new THREE.Vector3(0.66, 1.25, -0.28);
  const elbowLeft = new THREE.Vector3(-0.92, 0.48, -0.02);
  const elbowRight = new THREE.Vector3(0.92, 0.48, -0.02);
  const handLeft = new THREE.Vector3(-0.91, 0.03, 0.48);
  const handRight = new THREE.Vector3(0.91, 0.03, 0.48);
  addCapsuleBetween(operator, shoulderLeft, elbowLeft, 0.21, materials.suit);
  addCapsuleBetween(operator, shoulderRight, elbowRight, 0.21, materials.suit);
  addCapsuleBetween(operator, elbowLeft, handLeft, 0.18, materials.suit);
  addCapsuleBetween(operator, elbowRight, handRight, 0.18, materials.suit);
  addMesh(operator, new THREE.SphereGeometry(0.31, 18, 12), materials.cosmic, shoulderLeft, new THREE.Euler(), new THREE.Vector3(1.2, 0.72, 1));
  addMesh(operator, new THREE.SphereGeometry(0.31, 18, 12), materials.cosmic, shoulderRight, new THREE.Euler(), new THREE.Vector3(1.2, 0.72, 1));
  addMesh(operator, new THREE.BoxGeometry(0.32, 0.5, 0.28), materials.cosmic, elbowLeft.clone().lerp(handLeft, 0.38));
  addMesh(operator, new THREE.BoxGeometry(0.32, 0.5, 0.28), materials.cosmic, elbowRight.clone().lerp(handRight, 0.38));
  addMesh(operator, new THREE.SphereGeometry(0.2, 16, 10), materials.suit, handLeft);
  addMesh(operator, new THREE.SphereGeometry(0.2, 16, 10), materials.suit, handRight);

  const hipLeft = new THREE.Vector3(-0.34, -0.1, 0.08);
  const hipRight = new THREE.Vector3(0.34, -0.1, 0.08);
  const kneeLeft = new THREE.Vector3(-0.52, -0.67, 1.02);
  const kneeRight = new THREE.Vector3(0.52, -0.67, 1.02);
  const ankleLeft = new THREE.Vector3(-0.54, -1.57, 1.35);
  const ankleRight = new THREE.Vector3(0.54, -1.57, 1.35);
  addCapsuleBetween(operator, hipLeft, kneeLeft, 0.29, materials.suit);
  addCapsuleBetween(operator, hipRight, kneeRight, 0.29, materials.suit);
  addCapsuleBetween(operator, kneeLeft, ankleLeft, 0.24, materials.suit);
  addCapsuleBetween(operator, kneeRight, ankleRight, 0.24, materials.suit);
  addCapsuleBetween(operator, hipLeft.clone().lerp(kneeLeft, 0.06), kneeLeft.clone().lerp(hipLeft, 0.2), 0.32, materials.cosmic);
  addCapsuleBetween(operator, hipRight.clone().lerp(kneeRight, 0.06), kneeRight.clone().lerp(hipRight, 0.2), 0.32, materials.cosmic);
  addMesh(operator, new THREE.SphereGeometry(0.3, 18, 12), materials.cosmic, kneeLeft, new THREE.Euler(), new THREE.Vector3(1, 0.82, 1));
  addMesh(operator, new THREE.SphereGeometry(0.3, 18, 12), materials.cosmic, kneeRight, new THREE.Euler(), new THREE.Vector3(1, 0.82, 1));
  addMesh(operator, new THREE.BoxGeometry(0.46, 0.56, 0.34), materials.cosmic, kneeLeft.clone().lerp(ankleLeft, 0.54));
  addMesh(operator, new THREE.BoxGeometry(0.46, 0.56, 0.34), materials.cosmic, kneeRight.clone().lerp(ankleRight, 0.54));
  addMesh(operator, new THREE.BoxGeometry(0.48, 0.3, 0.75), materials.shell, ankleLeft.clone().add(new THREE.Vector3(0, -0.05, 0.25)), new THREE.Euler(-0.12, 0, 0));
  addMesh(operator, new THREE.BoxGeometry(0.48, 0.3, 0.75), materials.shell, ankleRight.clone().add(new THREE.Vector3(0, -0.05, 0.25)), new THREE.Euler(-0.12, 0, 0));
  return operator;
}

function createSeatedPose(model: THREE.Group) {
  interface BoneAim {
    bone: THREE.Bone;
    child?: THREE.Bone;
    axis: THREE.Vector3;
    direction: THREE.Vector3;
  }

  const bone = (name: string) => {
    const object = model.getObjectByName(name);
    return object instanceof THREE.Bone ? object : undefined;
  };
  const aims: BoneAim[] = [];
  const addAim = (boneName: string, childName: string | undefined, axis: THREE.Vector3, direction: THREE.Vector3) => {
    const targetBone = bone(boneName);
    const childBone = childName ? bone(childName) : undefined;
    if (targetBone && (!childName || childBone)) aims.push({ bone: targetBone, child: childBone, axis, direction: direction.normalize() });
  };

  addAim("Hips", "Abdomen", UP, new THREE.Vector3(0, 0.94, -0.34));
  addAim("Abdomen", "Torso", UP, new THREE.Vector3(0, 0.95, -0.31));
  addAim("Torso", "Chest", UP, new THREE.Vector3(0, 0.96, -0.27));
  addAim("Chest", "Neck", UP, new THREE.Vector3(0, 0.99, -0.12));
  addAim("Neck", "Head", UP, new THREE.Vector3(0, 0.99, 0.06));
  addAim("ShoulderL", "UpperArmL", UP, new THREE.Vector3(0.62, -0.36, 0.32));
  addAim("UpperArmL", "LowerArmL", UP, new THREE.Vector3(0.22, -0.82, 0.53));
  addAim("LowerArmL", "WristL", UP, new THREE.Vector3(-0.04, -0.45, 0.89));
  addAim("ShoulderR", "UpperArmR", UP, new THREE.Vector3(-0.62, -0.36, 0.32));
  addAim("UpperArmR", "LowerArmR", UP, new THREE.Vector3(-0.22, -0.82, 0.53));
  addAim("LowerArmR", "WristR", UP, new THREE.Vector3(0.04, -0.45, 0.89));
  addAim("UpperLegL", "LowerLegL", UP, new THREE.Vector3(0.12, -0.36, 0.93));
  addAim("LowerLegL", undefined, UP, new THREE.Vector3(0, -0.97, 0.24));
  addAim("UpperLegR", "LowerLegR", UP, new THREE.Vector3(-0.12, -0.36, 0.93));
  addAim("LowerLegR", undefined, UP, new THREE.Vector3(0, -0.97, 0.24));

  const hips = bone("Hips");
  const footLeft = bone("FootL");
  const footRight = bone("FootR");
  const rootWorldQuaternion = new THREE.Quaternion();
  const rootWorldScale = new THREE.Vector3();
  const boneWorldQuaternion = new THREE.Quaternion();
  const parentWorldQuaternion = new THREE.Quaternion();
  const targetWorldQuaternion = new THREE.Quaternion();
  const rotationDelta = new THREE.Quaternion();
  const bonePosition = new THREE.Vector3();
  const childPosition = new THREE.Vector3();
  const currentDirection = new THREE.Vector3();
  const desiredDirection = new THREE.Vector3();
  const hipPosition = new THREE.Vector3();
  const targetPosition = new THREE.Vector3();
  const scaledOffset = new THREE.Vector3();
  const footLeftOffset = new THREE.Vector3(0.22, -0.58, 0.55);
  const footRightOffset = new THREE.Vector3(-0.22, -0.58, 0.55);

  const positionFoot = (targetFoot: THREE.Bone | undefined, offset: THREE.Vector3) => {
    if (!targetFoot?.parent || !hips) return;
    model.updateMatrixWorld(true);
    hips.getWorldPosition(hipPosition);
    scaledOffset.copy(offset).multiply(rootWorldScale).applyQuaternion(rootWorldQuaternion);
    targetPosition.copy(hipPosition).add(scaledOffset);
    targetFoot.position.copy(targetFoot.parent.worldToLocal(targetPosition));
  };

  return () => {
    model.updateMatrixWorld(true);
    model.getWorldQuaternion(rootWorldQuaternion);
    model.getWorldScale(rootWorldScale);

    for (const aim of aims) {
      model.updateMatrixWorld(true);
      aim.bone.getWorldQuaternion(boneWorldQuaternion);
      if (aim.child) {
        aim.bone.getWorldPosition(bonePosition);
        aim.child.getWorldPosition(childPosition);
        currentDirection.copy(childPosition).sub(bonePosition).normalize();
      } else {
        currentDirection.copy(aim.axis).applyQuaternion(boneWorldQuaternion).normalize();
      }
      desiredDirection.copy(aim.direction).applyQuaternion(rootWorldQuaternion).normalize();
      rotationDelta.setFromUnitVectors(currentDirection, desiredDirection);
      targetWorldQuaternion.copy(rotationDelta).multiply(boneWorldQuaternion);
      aim.bone.parent?.getWorldQuaternion(parentWorldQuaternion);
      aim.bone.quaternion.copy(parentWorldQuaternion.invert().multiply(targetWorldQuaternion));
    }

    model.updateMatrixWorld(true);
    model.getWorldQuaternion(rootWorldQuaternion);
    model.getWorldScale(rootWorldScale);
    positionFoot(footLeft, footLeftOffset);
    positionFoot(footRight, footRightOffset);
    model.updateMatrixWorld(true);
  };
}

function disposeMaterialAssets(materials: Set<THREE.Material>) {
  const textures = new Set<THREE.Texture>();
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (value instanceof THREE.Texture) textures.add(value);
    }
    material.dispose();
  }
  textures.forEach((texture) => texture.dispose());
}

async function loadRiggedOperator(modelUrl: string, materials: SceneMaterials): Promise<OperatorRig | null> {
  try {
    const gltf = await new GLTFLoader().loadAsync(modelUrl);
    const group = new THREE.Group();
    group.name = "Rigged cosmic operator";
    const model = gltf.scene;
    model.name = "Quaternius spacesuit";
    model.scale.setScalar(2.18);
    group.add(model);

    const originalMaterials = new Set<THREE.Material>();
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
      sourceMaterials.forEach((material) => originalMaterials.add(material));
      const selectMaterial = (material: THREE.Material) => {
        if (/Light_Accent/i.test(material.name)) return materials.cyan;
        if (/SciFi_Light/i.test(material.name)) return materials.cosmic;
        if (/MainDark/i.test(material.name)) return materials.suit;
        if (/Grey/i.test(material.name)) return materials.metal;
        return materials.shell;
      };
      object.material = Array.isArray(object.material)
        ? sourceMaterials.map(selectMaterial)
        : selectMaterial(sourceMaterials[0]);
      object.castShadow = true;
      object.receiveShadow = true;
      object.frustumCulled = false;
    });
    disposeMaterialAssets(originalMaterials);

    const mixer = new THREE.AnimationMixer(model);
    const idle = gltf.animations.find((clip) => clip.name === "Idle_Neutral") ?? gltf.animations.find((clip) => clip.name === "Idle");
    if (idle) {
      const action = mixer.clipAction(idle);
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.timeScale = 0.28;
      action.play();
      mixer.setTime(idle.duration * 0.45);
    }

    const applySeatedPose = createSeatedPose(model);
    const hips = model.getObjectByName("Hips");
    const hipAnchor = new THREE.Vector3(0, -0.08, -0.04);
    const hipWorld = new THREE.Vector3();
    const anchorWorld = new THREE.Vector3();
    const correction = new THREE.Vector3();
    const parentQuaternion = new THREE.Quaternion();
    const parentScale = new THREE.Vector3();

    const anchorHips = () => {
      if (!hips || !model.parent) return;
      group.updateMatrixWorld(true);
      model.updateMatrixWorld(true);
      hips.getWorldPosition(hipWorld);
      anchorWorld.copy(hipAnchor);
      group.localToWorld(anchorWorld);
      correction.copy(anchorWorld).sub(hipWorld);
      model.parent.getWorldQuaternion(parentQuaternion);
      model.parent.getWorldScale(parentScale);
      correction.applyQuaternion(parentQuaternion.invert()).divide(parentScale);
      model.position.add(correction);
      model.updateMatrixWorld(true);
    };

    anchorHips();
    applySeatedPose();
    anchorHips();
    group.add(createShoulderLauncher(materials));

    return {
      group,
      update(delta: number) {
        if (idle) mixer.update(delta);
        anchorHips();
        applySeatedPose();
      },
      dispose() {
        mixer.stopAllAction();
        mixer.uncacheRoot(model);
      },
    };
  } catch {
    return null;
  }
}

export async function createGameScene(options: GameSceneOptions): Promise<GameSceneHandle> {
  const {
    container,
    modelUrl = "/personal-site/models/cosmic-operator.glb",
    reducedMotion,
    onReady,
    onFallback,
  } = options;
  const mobile = container.clientWidth < 700;
  let disposed = false;
  let running = false;
  let playbackRequested = false;
  let frame = 0;
  let elapsed = 0;
  let lastFrameTime = 0;
  let pulseAge = -1;
  let motionReduced = reducedMotion;
  let compactMode = mobile;
  let cleanupComplete = false;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(0x02040a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.tabIndex = -1;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02040a);
  scene.fog = new THREE.FogExp2(0x030710, 0.013);
  const camera = new THREE.PerspectiveCamera(mobile ? 41 : 36, 1, 0.1, 160);
  camera.position.set(mobile ? 7.2 : 9.2, mobile ? 3.1 : 4.15, mobile ? 11.8 : 13.4);

  const controls = new OrbitControls(camera, container);
  controls.target.set(1.15, 0.15, 0);
  controls.enableDamping = !motionReduced;
  controls.dampingFactor = 0.065;
  controls.enablePan = false;
  controls.enableZoom = !motionReduced;
  controls.enableRotate = !motionReduced;
  controls.rotateSpeed = 0.48;
  controls.zoomSpeed = 0.82;
  controls.minDistance = mobile ? 6.8 : 7.6;
  controls.maxDistance = mobile ? 15.4 : 16.2;
  controls.minPolarAngle = 0.44;
  controls.maxPolarAngle = 1.5;
  controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  controls.update();
  controls.saveState();

  const cosmicTime = { value: 0 };
  const materials = createMaterials(cosmicTime);
  const stars = createStarField(mobile);
  scene.add(stars);
  const planet = createPlanet(scene);
  const holograms = createOffice(scene, materials);

  const chairRig = new THREE.Group();
  chairRig.position.set(2.45, 0, -0.05);
  scene.add(chairRig);
  chairRig.add(createChair(materials));

  const loadedOperator = await loadRiggedOperator(modelUrl, materials);
  const operatorRig: OperatorRig = loadedOperator ?? {
    group: createProceduralOperator(materials),
    update: () => undefined,
    dispose: () => undefined,
  };
  const operator = operatorRig.group;
  operator.position.z += 0.02;
  chairRig.add(operator);
  const operatorBaseRotationY = operator.rotation.y;

  const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0x65efff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const pulseMesh = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.34, 72), pulseMaterial);
  pulseMesh.rotation.x = -Math.PI / 2;
  pulseMesh.position.y = -1.8;
  pulseMesh.visible = false;
  scene.add(pulseMesh);

  const hemisphere = new THREE.HemisphereLight(0x8edcff, 0x05070d, 1.15);
  scene.add(hemisphere);
  const keyLight = new THREE.DirectionalLight(0xd9f5ff, 3.4);
  keyLight.position.set(-6, 9, 8);
  keyLight.castShadow = !mobile;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 32;
  keyLight.shadow.camera.left = -9;
  keyLight.shadow.camera.right = 9;
  keyLight.shadow.camera.top = 9;
  keyLight.shadow.camera.bottom = -9;
  scene.add(keyLight);
  const rimLight = new THREE.SpotLight(0x4de9ff, 55, 22, Math.PI * 0.24, 0.55, 1.4);
  rimLight.position.set(7, 5, -6);
  rimLight.target.position.set(2.4, 0.4, 0);
  scene.add(rimLight, rimLight.target);
  const violetLight = new THREE.PointLight(0x765cff, 18, 15, 1.5);
  violetLight.position.set(-3, 2, -4);
  scene.add(violetLight);

  const pointerTarget = new THREE.Vector2();
  const pointerCurrent = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.8);
  const pulseCenter = new THREE.Vector3(1.2, -1.8, 0);
  const pulseOffset = new THREE.Vector3();

  function resize() {
    if (disposed) return;
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    const compact = width < 700;
    if (compact !== compactMode) {
      compactMode = compact;
      camera.position.set(compact ? 7.2 : 9.2, compact ? 3.1 : 4.15, compact ? 11.8 : 13.4);
      controls.target.set(1.15, 0.15, 0);
      controls.minDistance = compact ? 6.8 : 7.6;
      controls.maxDistance = compact ? 15.4 : 16.2;
      controls.update();
      controls.saveState();
    }
    renderer.shadowMap.enabled = !compact;
    keyLight.castShadow = !compact;
    camera.aspect = width / height;
    camera.fov = compact ? 41 : 36;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.2 : 1.5));
    renderer.setSize(width, height, false);
    controls.update();
    renderer.render(scene, camera);
  }

  function updatePulse(delta: number) {
    if (pulseAge < 0) return;
    pulseAge += delta;
    const progress = Math.min(1, pulseAge / 0.85);
    pulseMesh.visible = progress < 1;
    pulseMesh.scale.setScalar(0.5 + progress * 5.4);
    pulseMaterial.opacity = (1 - progress) * 0.72;
    if (progress >= 1) pulseAge = -1;
  }

  function renderFrame(timestamp: number) {
    if (!running || disposed) return;
    const delta = lastFrameTime === 0 ? 0 : Math.min((timestamp - lastFrameTime) / 1000, 0.05);
    lastFrameTime = timestamp;
    elapsed += delta;
    cosmicTime.value = elapsed;

    const pointerDamping = 1 - Math.exp(-delta * 5.8);
    pointerCurrent.lerp(pointerTarget, pointerDamping);
    stars.rotation.y += delta * 0.0025;
    planet.rotation.y += delta * 0.018;
    holograms.position.y = 0.28 + Math.sin(elapsed * 0.9) * 0.025;
    holograms.rotation.z = pointerCurrent.x * 0.008;
    operator.rotation.y = operatorBaseRotationY + pointerCurrent.x * 0.018 + Math.sin(elapsed * 0.45) * 0.006;
    operatorRig.update(delta);
    rimLight.position.x = 7 + pointerCurrent.x * 0.8;
    rimLight.position.y = 5 + pointerCurrent.y * 0.45;
    updatePulse(delta);
    controls.update(delta);
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(renderFrame);
  }

  function resumePlayback() {
    if (disposed || running || motionReduced) return;
    running = true;
    lastFrameTime = 0;
    frame = window.requestAnimationFrame(renderFrame);
  }

  function suspendPlayback() {
    running = false;
    window.cancelAnimationFrame(frame);
    lastFrameTime = 0;
  }

  function start() {
    playbackRequested = true;
    resumePlayback();
  }

  function stop() {
    playbackRequested = false;
    suspendPlayback();
  }

  function setPointer(x: number, y: number) {
    if (motionReduced) return;
    pointerTarget.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(y, -1, 1));
  }

  function pulse(x: number, y: number) {
    if (motionReduced) return;
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const point = raycaster.ray.intersectPlane(floorPlane, new THREE.Vector3());
    if (!point) return;
    pulseOffset.copy(point).sub(pulseCenter).setY(0);
    if (pulseOffset.lengthSq() > 11.5 * 11.5) point.copy(pulseCenter).add(pulseOffset.setLength(11.5));
    pulseMesh.position.set(point.x, -1.8, point.z);
    pulseMesh.scale.setScalar(0.5);
    pulseMesh.visible = true;
    pulseAge = 0;
  }

  function resetView() {
    if (motionReduced) return;
    controls.reset();
    pointerTarget.set(0, 0);
    pointerCurrent.set(0, 0);
  }

  function setReducedMotion(reduced: boolean) {
    if (disposed || motionReduced === reduced) return;
    motionReduced = reduced;
    controls.enableDamping = !reduced;
    controls.enableZoom = !reduced;
    controls.enableRotate = !reduced;
    if (reduced) {
      suspendPlayback();
      controls.update();
      renderer.render(scene, camera);
    } else if (playbackRequested) {
      resumePlayback();
    }
  }

  function handleContextLost(event: Event) {
    event.preventDefault();
    suspendPlayback();
    container.classList.remove("is-ready");
    onFallback();
  }

  async function handleContextRestored() {
    if (disposed) return;
    try {
      await renderer.compileAsync(scene, camera);
      if (disposed) return;
      resize();
      onReady();
      if (playbackRequested) resumePlayback();
    } catch {
      onFallback();
    }
  }

  function disposeScene() {
    if (cleanupComplete) return;
    cleanupComplete = true;
    disposed = true;
    stop();
    container.removeEventListener("dblclick", resetView);
    renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
    renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored);
    controls.dispose();
    operatorRig.dispose();

    keyLight.shadow.map?.dispose();
    keyLight.shadow.mapPass?.dispose();
    const geometries = new Set<THREE.BufferGeometry>();
    const sceneMaterials = new Set<THREE.Material>();
    const skeletons = new Set<THREE.Skeleton>();
    scene.traverse((object) => {
      if (object instanceof THREE.SkinnedMesh) skeletons.add(object.skeleton);
      if (!(object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line || object instanceof THREE.LineSegments)) return;
      geometries.add(object.geometry);
      const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
      objectMaterials.forEach((material) => sceneMaterials.add(material));
    });
    skeletons.forEach((skeleton) => skeleton.dispose());
    geometries.forEach((geometry) => geometry.dispose());
    disposeMaterialAssets(sceneMaterials);
    renderer.dispose();
    renderer.domElement.remove();
  }

  container.addEventListener("dblclick", resetView);
  renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
  renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored);
  try {
    await renderer.compileAsync(scene, camera);
    if (disposed) throw new Error("Game scene disposed during initialization");
    resize();
    onReady();
  } catch (error) {
    try {
      onFallback();
    } finally {
      disposeScene();
    }
    throw error;
  }

  return {
    resize,
    setPointer,
    pulse,
    setReducedMotion,
    start,
    stop,
    dispose: disposeScene,
  };
}
