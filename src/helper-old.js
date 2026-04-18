// helper.js
import * as THREE from 'three';
import { gsap } from 'gsap';


export function extractMeshes(object) {
  const meshes = [];
  object.traverse((child) => {
    if (child.isMesh) meshes.push(child);
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

    modeIndicator.textContent = 'Engineering Drawing Mode';
    modeIndicator.style.color = 'yellow';
    modeIndicator.className = 'status status--success';
    body.classList.add('engineering-mode');
  } else {
    viewer.scene.background = new THREE.Color(0x363737);
    viewer.objects.forEach(obj => (obj.visible = true));
    viewer.wireframes.forEach(wf => (wf.visible = false));
    viewer.solidMeshes.forEach(m => (m.visible = false));

    toggleButton.textContent = 'Switch to X-Ray View';
    modeIndicator.textContent = 'Realistic Mode';
    modeIndicator.style.color = 'grey';
    modeIndicator.className = 'status status--info';
    body.classList.remove('engineering-mode');
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

// --------------------- TOOLTIP HANDLERS ---------------------
export function displayToolTip(viewer, availableTooltips) {
  if (viewer.toggleCircle) {
    console.log('display tool tip called')
    viewer.objects.forEach(obj => {
      if (availableTooltips.includes(obj.name)) {
        const element = document.createElement('div');
        element.style.cssText = `
          background-color: rgba(255,255,255,0.59);
          position: absolute;
          color: #000;
          border: 2px solid #2b2a2a;
          box-shadow: 2px 2px #0000002d;
          width: max-content;
          text-align: center;
          border-radius: 8px;
          cursor: pointer;
          padding: 5px 10px;
        `;
        element.classList.add('tooltips');
        element.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><span>${obj.name}</span></div>`;
        document.body.appendChild(element);
        console.log('Tooltip added to DOM:', document.body.contains(element));
        element.addEventListener('mouseenter', () => highlightMesh(viewer, obj));
        element.addEventListener('mouseleave', () => resetMesh(viewer, obj));
        element.addEventListener('click', () => showInfoPanel(viewer, obj));
        
        viewer.tooltipElements.push({ obj, element, line: null });
      }
    });
  }
}

export function hideToolTip(viewer) {
  viewer.tooltipElements.forEach(({ element, line }) => {
    if (element?.parentNode) element.remove();
    if (line) {
      viewer.scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
    }
  });
  viewer.tooltipElements = [];
}

export function updateTooltips(viewer) {
  if (!viewer.tooltipElements || viewer.tooltipElements.length === 0) return;

  const canvas = viewer.renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  const camera = viewer.camera;
  const scene = viewer.scene;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4; // Dynamic radius

  viewer.tooltipElements.forEach((tooltip, index) => {
    const { obj, element } = tooltip;
    if (!obj || !obj.visible) {
      element.style.display = 'none';
      if (tooltip.line) {
        scene.remove(tooltip.line);
        tooltip.line = null;
      }
      return;
    }

    // Get object screen position
    const objWorld = new THREE.Vector3();
    obj.getWorldPosition(objWorld);
    const projected = objWorld.clone().project(camera);

    // Check if object is behind camera
    if (projected.z >= 1) {
      element.style.display = 'none';
      if (tooltip.line) {
        scene.remove(tooltip.line);
        tooltip.line = null;
      }
      return;
    }

    // Calculate direction from screen center to object
    const objScreenX = (projected.x * 0.5 + 0.5) * rect.width + rect.left;
    const objScreenY = (-projected.y * 0.5 + 0.5) * rect.height + rect.top;
    
    const dirX = objScreenX - centerX;
    const dirY = objScreenY - centerY;
    const distance = Math.sqrt(dirX * dirX + dirY * dirY);
    
    // Normalize and extend to circle radius
    const normX = dirX / distance;
    const normY = dirY / distance;
    
    const tooltipX = centerX + normX * radius - element.offsetWidth / 2;
    const tooltipY = centerY + normY * radius - element.offsetHeight / 2;

    element.style.left = `${tooltipX}px`;
    element.style.top = `${tooltipY}px`;
    element.style.display = 'block';

    // Convert tooltip position to 3D for line
    const tooltipRect = element.getBoundingClientRect();
    const tooltipCenterX = tooltipRect.left + tooltipRect.width / 2;
    const tooltipCenterY = tooltipRect.top + tooltipRect.height / 2;

    const ndcX = ((tooltipCenterX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((tooltipCenterY - rect.top) / rect.height) * 2 + 1;

    const tooltipPos3D = new THREE.Vector3(ndcX, ndcY, 0.1).unproject(camera);

    // Update line
    const points = [objWorld, tooltipPos3D];
    if (!tooltip.line) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        linewidth: 2,
        transparent: true,
        opacity: 0.7
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      tooltip.line = line;
    } else {
      tooltip.line.geometry.dispose();
      tooltip.line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    }
  });
}

// export function updateTooltips(viewer) {
//   if (!viewer.tooltipElements || viewer.tooltipElements.length === 0) return;

//   const canvas = viewer.renderer.domElement;
//   const rect = canvas.getBoundingClientRect();
//   const camera = viewer.camera;
//   const scene = viewer.scene;

//   // Get the center of the screen
//   const centerX = window.innerWidth / 2;
//   const centerY = window.innerHeight / 2;
  
//   // Calculate dynamic radius based on screen size and number of tooltips
//   const baseRadius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
//   const radius = Math.max(baseRadius, 200); // Minimum radius of 200px

//   viewer.tooltipElements.forEach((tooltip, index) => {
//     const { obj, element } = tooltip;
//     if (!obj || !obj.visible) {
//       element.style.display = 'none';
//       if (tooltip.line) {
//         scene.remove(tooltip.line);
//         tooltip.line = null;
//       }
//       return;
//     }

//     // Get object's 3D world position
//     const objWorld = new THREE.Vector3();
//     obj.getWorldPosition(objWorld);

//     // Project object position to 2D screen space
//     const projected = objWorld.clone().project(camera);
    
//     // Check if object is behind the camera
//     if (projected.z >= 1) {
//       element.style.display = 'none';
//       if (tooltip.line) {
//         scene.remove(tooltip.line);
//         tooltip.line = null;
//       }
//       return;
//     }

//     // Calculate angle for circular distribution (360 degrees)
//     const angle = (index / viewer.tooltipElements.length) * Math.PI * 2;
    
//     // Calculate tooltip position on circle
//     const tooltipX = centerX + Math.cos(angle) * radius;
//     const tooltipY = centerY + Math.sin(angle) * radius;

//     // Adjust for tooltip element dimensions to center it properly
//     const elementRect = element.getBoundingClientRect();
//     const adjustedX = tooltipX - elementRect.width / 2;
//     const adjustedY = tooltipY - elementRect.height / 2;

//     // Position the tooltip
//     element.style.left = `${adjustedX}px`;
//     element.style.top = `${adjustedY}px`;
//     element.style.display = 'block';

//     // Convert tooltip screen position back to 3D space for line connection
//     const tooltipCenterX = tooltipX;
//     const tooltipCenterY = tooltipY;

//     const ndcX = ((tooltipCenterX - rect.left) / rect.width) * 2 - 1;
//     const ndcY = -((tooltipCenterY - rect.top) / rect.height) * 2 + 1;

//     // Create a point in 3D space for the tooltip (near the camera)
//     const tooltipPos3D = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);

//     // Create or update the connecting line
//     const points = [objWorld, tooltipPos3D];
//     if (!tooltip.line) {
//       const geometry = new THREE.BufferGeometry().setFromPoints(points);
//       const material = new THREE.LineBasicMaterial({ 
//         color: 0xffffff,
//         linewidth: 2,
//         transparent: true,
//         opacity: 0.8
//       });
//       const line = new THREE.Line(geometry, material);
//       scene.add(line);
//       tooltip.line = line;
//     } else {
//       tooltip.line.geometry.setFromPoints(points);
//       tooltip.line.geometry.attributes.position.needsUpdate = true;
//     }
//   });
// }

// // Enhanced version with collision avoidance
// export function updateTooltipsWithCollisionAvoidance(viewer) {
//   if (!viewer.tooltipElements || viewer.tooltipElements.length === 0) return;

//   const canvas = viewer.renderer.domElement;
//   const rect = canvas.getBoundingClientRect();
//   const camera = viewer.camera;
//   const scene = viewer.scene;

//   const centerX = window.innerWidth / 2;
//   const centerY = window.innerHeight / 2;
//   const radius = Math.min(window.innerWidth, window.innerHeight) * 0.35;

//   // Store tooltip positions for collision detection
//   const tooltipPositions = [];

//   viewer.tooltipElements.forEach((tooltip, index) => {
//     const { obj, element } = tooltip;
//     if (!obj || !obj.visible) {
//       element.style.display = 'none';
//       if (tooltip.line) {
//         scene.remove(tooltip.line);
//         tooltip.line = null;
//       }
//       return;
//     }

//     const objWorld = new THREE.Vector3();
//     obj.getWorldPosition(objWorld);
//     const projected = objWorld.clone().project(camera);

//     if (projected.z >= 1) {
//       element.style.display = 'none';
//       if (tooltip.line) {
//         scene.remove(tooltip.line);
//         tooltip.line = null;
//       }
//       return;
//     }

//     // Calculate base angle
//     let angle = (index / viewer.tooltipElements.length) * Math.PI * 2;
    
//     // Simple collision avoidance
//     let attempts = 0;
//     let hasCollision = true;
    
//     while (hasCollision && attempts < 10) {
//       hasCollision = false;
//       const testX = centerX + Math.cos(angle) * radius;
//       const testY = centerY + Math.sin(angle) * radius;
      
//       for (const pos of tooltipPositions) {
//         const dx = testX - pos.x;
//         const dy = testY - pos.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);
        
//         if (distance < 100) { // Minimum distance between tooltips
//           hasCollision = true;
//           angle += (Math.PI * 2) / viewer.tooltipElements.length * 0.1; // Small adjustment
//           break;
//         }
//       }
//       attempts++;
//     }

//     // Final position
//     const tooltipX = centerX + Math.cos(angle) * radius;
//     const tooltipY = centerY + Math.sin(angle) * radius;

//     tooltipPositions.push({ x: tooltipX, y: tooltipY });

//     const elementRect = element.getBoundingClientRect();
//     const adjustedX = tooltipX - elementRect.width / 2;
//     const adjustedY = tooltipY - elementRect.height / 2;

//     element.style.left = `${adjustedX}px`;
//     element.style.top = `${adjustedY}px`;
//     element.style.display = 'block';

//     // Line connection
//     const tooltipCenterX = tooltipX;
//     const tooltipCenterY = tooltipY;

//     const ndcX = ((tooltipCenterX - rect.left) / rect.width) * 2 - 1;
//     const ndcY = -((tooltipCenterY - rect.top) / rect.height) * 2 + 1;

//     const tooltipPos3D = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);

//     const points = [objWorld, tooltipPos3D];
//     if (!tooltip.line) {
//       const geometry = new THREE.BufferGeometry().setFromPoints(points);
//       const material = new THREE.LineBasicMaterial({ 
//         color: 0xffffff,
//         linewidth: 2,
//         transparent: true,
//         opacity: 0.8
//       });
//       const line = new THREE.Line(geometry, material);
//       scene.add(line);
//       tooltip.line = line;
//     } else {
//       tooltip.line.geometry.setFromPoints(points);
//       tooltip.line.geometry.attributes.position.needsUpdate = true;
//     }
//   });
// }

// Handle window resize
export function handleTooltipResize(viewer) {
  if (viewer.tooltipElements && viewer.tooltipElements.length > 0) {
    updateTooltips(viewer);
  }
}

// Initialize with your viewer
window.addEventListener('resize', () => handleTooltipResize(viewer));

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