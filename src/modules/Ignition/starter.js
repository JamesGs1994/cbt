// ignitionLoader.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { IgnitionAnimation } from './ignitionAnimation.js';
import { gsap } from 'gsap';
import { circlePointer } from './ignitionFunction.js';
// import { extractMeshes, dumpObject, toggleWireframeMode, resetCamera, crossfadeBackgroundAndModel, focusOnObject, ToEul, displayToolTip, hideToolTip, updateTooltips, highlightMesh, resetMesh, loadInfoData, showInfoPanel } from '../../helper-old.js';
import { extractMeshes, dumpObject, toggleWireframeMode, resetCamera, crossfadeBackgroundAndModel, focusOnObject, ToEul, highlightMesh, resetMesh, loadInfoData, showInfoPanel } from '../../helper.js';
import { lightControls } from '../../lighting.js'
import { setupViewerGUI } from './guiSetup.js';
import { createArrow, createCurvedArrow } from '../../arrow.js'
import { createLabel } from '../../labels.js'
// import { OutlineEffect } from 'three/examples/jsm/Addons.js';
// import { initGUI } from './gui.js';

export default class Starter {
  constructor(scene, camera, renderer, controls, objects) {
    console.log('starter class in action');
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.objects = objects || [];
    this.parent = parent;
    this.tooltipElements = [];
    this.originalMaterials = new Map();
    this.toggleCircle = false;
    this.toggleGTF = false;
    this.wireframes = [];
    this.solidMeshes = [];
    this.wireframeColor = 0xffffff;
    // this.raycasterEnabled = false;
    this.infoData = [];


    this.createObjects();

    // 🧩 Link external animation functions
    this.circlePointer = (id) => circlePointer(this, id);

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
    this.createCurvedArrow = (scale = 1, color = 0xA98B2D) => createCurvedArrow(scale, color);
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
  textureLoader.load('../../../assets/Ignition.jpg', (texture) => {
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

    this.createModel();
  });
}

  // createModel() {
  //   const spinner_container = document.getElementById('spinner-border')
  //   const loader = new GLTFLoader();
  //   loader.setCrossOrigin('anonymous');
  //   loader.setPath('../../../Full Engine/');

  //   loader.load(
  //     // 'IgnitionRemovalAnimation.glb',
  //     'chat Gpt Solution2 Textured.glb',
  //     (gltf) => {

  //       const wrenchArrow = gltf.scene.getObjectByName('Wrench_arrow');
  //       if (wrenchArrow) {
  //         gltf.scene.remove(wrenchArrow);
  //         wrenchArrow.traverse(obj => {
  //           if (obj.geometry) obj.geometry.dispose();
  //           if (obj.material) {
  //             if (Array.isArray(obj.material)) {
  //               obj.material.forEach(m => m.dispose());
  //             } else obj.material.dispose();
  //           }
  //         });
  //         console.log('Removed Wrench_arrow');
  //       }
  //       const spanner_arrow = gltf.scene.getObjectByName('spanner_arrow');
  //       if (spanner_arrow) {
  //         gltf.scene.remove(spanner_arrow);
  //         spanner_arrow.traverse(obj => {
  //           if (obj.geometry) obj.geometry.dispose();
  //           if (obj.material) {
  //             if (Array.isArray(obj.material)) {
  //               obj.material.forEach(m => m.dispose());
  //             } else obj.material.dispose();
  //           }
  //         });
  //         console.log('Removed spanner_arrow');
  //       }

  //       const model = gltf.scene;
  //       model.scale.set(3, 3, 3);
  //       model.position.y = 0.1;
  //       model.translateX(-7.5);
  //       model.translateZ(-5);
  //       // model.scale.set(5.6, 5.6, 5.6);
  //       // model.position.y = -9.2;
  //       // model.translateX(-4);
  //       // model.translateZ(-6.2);

  //       gsap.to(model.rotation, {
  //         y: 0.4,
  //         x:-0.2,
  //         z:0.1,
  //         duration: 0,
  //         ease: 'power2.inOut',
  //       });

  //       this.scene.add(model);
  //       model.updateMatrixWorld(true);

  //       console.log('✅ Model loaded:', model);
  //       console.log(dumpObject(model).join('\n'));
        
  //       const meshList = extractMeshes(model);
  //       viewer.objects.push(...meshList);
  //       this.infoData = this.loadInfoData?.() || [];

  //       // console.log(gltf.animations)
  //       this.ignitionAnim = new IgnitionAnimation(gltf);
  //       window.viewer.ignitionAnim = this.ignitionAnim;

  //       meshList.forEach((obj) => {
  //         this.objects.push(obj);
  //         this.crossfadeBackgroundAndModel();
        
  //         const edges = new THREE.EdgesGeometry(obj.geometry, 8.0);
  //         const lineMaterial = new THREE.LineBasicMaterial({
  //           color: this.wireframeColor,
  //         });
  //         const wireframe = new THREE.LineSegments(edges, lineMaterial);

