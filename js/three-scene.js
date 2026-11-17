/**
 * PlayBeat Digital - 3D Ambient WebGL Experience
 * Interactive particles and floating cyber crystals
 */

function initAmbassadorsThreeScene() {
  const container = document.getElementById('three-canvas-ambassadors');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 450;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Floating geometric neon crystals
  const group = new THREE.Group();
  scene.add(group);

  const geo1 = new THREE.IcosahedronGeometry(6, 1);
  const mat1 = new THREE.MeshBasicMaterial({ color: 0x7928ca, wireframe: true, transparent: true, opacity: 0.25 });
  const mesh1 = new THREE.Mesh(geo1, mat1);
  mesh1.position.set(-15, 0, -5);
  group.add(mesh1);

  const geo2 = new THREE.OctahedronGeometry(5, 0);
  const mat2 = new THREE.MeshBasicMaterial({ color: 0xf73030, wireframe: true, transparent: true, opacity: 0.3 });
  const mesh2 = new THREE.Mesh(geo2, mat2);
  mesh2.position.set(15, 2, -4);
  group.add(mesh2);

  // Particles
  const count = 750;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    pos[i] = (Math.random() - 0.5) * 60;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xff4d4d,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  function animate() {
    requestAnimationFrame(animate);
    mesh1.rotation.y += 0.005;
    mesh1.rotation.x += 0.003;
    mesh2.rotation.y -= 0.006;
    mesh2.rotation.z += 0.004;

    particles.rotation.y += 0.001;

    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 450;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

document.addEventListener('DOMContentLoaded', initAmbassadorsThreeScene);
