// lighting.js
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// 🌞 Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

// 💡 Movable Spot Light (attached to camera)
const movableSpotLight = new THREE.PointLight(0x4ecdc4, 1.0);
movableSpotLight.penumbra = 0.2;
movableSpotLight.decay = 2;
movableSpotLight.distance = 50;
movableSpotLight.castShadow = true;
movableSpotLight.intensity = 5;
movableSpotLight.toneMapping = 2;

// 🧱 Lighting Setup Function
export function setupLighting(scene, renderer) {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
    scene.add(ambientLight);

    // Directional Light
    scene.add(directionalLight);

    // Point Light
    const pointLight = new THREE.PointLight(0xff6b6b, 0.5);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    // Spot Light
    const spotLight = new THREE.SpotLight(0x4ecdc4, 0.5);
    spotLight.position.set(5, 8, 5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    scene.add(spotLight);

    // 🌐 Environment HDRI
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const hdriLoader = new RGBELoader();
    hdriLoader.setPath('./assets/').load('backdrop.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        texture.dispose();
        scene.environment = envMap;
        scene.environmentIntensity = 1;
    });
}

export function lightControls(actions) {
  if (!actions || !directionalLight) {
    console.warn("⚠️ Missing actions or light reference in lightControls");
    return;
  }

  directionalLight.position.set(
    actions.lightPos.x,
    actions.lightPos.y,
    actions.lightPos.z
  );
}

// 🧭 Export lights for external use
export { directionalLight, movableSpotLight };
