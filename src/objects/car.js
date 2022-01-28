import * as THREE from "three";
import * as CANNON from "cannon-es";

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

const car = {
    three: new THREE.Group(),
    cannon: new CANNON.Body({ mass: 1496 }),
};
const backwheel = {
    three: new THREE.Mesh(
        new THREE.BoxBufferGeometry(9, 23, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    ),
    cannon: new CANNON.Box(new CANNON.Vec3(9 / 2, 23 / 2, 12 / 2)),
};

backwheel.three.position.z = 6;
backwheel.three.position.x = -18;

car.three.add(backwheel.three);
car.cannon.addShape(backwheel.cannon, { x: -18, y: 0, z: 6 });

const frontwheel = {
    three: new THREE.Mesh(
        new THREE.BoxBufferGeometry(9, 23, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    ),
    cannon: new CANNON.Box(new CANNON.Vec3(9 / 2, 23 / 2, 12 / 2)),
};

frontwheel.three.position.z = 6;
frontwheel.three.position.x = 18;

car.three.add(frontwheel.three);
car.cannon.addShape(backwheel.cannon, { x: 18, y: 0, z: 6 });

const body = {
    three: new THREE.Mesh(
        new THREE.BoxBufferGeometry(50, 20, 15),
        new THREE.MeshLambertMaterial({ color: 0xa52523 })
    ),
    cannon: new CANNON.Box(new CANNON.Vec3(50 / 2, 20 / 2, 15 / 2)),
};

body.three.position.z = 12;

car.three.add(body.three);
car.cannon.addShape(body.cannon, { x: 0, y: 0, z: 12 });

const carFrontTexture = getCarFrontTexture();
carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
carFrontTexture.rotation = Math.PI / 2;

const carBackTexture = getCarFrontTexture();
carBackTexture.center = new THREE.Vector2(0.5, 0.5);
carBackTexture.rotation = -Math.PI / 2;

const carLeftSideTexture = getCarSideTexture();
carLeftSideTexture.flipY = false;

const carRightSideTexture = getCarSideTexture();

const cabin = {
    three: new THREE.Mesh(new THREE.BoxBufferGeometry(26, 14, 20), [
        new THREE.MeshLambertMaterial({ map: carFrontTexture }),
        new THREE.MeshLambertMaterial({ map: carBackTexture }),
        new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
        new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
    ]),
    cannon: new CANNON.Box(new CANNON.Vec3(26 / 2, 14 / 2, 20 / 2)),
};

cabin.three.position.z = 20;
cabin.three.position.x = 10;

car.three.add(cabin.three);
car.cannon.addShape(cabin.cannon, { x: 10, y: 0, z: 20 });

export default car