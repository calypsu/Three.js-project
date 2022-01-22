import * as THREE from "three";
import * as CANNON from "cannon";

let box = {
    three: new THREE.Mesh(
      new THREE.BoxBufferGeometry(100, 100, 100),
      new THREE.MeshLambertMaterial({ color: 0x333333 })
    ),
    cannon: new CANNON.Body({
      mass: 6,
      shape: new CANNON.Box(new CANNON.Vec3(100 / 2, 100 / 2, 100 / 2)),
    }),
  };
  
  box.cannon.position.set(100, -100, 0);
  
  box.three.position.x = 100;
  box.three.position.y = -100;

export default box