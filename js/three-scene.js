/**
 * PlayBeat Digital - 3D Animated Global Brand WebGL Experience
 * Three.js 3D Interactive Cyber Globe & Planetary Key Delivery Visualizer
 */

function initGlobalBrand3D() {
  const container = document.getElementById('three-canvas-global-brand');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 560;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0c16, 0.0015);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 24);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  // 2. Global Brand Core: 3D Holographic Cyber Earth
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Position globe to the right side on desktop, center on mobile
  const updateGlobePos = () => {
    if (window.innerWidth > 960) {
      globeGroup.position.set(6.8, 0, 0);
    } else {
      globeGroup.position.set(0, 1.5, -4);
    }
  };
  updateGlobePos();

  // A. Inner glowing core
  const coreGeo = new THREE.SphereGeometry(4.8, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x090d1f,
    emissive: 0x180b38,
    emissiveIntensity: 0.6,
    metalness: 0.8,
    roughness: 0.2
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  globeGroup.add(coreMesh);

  // B. Wireframe latitude/longitude globe lines
  const wireGeo = new THREE.SphereGeometry(5.0, 24, 24);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  globeGroup.add(wireMesh);

  // C. Glowing continent node points
  const pointsCount = 450;
  const pGlobeGeo = new THREE.BufferGeometry();
  const pGlobePos = new Float32Array(pointsCount * 3);
  for (let i = 0; i < pointsCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / pointsCount);
    const theta = Math.sqrt(pointsCount * Math.PI) * phi;
    const r = 5.08;
    pGlobePos[i * 3] = r * Math.cos(theta) * Math.sin(phi);
    pGlobePos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    pGlobePos[i * 3 + 2] = r * Math.cos(phi);
  }
  pGlobeGeo.setAttribute('position', new THREE.BufferAttribute(pGlobePos, 3));
  const pGlobeMat = new THREE.PointsMaterial({
    size: 0.16,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const globePoints = new THREE.Points(pGlobeGeo, pGlobeMat);
  globeGroup.add(globePoints);

  // D. Orbiting Worldwide Key Rings (Planetary Satellites)
  const ringGeo1 = new THREE.TorusGeometry(7.2, 0.04, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xf73030, transparent: true, opacity: 0.6 });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 3;
  globeGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(8.0, 0.04, 16, 100);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x7928ca, transparent: true, opacity: 0.5 });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.y = Math.PI / 3;
  globeGroup.add(ring2);

  // E. Orbiting 3D Digital Key Nodes (representing instant delivery)
  const keyNodes = [];
  const chipGeo = new THREE.BoxGeometry(0.8, 1.2, 0.06);
  const chipMat = new THREE.MeshStandardMaterial({
    color: 0x111628,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.8,
    metalness: 0.9,
    roughness: 0.1
  });

  for (let i = 0; i < 5; i++) {
    const chip = new THREE.Mesh(chipGeo, chipMat);
    const angle = (i / 5) * Math.PI * 2;
    globeGroup.add(chip);
    keyNodes.push({ mesh: chip, angle, speed: 0.007 + i * 0.002, radius: 7.2 });
  }

  // 3. Ambient Starfield / Particle Vortex
  const starsCount = 1000;
  const starsGeo = new THREE.BufferGeometry();
  const starsPos = new Float32Array(starsCount * 3);
  for (let i = 0; i < starsCount * 3; i++) {
    starsPos[i] = (Math.random() - 0.5) * 80;
  }
  starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
  const starsMat = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
  });
  const stars = new THREE.Points(starsGeo, starsMat);
  scene.add(stars);

  // 4. Lighting
  const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambLight);

  const redLight = new THREE.PointLight(0xf73030, 3, 50);
  redLight.position.set(10, 8, 10);
  scene.add(redLight);

  const cyanLight = new THREE.PointLight(0x00f0ff, 3, 50);
  cyanLight.position.set(-10, -8, 10);
  scene.add(cyanLight);

  // 5. Interactive Mouse Parallax
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  // 6. Animation
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse interpolation
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Globe Rotation
    globeGroup.rotation.y = t * 0.15 + targetX * 0.8;
    globeGroup.rotation.x = targetY * 0.6;

    wireMesh.rotation.y = -t * 0.08;
    globePoints.rotation.y = t * 0.12;

    ring1.rotation.z = t * 0.25;
    ring2.rotation.x = t * 0.2;

    // Orbit keys
    keyNodes.forEach((node) => {
      node.angle += node.speed;
      node.mesh.position.x = Math.cos(node.angle) * node.radius;
      node.mesh.position.z = Math.sin(node.angle) * node.radius;
      node.mesh.rotation.y = -node.angle;
      node.mesh.rotation.x = Math.sin(t) * 0.3;
    });

    stars.rotation.y = t * 0.01;

    camera.position.x += (targetX * 2 - camera.position.x) * 0.05;
    camera.position.y += (-targetY * 2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 560;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    updateGlobePos();
  });
}

document.addEventListener('DOMContentLoaded', initGlobalBrand3D);
