import * as THREE from "three";

export interface GameSceneOptions {
  container: HTMLDivElement;
  backgroundUrl: string;
  operatorUrl: string;
  reducedMotion: boolean;
  onReady: () => void;
  onFallback: () => void;
}

export interface GameSceneHandle {
  resize: () => void;
  setPointer: (x: number, y: number) => void;
  pulse: (x: number, y: number) => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
}

export async function createGameScene(options: GameSceneOptions): Promise<GameSceneHandle> {
  const { container, backgroundUrl, operatorUrl, reducedMotion, onReady, onFallback } = options;
  let disposed = false;
  let running = false;
  let frame = 0;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x020503, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.tabIndex = -1;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020503);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 0, 7);

  const textureLoader = new THREE.TextureLoader();
  let backgroundTexture: THREE.Texture;
  let operatorTexture: THREE.Texture;

  try {
    [backgroundTexture, operatorTexture] = await Promise.all([
      textureLoader.loadAsync(backgroundUrl),
      textureLoader.loadAsync(operatorUrl),
    ]);
  } catch (error) {
    renderer.domElement.remove();
    renderer.dispose();
    onFallback();
    throw error;
  }

  if (disposed) {
    backgroundTexture.dispose();
    operatorTexture.dispose();
    renderer.dispose();
    throw new Error("Game scene disposed before textures loaded");
  }

  for (const texture of [backgroundTexture, operatorTexture]) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  }
  const backgroundImage = backgroundTexture.image as HTMLImageElement;
  const operatorImage = operatorTexture.image as HTMLImageElement;

  const environmentGroup = new THREE.Group();
  const atmosphereGroup = new THREE.Group();
  const operatorGroup = new THREE.Group();
  const hudGroup = new THREE.Group();
  scene.add(environmentGroup, atmosphereGroup, operatorGroup, hudGroup);

  const backgroundGeometry = new THREE.PlaneGeometry(1, 1);
  const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture, color: 0xa6aca8 });
  const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  backgroundMesh.position.z = -5;
  environmentGroup.add(backgroundMesh);

  const operatorGeometry = new THREE.PlaneGeometry(1, 1);
  const operatorMaterial = new THREE.MeshBasicMaterial({
    map: operatorTexture,
    transparent: true,
    alphaTest: 0.025,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const operatorMesh = new THREE.Mesh(operatorGeometry, operatorMaterial);
  operatorMesh.renderOrder = 4;
  operatorGroup.add(operatorMesh);

  const grid = new THREE.GridHelper(26, 34, 0x65e99a, 0x1a5e3a);
  const gridMaterial = grid.material as THREE.Material;
  gridMaterial.transparent = true;
  gridMaterial.opacity = 0.2;
  grid.position.set(0, -2.75, -0.3);
  grid.renderOrder = 1;
  scene.add(grid);

  const particleCount = container.clientWidth < 700 ? 90 : 170;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    particlePositions[index * 3] = THREE.MathUtils.randFloatSpread(14);
    particlePositions[index * 3 + 1] = THREE.MathUtils.randFloat(-3.2, 3.7);
    particlePositions[index * 3 + 2] = THREE.MathUtils.randFloat(-3, 4.5);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x78f5a2,
    size: 0.025,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.renderOrder = 2;
  atmosphereGroup.add(particles);

  const rainCount = container.clientWidth < 700 ? 24 : 48;
  const rainPositions = new Float32Array(rainCount * 6);
  const resetRainDrop = (index: number, initial = false) => {
    const offset = index * 6;
    const x = THREE.MathUtils.randFloatSpread(12);
    const y = initial ? THREE.MathUtils.randFloat(-3, 4) : 4;
    const z = THREE.MathUtils.randFloat(-2.5, 3.5);
    rainPositions[offset] = x;
    rainPositions[offset + 1] = y;
    rainPositions[offset + 2] = z;
    rainPositions[offset + 3] = x - 0.09;
    rainPositions[offset + 4] = y - 0.48;
    rainPositions[offset + 5] = z;
  };
  for (let index = 0; index < rainCount; index += 1) resetRainDrop(index, true);
  const rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
  const rainMaterial = new THREE.LineBasicMaterial({
    color: 0x9dd8cc,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  const rain = new THREE.LineSegments(rainGeometry, rainMaterial);
  rain.renderOrder = 3;
  atmosphereGroup.add(rain);

  const radarGroup = new THREE.Group();
  const radarMaterial = new THREE.MeshBasicMaterial({
    color: 0x75f59f,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  for (const radius of [0.46, 0.78, 1.1]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008, 3, 72), radarMaterial);
    radarGroup.add(ring);
  }
  const radarSweep = new THREE.Mesh(
    new THREE.RingGeometry(0.04, 1.1, 56, 1, 0, Math.PI * 0.38),
    new THREE.MeshBasicMaterial({
      color: 0x75f59f,
      transparent: true,
      opacity: 0.075,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  radarGroup.add(radarSweep);
  radarGroup.position.set(2.1, 1.05, 1.15);
  radarGroup.renderOrder = 5;
  hudGroup.add(radarGroup);

  const reticlePoints = [
    new THREE.Vector3(-0.42, -0.42, 0),
    new THREE.Vector3(0.42, -0.42, 0),
    new THREE.Vector3(0.42, 0.42, 0),
    new THREE.Vector3(-0.42, 0.42, 0),
  ];
  const reticle = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(reticlePoints),
    new THREE.LineBasicMaterial({ color: 0xffc35a, transparent: true, opacity: 0.46, depthWrite: false }),
  );
  reticle.rotation.z = Math.PI / 4;
  reticle.position.set(1.75, -0.15, 1.35);
  reticle.renderOrder = 6;
  hudGroup.add(reticle);

  const pulseMaterial = new THREE.MeshBasicMaterial({
    color: 0x72f59d,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const pulseMesh = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.35, 64), pulseMaterial);
  pulseMesh.visible = false;
  pulseMesh.position.z = 1.6;
  pulseMesh.renderOrder = 8;
  scene.add(pulseMesh);

  const pointerTarget = new THREE.Vector2();
  const pointerCurrent = new THREE.Vector2();
  const clock = new THREE.Clock(false);
  const lookAtTarget = new THREE.Vector3(0, -0.2, 0);
  const operatorBase = new THREE.Vector3();
  let pulseAge = -1;

  function visibleSizeAt(z: number) {
    const distance = Math.abs(camera.position.z - z);
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance;
    return { width: height * camera.aspect, height };
  }

  function fitCover(mesh: THREE.Mesh, imageAspect: number, z: number, overscan = 1) {
    const view = visibleSizeAt(z);
    let width = view.width;
    let height = view.height;
    if (width / height > imageAspect) height = width / imageAspect;
    else width = height * imageAspect;
    mesh.scale.set(width * overscan, height * overscan, 1);
  }

  function resize() {
    if (disposed) return;
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    const mobile = width < 700;
    camera.aspect = width / height;
    camera.fov = mobile ? 36 : 34;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5));
    renderer.setSize(width, height, false);

    fitCover(backgroundMesh, backgroundImage.width / backgroundImage.height, -5, 1.08);
    const view = visibleSizeAt(0);
    const operatorAspect = operatorImage.width / operatorImage.height;
    const operatorHeight = view.height * (mobile ? 0.96 : 1.06);
    operatorMesh.scale.set(operatorHeight * operatorAspect, operatorHeight, 1);
    operatorBase.set(view.width * (mobile ? 0.15 : 0.27), mobile ? -0.38 : -0.2, 0.25);
    operatorGroup.position.copy(operatorBase);

    radarGroup.position.set(view.width * (mobile ? 0.2 : 0.29), view.height * 0.2, 1.15);
    const radarScale = mobile ? 0.64 : 0.84;
    radarGroup.scale.setScalar(radarScale);
    reticle.position.set(view.width * (mobile ? 0.18 : 0.24), -0.12, 1.35);
    grid.scale.setScalar(mobile ? 0.72 : 1);
    renderer.render(scene, camera);
  }

  function updateRain(delta: number) {
    const positions = rainGeometry.attributes.position as THREE.BufferAttribute;
    for (let index = 0; index < rainCount; index += 1) {
      const offset = index * 6;
      rainPositions[offset + 1] -= delta * 1.85;
      rainPositions[offset + 4] -= delta * 1.85;
      if (rainPositions[offset + 4] < -3.4) resetRainDrop(index);
    }
    positions.needsUpdate = true;
  }

  function updatePulse(delta: number) {
    if (pulseAge < 0) return;
    pulseAge += delta;
    const progress = Math.min(1, pulseAge / 0.72);
    pulseMesh.visible = progress < 1;
    pulseMesh.scale.setScalar(0.5 + progress * 3.8);
    pulseMaterial.opacity = (1 - progress) * 0.8;
    if (progress >= 1) pulseAge = -1;
  }

  function renderFrame() {
    if (!running || disposed) return;
    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;
    const damping = 1 - Math.exp(-delta * 6.2);
    pointerCurrent.lerp(pointerTarget, damping);
    const idle = Math.sin(elapsed * 0.42) * 0.025;

    environmentGroup.position.x = -pointerCurrent.x * 0.08;
    environmentGroup.position.y = pointerCurrent.y * 0.035;
    operatorGroup.position.x = operatorBase.x + pointerCurrent.x * 0.34 + idle;
    operatorGroup.position.y = operatorBase.y - pointerCurrent.y * 0.14;
    operatorGroup.rotation.y = pointerCurrent.x * 0.045;
    operatorGroup.rotation.x = -pointerCurrent.y * 0.018;
    atmosphereGroup.position.x = -pointerCurrent.x * 0.26;
    atmosphereGroup.position.y = pointerCurrent.y * 0.16;
    hudGroup.position.x = -pointerCurrent.x * 0.38;
    hudGroup.position.y = pointerCurrent.y * 0.22;
    camera.position.x = pointerCurrent.x * 0.11;
    camera.position.y = pointerCurrent.y * 0.07;
    camera.lookAt(lookAtTarget);
    radarSweep.rotation.z -= delta * 0.8;
    reticle.rotation.z += delta * 0.18;

    updateRain(delta);
    updatePulse(delta);
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(renderFrame);
  }

  function start() {
    if (disposed || running || reducedMotion) return;
    running = true;
    clock.start();
    frame = window.requestAnimationFrame(renderFrame);
  }

  function stop() {
    running = false;
    window.cancelAnimationFrame(frame);
    clock.stop();
  }

  function setPointer(x: number, y: number) {
    if (reducedMotion) return;
    pointerTarget.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(y, -1, 1));
  }

  function pulse(x: number, y: number) {
    if (reducedMotion) return;
    const origin = new THREE.Vector3(x, y, 0.1).unproject(camera);
    const direction = origin.sub(camera.position).normalize();
    const distance = (1.6 - camera.position.z) / direction.z;
    const point = camera.position.clone().add(direction.multiplyScalar(distance));
    pulseMesh.position.set(point.x, point.y, 1.6);
    pulseMesh.scale.setScalar(0.5);
    pulseMesh.visible = true;
    pulseAge = 0;
  }

  function handleContextLost(event: Event) {
    event.preventDefault();
    stop();
    container.classList.remove("is-ready");
    onFallback();
  }

  renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
  resize();
  renderer.render(scene, camera);
  onReady();
  if (!reducedMotion) start();

  return {
    resize,
    setPointer,
    pulse,
    start,
    stop,
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line || object instanceof THREE.LineSegments)) return;
        object.geometry?.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) material.dispose();
      });
      backgroundTexture.dispose();
      operatorTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
