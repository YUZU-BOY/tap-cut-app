
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias: true});
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

let cutPlane;
let isCut = false;

function cutSphere() {
  if (isCut) return;
  cutPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    })
  );
  cutPlane.rotation.x = Math.PI / 4;
  scene.add(cutPlane);
  isCut = true;
}

function resetCut() {
  if (cutPlane) {
    scene.remove(cutPlane);
    cutPlane = null;
    isCut = false;
  }
}

let light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

camera.position.z = 6;

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
