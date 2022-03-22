import * as THREE from "three";
import * as CANNON from "cannon-es";

let createBrick = (x, y, z) => {
  let brick = {
    three: new THREE.Mesh(
      new THREE.BoxBufferGeometry(5, 10, 5),
      new THREE.MeshLambertMaterial({ color: "#FFFFFF" })
    ),
    cannon: new CANNON.Body({
      mass: 2,
      shape: new CANNON.Box(new CANNON.Vec3(5 / 2, 10 / 2, 5 / 2)),
    })
  };
  
  brick.cannon.position.set(x, y, z);
  
  brick.three.position.x = x;
  brick.three.position.y = y;
  brick.three.position.z = z;

  return brick
}

export default createBrick