// helper.js
import * as THREE from 'three';
import { gsap } from 'gsap';


// export function extractMeshes(object) {
//   const meshes = [];
//   object.traverse((child) => {
//     if (child.isMesh) meshes.push(child);
//   });
export function extractMeshes(object) {
  const meshes = [];
  object.traverse((child) => {
    if (child.isMesh || child.isSkinnedMesh) meshes.push(child);
  });

  return meshes;
}

export function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${localPrefix}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const children = obj.children || [];
  children.forEach((child, i) =>
    dumpObject(child, lines, i === children.length - 1, newPrefix)
  );
  return lines;
}


// --------------------- MODE CONTROLS ---------------------
export function toggleWireframeMode(viewer) {
  viewer.isWireframeMode = !viewer.isWireframeMode;

  const toggleButton = document.getElementById('toggle-mode');
  const modeIndicator = document.getElementById('current-mode');
  const body = document.body;

  if (viewer.isWireframeMode) {
    viewer.scene.background = new THREE.Color(0x1a237e);
    viewer.objects.forEach(obj => (obj.visible = false));
    viewer.wireframes.forEach(wf => (wf.visible = true));
    viewer.solidMeshes.forEach(m => (m.visible = true));

    // modeIndicator.textContent = 'Engineering Drawing Mode';
    // modeIndicator.style.color = 'yellow';
    // modeIndicator.className = 'status status--success';
    // body.classList.add('engineering-mode');
  } else {
    viewer.scene.background = new THREE.Color(0x363737);
    viewer.objects.forEach(obj => (obj.visible = true));
    viewer.wireframes.forEach(wf => (wf.visible = false));
    viewer.solidMeshes.forEach(m => (m.visible = false));

    // toggleButton.textContent = 'Switch to X-Ray View';
    // modeIndicator.textContent = 'Realistic Mode';
    // modeIndicator.style.color = 'grey';
    // modeIndicator.className = 'status status--info';
    // body.classList.remove('engineering-mode');
  }
}

export function updateWireframeColor(viewer, color) {
  viewer.wireframeColor = color;
  viewer.wireframes.forEach(wireframe => {
    wireframe.material.color.setHex(parseInt(color.replace('#', '0x')));
  });
}

export function resetCamera(viewer) {
  viewer.camera.position.set(8, 6, 8);
  viewer.controls.reset();
}

export function highlightMesh(viewer, mesh) {
  if (!viewer.originalMaterials.has(mesh)) {
    viewer.originalMaterials.set(mesh, mesh.material);
  }
  if (!viewer.matcapTexture) {
    viewer.matcapTexture = new THREE.TextureLoader().load('./assets/matcaps/test19.png');
  }
  mesh.material = new THREE.MeshMatcapMaterial({
    matcap: viewer.matcapTexture,
    side: THREE.DoubleSide,
    opacity: 1,
    transparent: false
  });
}

export function resetMesh(viewer, mesh) {
  if (viewer.originalMaterials.has(mesh)) {
    mesh.material = viewer.originalMaterials.get(mesh);
  }
}

export async function loadInfoData(viewer) {
  const moduleName = viewer.starter?.constructor.name.replace(/[^a-zA-Z0-9]/g, '') || 'Unknown';
  const jsonPath = `./objectInfo.json`;

  try {
    // console.log("📂 Fetching:", jsonPath);
    const res = await fetch(jsonPath);
    // console.log("📄 Fetch status:", res.status);

    if (!res.ok) throw new Error(`File not found: ${jsonPath}`);

    const data = await res.json();
    viewer.infoData = data;
    // console.log("✅ info data:", viewer.infoData); // <- now this will print the array

    return data;
  } catch (err) {
    console.warn(`⚠️ No info.json found for ${moduleName}:`, err.message);
    viewer.infoData = [];
  }
}

export function showInfoPanel(viewer, obj) {
  console.log(obj.name+' called')
  const tooltip = document.getElementById('tooltip');
  const tooltipTitle = document.getElementById('tool-tip-title');
  const tooltipVideo = document.getElementById('tool-tip-video');
  const tooltipDesc = document.getElementById('tool-tip-description');
  if (!tooltip || !tooltipTitle || !tooltipVideo || !viewer.infoData) return;

  const info = viewer.infoData.find(item => item.name === obj.name);
  if (!info) return;

  tooltipTitle.textContent = info.title || obj.name;
  tooltipDesc.innerHTML = `
    <span style="font-weight:bold;color:#ffc400ff">Purpose:</span> ${info.description.purpose}<br><br>
    <span style="font-weight:bold;color:#ffc400ff">Location:</span> ${info.description.Location}<br><br>
    <span style="font-weight:bold;color:#ffc400ff">Description:</span> ${info.description.Description}<br><br>
    <span style="font-weight:bold;color:#ffc400ff">Operation:</span> ${info.description.Operation}
  `;

  if (info.video) tooltipVideo.src = info.video;
  tooltip.classList.add('visible');

}

