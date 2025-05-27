import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
/**
 * Base
 */
// Debug
const gui = new GUI();
const guiObject = {
    donutSpeed: 0.3
};

// Canvas
const canvas = document.getElementById("webglcanvas");
// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;
const donutMatcapTexture = textureLoader.load("/textures/matcaps/11.png");
donutMatcapTexture.colorSpace = THREE.SRGBColorSpace;

const textFancyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffff00,
});
textFancyMaterial.metalness = 1;
textFancyMaterial.roughness = 1;



gui.add(guiObject, "donutSpeed").min(0).max(1).step(0.01);

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/keep_on_truckin.json", (font) => {
    const textGeometry = new TextGeometry("Hello Three.js", {
        font,
        size: 0.5,
        depth: 0.1,
        curveSegments: 9,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 3,
    });

    textGeometry.center();
    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // );

    const textMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
    });

    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.set(1, 5, 1);
scene.add(pointLight);


/**
 * Object
 */

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 48)
const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: donutMatcapTexture,
});
const donutBasicMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
});

const donuts = [];

console.time('donuts');
for (let i = 0; i < 1000; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);
    donut.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 16,
        (Math.random() * 4 + 1) * (Math.random() > 0.5 ? 1 : -1),
    )
    donut.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        0.0
    );

    const s = Math.random() + 0.1;
    donut.scale.set(s, s, s);
    scene.add(donut);
    donuts.push(donut);
}
console.timeEnd('donuts');
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    for (let i = 0; i < donuts.length; i++) {
        const donut = donuts[i];
        donut.rotation.y = elapsedTime * Math.sin(i);
        donut.rotation.x = elapsedTime * Math.cos(i);
        donut.position.y -= deltaTime * guiObject.donutSpeed;
        if (donut.position.y < -8) {
            donut.position.y = 8;
        }
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
