import * as THREE from "three";
import * as CANNON from "cannon";
import car from './objects/car';
import box from './objects/box';

// THREE.js scene
let scene = new THREE.Scene();

//Cannon.js world
let world = new CANNON.World();
world.gravity.set(0, -9.807, 0);

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

scene.add(car.three);
world.addBody(car.cannon);

// box

scene.add(box.three);
world.addBody(box.cannon);

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
camera.position.set(0, 200, 300);
camera.lookAt(car.three.position.x, car.three.position.y, car.three.position.z);

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

let isUpKeyDown = false,
  isDownKeyDown = false,
  isLeftKeyDown = false,
  isRightKeyDown = false;

window.addEventListener("keydown", (key) => {
  if (key.keyCode === 37) isRightKeyDown = true;
  else if (key.keyCode === 38) isUpKeyDown = true;
  else if (key.keyCode === 39) isLeftKeyDown = true;
  else if (key.keyCode === 40) isDownKeyDown = true;
});

window.addEventListener("keyup", (key) => {
  if (key.keyCode === 37) isRightKeyDown = false;
  else if (key.keyCode === 38) isUpKeyDown = false;
  else if (key.keyCode === 39) isLeftKeyDown = false;
  else if (key.keyCode === 40) isDownKeyDown = false;
});

const stdAngleDiff = 1,
  stdForward = 20,
  target = {
    car: {
      position: car.cannon.position,
      quaternion: car.cannon.quaternion
      
    },
    camera: camera.position.clone()
  },
  lerp = (fromPosition, toPosition) => {
    fromPosition.x += (toPosition.x - fromPosition.x) * 0.1;
    fromPosition.y += (toPosition.y - fromPosition.y) * 0.1;
    /* fromPosition.z += ( toPosition.z - fromPosition.z ) * 0.1;*/
    return fromPosition;
  };
 
const calculateMovement = () => {
  let H = 0,
    angleDiff = 0;

  if (isUpKeyDown) H = stdForward;
  if (isDownKeyDown) H = -1 * stdForward;
  if (isLeftKeyDown) angleDiff = stdAngleDiff;
  if (isRightKeyDown) angleDiff = -1 * stdAngleDiff;

  const angle = target.car.quaternion.z + angleDiff;

  const finalPosition = {
    x: target.car.position.x + -1 * H * Math.cos(angle),
    y: target.car.position.y + -1 * H * Math.sin(angle),
  };

  /* console.log(JSON.stringify(target, null, 2)) */

  // changing camera's position
  target.camera.x = finalPosition.x;
  target.camera.y = finalPosition.y + 200;
  camera.position.lerp(target.camera , 0.1);

  // Editing cannon.js values
  world.step(1 / 60);
  car.cannon.quaternion.z += (angle - car.cannon.quaternion.z) * 0.15 / 2;
  car.cannon.position.x = lerp(car.cannon.position, finalPosition).x;
  car.cannon.position.y = lerp(car.cannon.position, finalPosition).y;

  // making values sync
  car.three.quaternion.w = car.cannon.quaternion.w;
  car.three.quaternion.x = car.cannon.quaternion.x;
  car.three.quaternion.y = car.cannon.quaternion.y;
  car.three.quaternion.z = car.cannon.quaternion.z;
  car.three.position.x = car.cannon.position.x;
  car.three.position.y = car.cannon.position.y;
  car.three.position.z = car.cannon.position.z;

  /* debugger */

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