import * as THREE from "three";
import * as CANNON from "cannon-es";
import car from './objects/car';
import createBrick from './objects/bricks';

// THREE.js scene
let scene = new THREE.Scene();

//Cannon.js world
const world = new CANNON.World();
world.gravity.set(0, 0, -9.807);

// backround

/* const topLeft = new THREE.Color(0x00fff0);
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
  Math.round(topRight.b * 255)
]);

const backgroundTexture = new THREE.DataTexture(data, 2, 2, THREE.RGBFormat);
backgroundTexture.magFilter = THREE.LinearFilter;
backgroundTexture.needsUpdate = true;

scene.background = backgroundTexture; */
scene.background = new THREE.Color(0x00ffff)

let background = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(new CANNON.Vec3(0, 0, -0.5)) })

world.addBody(background)

// car
car.three.position.z = car.three.position.z = 2
car.three.castShadow = true
scene.add(car.three);
world.addBody(car.cannon);

console.log(car.three)

// wall

let wall = []

let x = -300, y = -110, z = 0

for (let i = 0; i < 10; i++) {
  y += 13
  for (let j = 0; j < 10; j++) {
    z += 9
    let brick = createBrick(x, y, z)
    brick.cannon.angularDamping = 0.3
    brick.cannon.linearDamping = 0.3
    brick.three.castShadow = true
    wall.push(brick)
    scene.add(brick.three);
    world.addBody(brick.cannon);
  }
  z = 0
}

// lights

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 0.6);
light.position.set(100, -300, 400);
scene.add(light);

// camera

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  50,
  800
);
camera.position.set(0, 200, 300);
camera.lookAt(car.three.position.x, car.three.position.y, car.three.position.z);

// renderer

let AA = true
if (window.devicePixelRatio > 1) {
  AA = false
}

const renderer = new THREE.WebGLRenderer({ antialias: AA, powerPreference: "high-performance" });
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
  isRightKeyDown = false,
  isSpaceKeyDown = false

window.addEventListener("keydown", key => {
  if (key.key === "ArrowRight" && car.three.position.z <= 4) isRightKeyDown = true;
  else if (key.key === "ArrowUp" && car.three.position.z <= 4) isUpKeyDown = true;
  else if (key.key === "ArrowLeft" && car.three.position.z <= 4) isLeftKeyDown = true;
  else if (key.key === "ArrowDown" && car.three.position.z <= 4) isDownKeyDown = true;
  else if (key.key === " " && car.three.position.z <= 4) isSpaceKeyDown = true;
});

window.addEventListener("keyup", key => {
  if (key.key === "ArrowRight") isRightKeyDown = false;
  else if (key.key === "ArrowUp") isUpKeyDown = false;
  else if (key.key === "ArrowLeft") isLeftKeyDown = false;
  else if (key.key === "ArrowDown") isDownKeyDown = false;
  else if (key.key === " ") isSpaceKeyDown = false
});

const stdAngleDiff = 0.05,
  stdForward = 20,
  target = {
    position: { ...car.cannon.position },
    rotation: car.three.rotation.clone()
  },
  sycn = array => {
    array.map(element => {
      element.three.quaternion.w = element.cannon.quaternion.w;
      element.three.quaternion.x = element.cannon.quaternion.x;
      element.three.quaternion.y = element.cannon.quaternion.y;
      element.three.quaternion.z = element.cannon.quaternion.z;

      element.three.position.x = element.cannon.position.x;
      element.three.position.y = element.cannon.position.y;
      element.three.position.z = element.cannon.position.z;
    })
  }

const calculateMovement = () => {

  let H = 0, angleDiff = 0

  if (isUpKeyDown) H += stdForward
  else if (isDownKeyDown) H -= stdForward
  if (isLeftKeyDown) angleDiff -= stdAngleDiff
  else if (isRightKeyDown) angleDiff += stdAngleDiff

  const angle =  car.cannon.angularVelocity.z + angleDiff;

  // Editing cannon.js values
  world.step(1 / 30);

  /* car.cannon.quaternion.copy(target.quaternion.setFromEuler(new THREE.Euler(0, 0, angle))) */

  const finalPosition = {
    x: car.cannon.position.x + -1 * H * Math.cos(angle),
    y: car.cannon.position.y + -1 * H * Math.sin(angle)
  };

  console.log(JSON.stringify(finalPosition, null, 2))

  car.cannon.angularVelocity.z = angle

  car.cannon.velocity.x = finalPosition.x
  car.cannon.velocity.y = finalPosition.y

  // making values sync
  sycn([car, ...wall])

  // changing camera's position
  camera.position.set(car.three.position.x, car.three.position.y + 200, car.three.position.z + 300)
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
