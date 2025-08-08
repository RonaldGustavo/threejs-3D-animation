import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function startAnimation() {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2;
  controls.maxDistance = 20;

  // Dice geometry & textures
  const geometry = new THREE.BoxGeometry();
  const diceMaterials = [];
  for (let i = 1; i <= 6; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = ['#e74c3c','#f1c40f','#2ecc71','#3498db','#9b59b6','#fff'][i-1];
    ctx.fillRect(0, 0, 128, 128);
    ctx.font = 'bold 80px Segoe UI, Arial';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(i, 64, 70);
    diceMaterials.push(new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(canvas) }));
  }
  const dice = new THREE.Mesh(geometry, diceMaterials);
  scene.add(dice);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
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
