import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function drawDiceFace(ctx, value) {
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#222';
  const dotRadius = 14;
  const positions = [
    [64, 64], // 1
    [32, 32], [96, 96], // 2
    [32, 32], [64, 64], [96, 96], // 3
    [32, 32], [32, 96], [96, 32], [96, 96], // 4
    [32, 32], [32, 96], [64, 64], [96, 32], [96, 96], // 5
    [32, 32], [32, 64], [32, 96], [96, 32], [96, 64], [96, 96] // 6
  ];
  let dots = [];
  switch (value) {
    case 1: dots = [positions[0]]; break;
    case 2: dots = [positions[1], positions[2]]; break;
    case 3: dots = [positions[3], positions[4], positions[5]]; break;
    case 4: dots = [positions[6], positions[7], positions[8], positions[9]]; break;
    case 5: dots = [positions[10], positions[11], positions[12], positions[13], positions[14]]; break;
    case 6: dots = [positions[15], positions[16], positions[17], positions[18], positions[19], positions[20]]; break;
  }
  dots.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

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
    drawDiceFace(ctx, i);
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
