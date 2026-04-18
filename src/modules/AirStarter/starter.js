// starter.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { circlePointer, oilFill } from './starterFunction.js';
// import { extractMeshes, dumpObject, toggleWireframeMode, resetCamera, crossfadeBackgroundAndModel, focusOnObject, ToEul, displayToolTip, hideToolTip, updateTooltips, highlightMesh, resetMesh, loadInfoData, showInfoPanel } from '../../helper.js';
import { extractMeshes, dumpObject, toggleWireframeMode, resetCamera, crossfadeBackgroundAndModel, focusOnObject, ToEul, highlightMesh, resetMesh, loadInfoData, showInfoPanel } from '../../helper.js';
import { lightControls } from '../../lighting.js'
import { setupViewerGUI } from './guiSetup.js';
import { createArrow } from '../../arrow.js'
import { createLabel } from '../../labels.js'
// import { initGUI } from './gui.js';

export default class Starter {
  constructor(scene, camera, renderer, controls, objects) {
    console.log('starter class in action');
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.objects = objects || [];
    this.tooltipElements = [];
    this.originalMaterials = new Map();
    this.toggleCircle = false;
    this.toggleGTF = false;
    this.wireframes = [];
    this.solidMeshes = [];
    this.wireframeColor = 0xffffff;
    this.raycasterEnabled = false;
    this.infoData = [];

    this.createObjects();

    // 🧩 Link external animation functions
    this.circlePointer = (id) => circlePointer(this, id);
    this.oilFill = () => oilFill(this);

    this.toggleWireframeMode = () => toggleWireframeMode(this);
    this.resetCamera = () => resetCamera(this);

    this.lightControls = () => lightControls(this.actions, this.directionalLight);

    this.crossfadeBackgroundAndModel = () => crossfadeBackgroundAndModel(this);
    this.focusOnObject = (obj, zoom) => focusOnObject(this, obj, zoom);
    // this.displayToolTip = (availableTooltips) => displayToolTip(this, availableTooltips);
    // this.hideToolTip = () => hideToolTip(this);
    // this.updateTooltips = () => updateTooltips(this);
    this.ToEul = (deg) =>{ToEul(deg)}
    this.showInfoPanel = (obj) => showInfoPanel(this,obj)
    this.createArrow = (scale = 1, color = 0xA98B2D) => createArrow(scale, color);
    this.createLabel = (text, position, scene) => createLabel(text, position, scene);
    this.guiControls = setupViewerGUI(this);
    this.loadInfoData = () => loadInfoData(this)
    this.shoshowInfoPanel = (obj) =>showInfoPanel(this,obj)
  }

createObjects() {
  // Optional ground plane
  const planeGeometry = new THREE.PlaneGeometry(20, 20);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -5;
  plane.receiveShadow = true;
  // this.scene.add(plane);

  // ✅ Load the background image safely
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('../../../assets/complete engine.jpg', (texture) => {
    this.backgroundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 50),
      new THREE.MeshBasicMaterial({ map: texture })
    );

    this.backgroundMesh.position.set(0, 0, -50);
    this.backgroundMesh.renderOrder = -1;
    this.backgroundMesh.material.depthTest = true;
    this.backgroundMesh.material.depthWrite = true;
    this.backgroundMesh.material.transparent = true;

    try {
      // ✅ Try adding to camera first
      if (this.camera && typeof this.camera.add === 'function') {
        this.camera.add(this.backgroundMesh);
        console.log('✅ Background attached to camera');
      } else {
        console.warn('⚠️ Camera not ready or add() not available, adding to scene instead');
        this.scene.add(this.backgroundMesh);
      }

      // Ensure camera is in scene if not already
      if (this.scene && this.camera && !this.scene.children.includes(this.camera)) {
        this.scene.add(this.camera);
      }

    } catch (err) {
      console.error('❌ Error attaching background:', err);
      this.scene.add(this.backgroundMesh);
    }

    // Continue with model loading
    this.createModel();
  });
}

  createModel() {
    const spinner_container = document.getElementById('spinner-border')
    const loader = new GLTFLoader();
    loader.setCrossOrigin('anonymous');
    loader.setPath('../../../Full Engine/');

    loader.load(
      'ENGINE PROJECT.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(5.6, 5.6, 5.6);
        model.position.y = -9.2;
        model.translateX(-4);
        model.translateZ(-6.2);

        gsap.to(model.rotation, {
          y: 1.8,
          duration: 0,
          ease: 'power2.inOut',
        });

        this.scene.add(model);
        model.updateMatrixWorld(true);

        console.log('✅ Model loaded:', model);
        console.log(dumpObject(model).join('\n'));
        // spinner_container.style.visibility='hidden'

        const meshList = extractMeshes(model);
        this.infoData = this.loadInfoData?.() || [];

        meshList.forEach((obj) => {
          this.objects.push(obj);
          this.crossfadeBackgroundAndModel();

          const edges = new THREE.EdgesGeometry(obj.geometry, 8.0);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: this.wireframeColor,
          });
          const wireframe = new THREE.LineSegments(edges, lineMaterial);

          const solidMaterial = new THREE.MeshBasicMaterial({
            color: 0xb5b5b5,
            transparent: true,
            opacity: 0.7,
          });
          const solidMesh = new THREE.Mesh(obj.geometry, solidMaterial);

          obj.updateMatrixWorld(true);
          solidMesh.applyMatrix4(obj.matrixWorld);

          wireframe.userData = { name: `${obj.userData.name}_wireframe` };
          solidMesh.userData = { name: `${obj.userData.name}_solidmesh` };
          wireframe.visible = false;
          solidMesh.visible = false;
          wireframe.name = obj.name;
          solidMesh.name = obj.name;

          solidMesh.add(wireframe);
          this.scene.add(solidMesh);

          this.wireframes.push(wireframe);
          this.solidMeshes.push(solidMesh);
        });

        console.log('Mesh count:', meshList.length);
        this.raycasterEnabled = true;
      },
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (error) => {
        console.error('❌ Error loading GLTF:', error);
      }
    );
  }


}
