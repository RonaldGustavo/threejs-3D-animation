import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createDiceMaterial(value) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#222';
  const dotRadius = 14;
  // Dot positions for dice faces
  const positions = {
    1: [[64, 64]],
    2: [[32, 32], [96, 96]],
    3: [[32, 32], [64, 64], [96, 96]],
    4: [[32, 32], [32, 96], [96, 32], [96, 96]],
    5: [[32, 32], [32, 96], [64, 64], [96, 32], [96, 96]],
    6: [[32, 32], [32, 64], [32, 96], [96, 32], [96, 64], [96, 96]]
};
  positions[value].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  });
  return new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(canvas) });
}

function createDice() {
  const geometry = new THREE.BoxGeometry();
  const materials = [];
  for (let i = 1; i <= 6; i++) {
    materials.push(createDiceMaterial(i));
  }
  return new THREE.Mesh(geometry, materials);
}

export function startAnimation() {
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2;
  controls.maxDistance = 20;

  // Dice
  const dice = createDice();
  scene.add(dice);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    dice.rotation.x += 0.01;
    dice.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Responsive resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
