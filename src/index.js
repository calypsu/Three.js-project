import * as THREE from "three";
import { Ease, Tween } from "@createjs/tweenjs";

let scene = new THREE.Scene();

console.log("Abhishek Challa");

// backround

const topLeft = new THREE.Color(0x00fff0);
const topRight = new THREE.Color(0xffff00);
const bottomRight = new THREE.Color(0xfff000);
const bottomLeft = new THREE.Color(0xff0000);

const data = new Uint8Array([
  Math.round(bottomLeft.r * 255),
  Math.round(bottomLeft.g * 255),
  Math.round(bottomLeft.b * 255),
  Math.round(bottomRight.r * 255),
  Math.round(bottomRight.g * 255),
  Math.round(bottomRight.b * 255),
  Math.round(topLeft.r * 255),
  Math.round(topLeft.g * 255),
  Math.round(topLeft.b * 255),
  Math.round(topRight.r * 255),
  Math.round(topRight.g * 255),
  Math.round(topRight.b * 255),
]);

const backgroundTexture = new THREE.DataTexture(data, 2, 2, THREE.RGBFormat);
backgroundTexture.magFilter = THREE.LinearFilter;
backgroundTexture.needsUpdate = true;

scene.background = backgroundTexture;

// car

function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
}

const playercar = () => {
  const car = new THREE.Group();

  const backwheel = new THREE.Mesh(
    new THREE.BoxBufferGeometry(9, 23, 12),
    new THREE.MeshLambertMaterial({ color: 0x333333 })
  );

  backwheel.position.z = 6;
  backwheel.position.x = -18;

  car.add(backwheel);

  const frontwheel = new THREE.Mesh(
    new THREE.BoxBufferGeometry(9, 23, 12),
    new THREE.MeshLambertMaterial({ color: 0x333333 })
  );

  frontwheel.position.z = 6;
  frontwheel.position.x = 18;

  car.add(frontwheel);

  const body = new THREE.Mesh(
    new THREE.BoxBufferGeometry(50, 20, 15),
    new THREE.MeshLambertMaterial({ color: 0xa52523 })
  );

  body.position.z = 12;

  car.add(body);

  const carFrontTexture = getCarFrontTexture();
  carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
  carFrontTexture.rotation = Math.PI / 2;

  const carBackTexture = getCarFrontTexture();
  carBackTexture.center = new THREE.Vector2(0.5, 0.5);
  carBackTexture.rotation = -Math.PI / 2;

  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.flipY = false;

  const carRightSideTexture = getCarSideTexture();

  const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(26, 14, 20), [
    new THREE.MeshLambertMaterial({ map: carFrontTexture }),
    new THREE.MeshLambertMaterial({ map: carBackTexture }),
    new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
    new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
    new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom
  ]);

  cabin.position.z = 20;
  cabin.position.x = 10;

  car.add(cabin);

  return car;
};

let car = playercar();

scene.add(car);

let box = new THREE.Mesh(
  new THREE.BoxBufferGeometry(100, 100, 100),
  new THREE.MeshLambertMaterial({ color: 0x333333 })
);
box.position.x = 100;
box.position.y = -100;

scene.add(box);

// lights

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 0.6);
light.position.set(100, -300, 400);
scene.add(light);

// camera

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, -200, 300);
camera.lookAt(car.position.x, car.position.y, car.position.z);

// renderer

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

// making it resposive

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

//car movement logic

const target = {
  car: {
    position: car.position.clone(),
    rotation: car.rotation.clone(),
  },
  camera: {
    position: camera.position.clone(),
    rotation: car.rotation.clone(),
  },
};

const stdAngleDiff = 0.1,
  stdForward = 10;

let isUpKeyDown = false,
  isDownKeyDown = false,
  isLeftKeyDown = false,
  isRightKeyDown = false;

window.addEventListener("keydown", (key) => {
  if (key.keyCode === 37) isLeftKeyDown = true;
  else if (key.keyCode === 38) isUpKeyDown = true;
  else if (key.keyCode === 39) isRightKeyDown = true;
  else if (key.keyCode === 40) isDownKeyDown = true;
});

window.addEventListener("keyup", (key) => {
  if (key.keyCode === 37) isLeftKeyDown = false;
  else if (key.keyCode === 38) isUpKeyDown = false;
  else if (key.keyCode === 39) isRightKeyDown = false;
  else if (key.keyCode === 40) isDownKeyDown = false;
});

const calculateMovement = () => {
  let H = 0,
    angleDiff = 0;

  if (isUpKeyDown) H = stdForward;
  if (isDownKeyDown) H = -1 * stdForward;
  if (isLeftKeyDown) angleDiff = stdAngleDiff;
  if (isRightKeyDown) angleDiff = -1 * stdAngleDiff;

  const angle = target.car.rotation.z + angleDiff;

  const finalPosition = {
    x: target.car.position.x + -1 * H * Math.cos(angle),
    y: target.car.position.y + -1 * H * Math.sin(angle),
  };

  target.car.position.x = finalPosition.x;
  target.car.position.y = finalPosition.y;
  target.car.rotation.z = angle;
  target.camera.position.x = finalPosition.x;

  const transition = Ease.cubicInOut;
  // const transition = undefined;

  Tween.get(car.position).to(target.car.position, 50, transition);
  // Tween.get(car.rotation).to({ z: angle }, 200, transition);
  car.rotation.z = angle;
  camera.position.x = target.camera.position.x;
};

// zoom

window.addEventListener("wheel", (wheel) => {
  if (wheel.deltaY < 0) {
    camera.zoom = camera.zoom + 0.2;
  }
  if (wheel.deltaY > 0 && camera.zoom > 0.3) {
    camera.zoom = camera.zoom - 0.2;
  }
});

// render loop
renderer.setAnimationLoop(() => {
  calculateMovement();
  renderer.render(scene, camera);
});