  //         const solidMaterial = new THREE.MeshBasicMaterial({
  //           color: 0xb5b5b5,
  //           transparent: true,
  //           opacity: 0.7,
  //         });
  //         const solidMesh = new THREE.Mesh(obj.geometry, solidMaterial);

  //         obj.updateMatrixWorld(true);
  //         solidMesh.applyMatrix4(obj.matrixWorld);

  //         wireframe.userData = { name: `${obj.userData.name}_wireframe` };
  //         solidMesh.userData = { name: `${obj.userData.name}_solidmesh` };
  //         wireframe.visible = false;
  //         solidMesh.visible = false;
  //         wireframe.name = obj.name;
  //         solidMesh.name = obj.name;

  //         solidMesh.add(wireframe);
  //         this.scene.add(solidMesh);

  //         this.wireframes.push(wireframe);
  //         this.solidMeshes.push(solidMesh);
  //       });

  //       console.log('Mesh count:', meshList.length);
  //       // this.raycasterEnabled = true;
  //     },
  //     (xhr) => {
  //       console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
  //     },
  //     (error) => {
  //       console.error('❌ Error loading GLTF:', error);
  //     }
  //   );
  // }
createModel() {
  const loader = new GLTFLoader();
  loader.setCrossOrigin('anonymous');
  loader.setPath('../../../Full Engine/');

  loader.load(
    // 'IgnitionRemovalAnimation.glb',
    'chat Gpt Solution2 Textured.glb',
    (gltf) => {
      // ---------------------- Remove unwanted arrows ----------------------
      const removeObjectByName = (name) => {
        const obj = gltf.scene.getObjectByName(name);
        if (obj) {
          gltf.scene.remove(obj);
          obj.traverse(o => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
              if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
              else o.material.dispose();
            }
          });
          console.log(`Removed ${name}`);
        }
      };

      removeObjectByName('Wrench_arrow');
      removeObjectByName('spanner_arrow');

      // ---------------------- Model Transform ----------------------
      const model = gltf.scene;
      model.scale.set(3, 3, 3);
      model.position.y = 0.1;
      model.translateX(-7.5);
      model.translateZ(-5);

      gsap.to(model.rotation, {
        y: 0.4,
        x: -0.2,
        z: 0.1,
        duration: 0,
        ease: 'power2.inOut',
      });

      this.scene.add(model);
      model.updateMatrixWorld(true);

      console.log('✅ Model loaded:', model);
      console.log(dumpObject(model).join('\n'));

      // ---------------------- Mesh Extraction ----------------------
      const meshList = extractMeshes(model);
      viewer.objects.push(...meshList);
      this.infoData = this.loadInfoData?.() || [];

      // ---------------------- Animation Reference ----------------------
      this.ignitionAnim = new IgnitionAnimation(gltf);
      window.viewer.ignitionAnim = this.ignitionAnim;

      // ---------------------- X-Ray Setup ----------------------
      meshList.forEach((obj) => {
        this.objects.push(obj);
        this.crossfadeBackgroundAndModel();

        // ✅ Handle SkinnedMesh separately
        if (obj.isSkinnedMesh) {
          // ---- Solid version ----
          const solidMaterial = new THREE.MeshBasicMaterial({
            color: 0xb5b5b5,
            transparent: true,
            opacity: 0.7,
            skinning: true,
          });

          const solidMesh = obj.clone();
          solidMesh.material = solidMaterial;
          solidMesh.visible = false;

          // ---- Wireframe version ----
          const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: this.wireframeColor,
            wireframe: true,
            skinning: true,
          });

          const wireframe = obj.clone();
          wireframe.material = wireframeMaterial;
          wireframe.visible = false;

          // 🧠 Important: Keep skeleton reference and world matrix exactly same
          solidMesh.bind(obj.skeleton, obj.bindMatrix);
          wireframe.bind(obj.skeleton, obj.bindMatrix);

          solidMesh.add(wireframe);

          // 🧩 Preserve hierarchy — don’t add to scene directly
          obj.parent.add(solidMesh);

          // Names and bookkeeping
          wireframe.userData = { name: `${obj.name}_wireframe` };
          solidMesh.userData = { name: `${obj.name}_solidmesh` };
          wireframe.name = obj.name;
          solidMesh.name = obj.name;

          this.wireframes.push(wireframe);
          this.solidMeshes.push(solidMesh);
        }

        // ✅ Normal Mesh (non-skinned)
        else {
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

          wireframe.userData = { name: `${obj.name}_wireframe` };
          solidMesh.userData = { name: `${obj.name}_solidmesh` };
          wireframe.visible = false;
          solidMesh.visible = false;
          wireframe.name = obj.name;
          solidMesh.name = obj.name;

          solidMesh.add(wireframe);
          this.scene.add(solidMesh);

          this.wireframes.push(wireframe);
          this.solidMeshes.push(solidMesh);
        }
      });

      console.log('Mesh count:', meshList.length);
      // this.raycasterEnabled = true;
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
