
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
let sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x66ccff,
  transparent: true,
  opacity: 0.6
});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

let light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

camera.position.z = 6;

// 断面用のカット面
let cutPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshBasicMaterial({
    color: 0xff4444,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  })
);
cutPlane.visible = false;
scene.add(cutPlane);

// 断面の2D表示用Canvas
const canvas2d = document.getElementById('canvas2d');
const ctx2d = canvas2d.getContext('2d');

function update2DCircle(y) {
  const r = Math.sqrt(Math.max(0, 4 - y * y)); // 球の半径2 → √(4 - y²)
  const centerX = canvas2d.width / 2;
  const centerY = canvas2d.height / 2;

  ctx2d.clearRect(0, 0, canvas2d.width, canvas2d.height);
  if (r > 0) {
    ctx2d.beginPath();
    ctx2d.arc(centerX, centerY, r * 30, 0, 2 * Math.PI); // 拡大表示
    ctx2d.fillStyle = 'rgba(255, 100, 100, 0.6)';
    ctx2d.fill();
    ctx2d.strokeStyle = 'black';
    ctx2d.lineWidth = 2;
    ctx2d.stroke();
  }
}

function onClick(event) {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(sphere);
  if (intersects.length > 0) {
    const y = intersects[0].point.y;
    cutPlane.position.y = y;
    cutPlane.rotation.x = 0;
    cutPlane.rotation.y = 0;
    cutPlane.rotation.z = 0;
    cutPlane.visible = true;
    update2DCircle(y);
  }
}

window.addEventListener('click', onClick);

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
