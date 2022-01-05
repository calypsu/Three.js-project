let scene = new THREE.Scene()

// the car of player

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
    const car = new THREE.Group()

    const backwheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(9, 23, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    )

    backwheel.position.z = 6
    backwheel.position.x = -18

    car.add(backwheel)

    const frontwheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(9, 23, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    )

    frontwheel.position.z = 6
    frontwheel.position.x = 18

    car.add(frontwheel)

    const body = new THREE.Mesh(
        new THREE.BoxBufferGeometry(50, 20, 15),
        new THREE.MeshLambertMaterial({ color: 0xa52523 })
    )

    body.position.z = 12

    car.add(body)

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
        new THREE.MeshLambertMaterial({ color: 0xffffff }) // bottom
    ]);

    cabin.position.z = 20
    cabin.position.x = 10

    car.add(cabin)

    return car
}

let car = playercar()

scene.add(car)

// lights

scene.background = new THREE.Color( 0xfffff0 );

scene.add(new THREE.AmbientLight(0xffffff, 0.6))

const light = new THREE.DirectionalLight(0xffffff, 0.6)
light.position.set(100, -300, 400)
scene.add(light)

// camara

const cameraWidth = 850
const cameraHight = cameraWidth / (window.innerWidth / window.innerHeight)

const camara = new THREE.OrthographicCamera(cameraWidth / -2, cameraWidth / 2, cameraHight / 2, cameraHight / -2, 0, 1000)
camara.position.set(0, 200, 300)
camara.lookAt(0, 0, 0)

/* const camara = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0, 1000 ); */

// floor

/* scene.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(cameraWidth, cameraHight + 2), new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )))*/
// renderer

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camara)

document.body.appendChild(renderer.domElement)

window.addEventListener("keydown", key => {
    if (key.keyCode === 39) {
        car.position.x = car.position.x + 1
        scene.add(car)
        renderer.render(scene, camara)
    }
    if (key.keyCode === 37) {
        car.position.x = car.position.x - 1
        scene.add(car)
        renderer.render(scene, camara)
    }
});