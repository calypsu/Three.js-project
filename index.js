let scene = new THREE.Scene()

// backround

const topLeft = new THREE.Color(0x00fff0)
const topRight = new THREE.Color(0xffff00)
const bottomRight = new THREE.Color(0xfff000)
const bottomLeft = new THREE.Color(0xff0000)

const data = new Uint8Array([
    Math.round(bottomLeft.r * 255), Math.round(bottomLeft.g * 255), Math.round(bottomLeft.b * 255),
    Math.round(bottomRight.r * 255), Math.round(bottomRight.g * 255), Math.round(bottomRight.b * 255),
    Math.round(topLeft.r * 255), Math.round(topLeft.g * 255), Math.round(topLeft.b * 255),
    Math.round(topRight.r * 255), Math.round(topRight.g * 255), Math.round(topRight.b * 255)
])

const backgroundTexture = new THREE.DataTexture(data, 2, 2, THREE.RGBFormat)
backgroundTexture.magFilter = THREE.LinearFilter
backgroundTexture.needsUpdate = true

scene.background = backgroundTexture

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

scene.add(new THREE.AmbientLight(0xffffff, 0.6))

const light = new THREE.DirectionalLight(0xffffff, 0.6)
light.position.set(100, -300, 400)
scene.add(light)

// camera

const cameraWidth = 850
const cameraHight = cameraWidth / (window.innerWidth / window.innerHeight)

const camera = new THREE.OrthographicCamera(cameraWidth / -2, cameraWidth / 2, cameraHight / 2, cameraHight / -2, 0, 1000)
camera.position.set(0, 400, 300)
camera.lookAt(car.position.x, car.position.y, car.position.z)
/* const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0, 1000 );
camera.position.set(0, 200, 300)
camera.lookAt(car.position.x, car.position.y, car.position.z) */

// renderer

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.render(scene, camera)

document.body.appendChild(renderer.domElement) 

// making it resposive

window.addEventListener("resize", () => {window.location.reload(true)})

/* window.addEventListener('resize', () =>
{
    // Update sizes
    window.innerWidth = window.innerWidth
    window.innerHeight = window.innerHeight

    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}) */


//car movment logic

const target = car.position.clone()

window.addEventListener("keydown", key => {
    if (key.keyCode === 39) {
        target.x += 20
    }
    if (key.keyCode === 37) {
        target.x -= 20
    }
});

renderer.setAnimationLoop(() => {
    car.position.lerp(target, 0.1)

    renderer.render(scene, camera)
})