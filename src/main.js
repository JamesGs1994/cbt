// ---------------------- Imports ----------------------
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { movableSpotLight, setupLighting } from './lighting.js';
import {
  toggleWireframeMode,
  resetCamera,
  // updateTooltips,
  loadInfoData,
} from './helper.js';
import { initMouseTooltip } from './helper.js';

const clock = new THREE.Clock();

// ---------------------- Main Class ----------------------
class WireframeViewer {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x373737);

    this.camera = null;
    this.renderer = null;
    this.controls = null;

    // Object containers
    this.objects = [];
    this.wireframes = [];
    this.solidMeshes = [];
    this.tooltipElements = [];
    this.originalMaterials = new Map();

    // Flags
    this.isWireframeMode = false;
    this.isExploded = false;
    this.isRotateFan = false;
    // this.raycasterEnabled = false;
    this.toggleCircle = false;

    this.wireframeColor = '#3C3C3C';
    this.mouse = new THREE.Vector2();
    // this.raycaster = new THREE.Raycaster();

    // Initialize base 3D setup
    this.initCore();

    // Dynamic module loader
    this.loadModuleMenu();

    // Event listeners & animation
    this.setupEventListeners();
    this.animate();
  }

  // ------------------ Core Setup ------------------
  initCore() {
    const canvas = document.getElementById('three-canvas');

    // Camera
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 10);
    this.camera.add(movableSpotLight);
    this.scene.add(this.camera);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    // const axesHelper = new THREE.AxesHelper(5);
    // this.scene.add(axesHelper);

    setupLighting(this.scene, this.renderer);
    initMouseTooltip(this);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 40; // Maximum distance from the target
    // this.controls.minDistance = 5; // Minimum distance from the target

    // this.controls.minPolarAngle = Math.PI / 4;  // Lower vertical limit (45°)
    // this.controls.maxPolarAngle = Math.PI / 4;  // Upper vertical limit (90°)

    // this.controls.minAzimuthAngle = -Math.PI / 4; // Left horizontal limit (-45°)
    // this.controls.maxAzimuthAngle = Math.PI / 4;  // Right horizontal limit (+45°)

    // Handle resizing
    window.addEventListener('resize', () => this.onWindowResize());
  }

  // ------------------ Dynamic Module Loader ------------------
  async loadModule(moduleName) {
    console.log(`Loading module: ${moduleName}`);

    // Clear existing scene (optional, for switching)
    this.objects.forEach(obj => this.scene.remove(obj));
    this.tooltipElements.forEach(t => t.element?.remove());
    this.objects = [];
    this.tooltipElements = [];

    // 🔹 Dynamically import selected module
    const { default: Starter } = await import(`./modules/${moduleName}/starter.js`);
    const { setupViewerGUI } = await import(`./modules/${moduleName}/guiSetup.js`);

    // GUI setup
    const { gui } = setupViewerGUI(this);
    this.gui = gui;

    // Initialize starter (loads models, animations, etc.)
    this.starter = new Starter(this.scene, this.camera, this.renderer, this.controls, this.objects, this);
    this.tooltipElements = this.starter.tooltipElements;

    // Load info
    await loadInfoData(this,moduleName);

    console.log(`${moduleName} module loaded successfully.`);
  }

  // ------------------ Menu for module selection ------------------
  loadModuleMenu() {
    const menu = document.getElementById('module-menu');
    if (!menu) return;

    menu.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected) this.loadModule(selected);
    });
  }

  // ------------------ Events ------------------
  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggleWireframeMode(this);
          break;
        case 'KeyR':
          e.preventDefault();
          resetCamera(this);
          break;
      }
    });
  }

  // ------------------ Resize ------------------
  onWindowResize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // ------------------ Animation Loop ------------------
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = clock.getDelta();
    if (this.ignitionAnim) this.ignitionAnim.update(delta);

    this.controls.update();
    // updateTooltips(this);
    this.renderer.render(this.scene, this.camera);

  }
}

// ------------------ Initialize ------------------
window.addEventListener('DOMContentLoaded', () => {
  window.viewer = new WireframeViewer();

  const pathParts = window.location.pathname.split('/');
  const moduleName = pathParts[pathParts.length - 2] || 'AirStarter';

  console.log(`Detected module: ${moduleName}`);
  viewer.loadModule(moduleName);
  console.log('%cWireframe Viewer Loaded', 'color: #4ecdc4; font-weight: bold;');
  console.log('Space → Toggle Wireframe Mode');
  console.log('R → Reset Camera');
});
