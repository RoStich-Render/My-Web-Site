const sceneContainer = document.getElementById('scene-container');

// Basic scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02030a, 0.04);

const camera = new THREE.PerspectiveCamera(
  45,
  sceneContainer.clientWidth / sceneContainer.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
renderer.setClearColor(0x02030a, 1);
sceneContainer.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(3, 2, 5);
scene.add(keyLight);

// Earth
const earthGroup = new THREE.Group();
scene.add(earthGroup);

const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
const textureLoader = new THREE.TextureLoader();
const earthTextureUrl =
  'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg';

const earthMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(earthTextureUrl),
  shininess: 8,
});

const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthGroup.add(earthMesh);

// Very subtle continuous rotation
let baseRotationSpeed = 0.0008;

// Click-to-rotate behavior
let targetRotationY = 0;
let currentRotationY = 0;
const clickStep = Math.PI / 8; // 22.5 degrees per click
const easing = 0.08;

sceneContainer.addEventListener('click', () => {
  targetRotationY += clickStep;
});

// Resize handling
function onWindowResize() {
  const { clientWidth, clientHeight } = sceneContainer;
  if (!clientWidth || !clientHeight) return;

  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(clientWidth, clientHeight);
}

window.addEventListener('resize', onWindowResize);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Smoothly interpolate to target rotation
  currentRotationY += (targetRotationY - currentRotationY) * easing;
  earthGroup.rotation.y = currentRotationY;

  // Subtle base rotation for life
  earthGroup.rotation.y += baseRotationSpeed;

  renderer.render(scene, camera);
}

onWindowResize();
animate();

