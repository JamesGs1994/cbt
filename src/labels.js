// createLabel.js
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const loader = new FontLoader();

export function createLabel(text, position, scene) {
  return new Promise((resolve) => {
    loader.load('/node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeo = new TextGeometry(text, { font, size: 0.06, height: 0, depth: 0.01 });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeo, textMaterial);

      textMesh.position.copy(position.clone().add(new THREE.Vector3(0, 0.03, 0)));
      scene.add(textMesh);
      resolve(textMesh);
    });
  });
}