export function crossfadeBackgroundAndModel(starter) {
  starter.objects.forEach((obj) => {
    if (!obj.material) return;
    obj.material.transparent = true;
    obj.material.opacity = 0;

    gsap.to(obj.material, {
      opacity: 1,
      duration: 3,
      ease: 'power3.inOut',
      onComplete: () => {
        if (obj.name === 'STARTER_ctrl_1') {
          starter.focusOnObject(obj, 3.5);
        }
        if (obj.name === 'DIFFUSER_OUTTER_CASE') {
          starter.focusOnObject(obj, 2.5);
        }
      },
    });
});

  // Fade out background
  if (starter.backgroundMesh) {
    starter.backgroundMesh.material.transparent = true;
    starter.backgroundMesh.material.opacity = 1;

    gsap.to(starter.backgroundMesh.material, {
      opacity: 0,
      duration: 3,
      ease: 'power3.inOut',
      onComplete: () => {
        if (starter.guiControls?.airStarterBtn) {
          starter.guiControls.airStarterBtn.enable();
          // console.log("✅ Air Starter button enabled");
        }
        if (starter.guiControls?.ignitionBtn) {
          console.log('called')
          starter.guiControls.ignitionBtn.enable();
          // console.log("✅ Air Starter button enabled");
        }
      },
    });
  }
}

export function focusOnObject(viewer, object, zDepth = 1.2) {
  if (!object) {
    console.warn("focusOnObject: object not found");
    return;
  }

  object.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = viewer.camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * zDepth;

  const dir = new THREE.Vector3()
    .subVectors(viewer.camera.position, viewer.controls.target)
    .normalize();

  const newPos = center.clone().add(dir.multiplyScalar(cameraZ));

  // Animate camera position
  gsap.to(viewer.camera.position, {
    duration: 1.5,
    x: newPos.x,
    y: newPos.y,
    z: newPos.z,
    onUpdate: () => viewer.controls.update(),
    onComplete: () => {
      viewer.camera.lookAt(center);
      viewer.controls.target.copy(center);
      viewer.controls.update();
    }
  });

  // Animate target
  gsap.to(viewer.controls.target, {
    duration: 1.5,
    x: center.x,
    y: center.y,
    z: center.z,
    onUpdate: () => viewer.controls.update(),
  });

  viewer.camera.near = Math.max(0.01, cameraZ / 100);
  viewer.camera.far = cameraZ * 10;
  viewer.camera.updateProjectionMatrix();
}


export function ToEul(deg){
    return (Math.PI / 180) * deg;
}

// --------------------- MOUSE HOVER TOOLTIP ---------------------
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let hoveredObject = null;
let tooltipDiv = null;

/**
 * Initializes a lightweight mouse-hover tooltip system.
 * Call this once from main.js after setting up the viewer and renderer.
 */
export function initMouseTooltip(viewer) {
  // Create tooltip element only once
  tooltipDiv = document.createElement('div');
  tooltipDiv.style.cssText = `
    position: absolute;
    padding: 5px 8px;
    background: rgba(255, 255, 255, 0.85);
    color: #000;
    border-radius: 5px;
    border: 1px solid #333;
    font-size: 13px;
    pointer-events: none;
    white-space: nowrap;
    display: none;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    transition: opacity 0.15s ease-out;
    z-index: 9999;
  `;
  tooltipDiv.id = 'hoverTooltip';
  document.body.appendChild(tooltipDiv);

  // Mouse move handler
  viewer.renderer.domElement.addEventListener('mousemove', (event) => {

    if (!tooltipModeActive) return;

    const rect = viewer.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, viewer.camera);

    const intersects = raycaster.intersectObjects(viewer.objects || [], true);

    if (intersects.length > 0) {
      const intersected = intersects[0].object;

      // Show tooltip when hovering a new object
      if (hoveredObject !== intersected) {
        hoveredObject = intersected;
        tooltipDiv.textContent = intersected.name || 'Unnamed Object';
        tooltipDiv.style.display = 'block';
        tooltipDiv.style.opacity = '1';
      }

      // Position tooltip near mouse
      tooltipDiv.style.left = `${event.clientX + 12}px`;
      tooltipDiv.style.top = `${event.clientY + 12}px`;

      // Highlight the mesh while hovered
      // highlightMesh(viewer, intersected);
    } else {
      hideHoverTooltip(viewer);
    }
  });

  // Hide tooltip when mouse leaves canvas
  viewer.renderer.domElement.addEventListener('mouseleave', () => hideHoverTooltip(viewer));
}

function hideHoverTooltip(viewer) {
  if (tooltipDiv) {
    tooltipDiv.style.opacity = '0';
    tooltipDiv.style.display = 'none';
  }
  if (hoveredObject) resetMesh(viewer, hoveredObject);
  hoveredObject = null;
}

export let tooltipModeActive = false;

export function toggleTooltipMode(isActive) {
  tooltipModeActive = isActive;
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;

  if (isActive) {
    tooltip.classList.add('active');
  } else {
    tooltip.classList.remove('active', 'visible'); // instantly hide
  }
}