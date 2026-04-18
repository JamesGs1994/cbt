// outlineEffect.js
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

export function setupOutlineEffect(viewer) {
  // Create composer and passes
  const composer = new EffectComposer(viewer.renderer);
  const renderPass = new RenderPass(viewer.scene, viewer.camera);
  const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    viewer.scene,
    viewer.camera
  );

  composer.addPass(renderPass);
  composer.addPass(outlinePass);

  // Set your desired visual properties
  outlinePass.edgeStrength = 15;     // brightness
  outlinePass.edgeGlow = 0.5;       // glow around the outline
  outlinePass.edgeThickness = 5.0;
  outlinePass.visibleEdgeColor.set('#ffff00'); // visible edge
  outlinePass.hiddenEdgeColor.set('#000000');  // hidden edge

  // Store in viewer for later access
  viewer.composer = composer;
  viewer.renderPass = renderPass;
  viewer.outlinePass = outlinePass;

  // Handle resizing
  window.addEventListener('resize', () => {
    const size = new THREE.Vector2(window.innerWidth, window.innerHeight);
    composer.setSize(size.x, size.y);
    outlinePass.setSize(size.x, size.y);
  });
    
  // ✅ Attach to viewer for global access
  viewer.composer = composer;
  viewer.outlinePass = outlinePass;

  console.log("OutlinePass ready on viewer:", !!viewer.outlinePass);

  return viewer;
}
