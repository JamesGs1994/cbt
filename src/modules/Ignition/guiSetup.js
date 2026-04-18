// guiSetup.js
import { initGUI } from "./gui.js";
import {lightControls} from '../../lighting.js'
// import {circlePointer, oilFill} from './starterFunction.js'
/**
 * Sets up the GUI for the WireframeViewer class.
 * This includes creating GUI buttons, linking them to class actions,
 * and attaching all enable/disable logic for each GUI element.
 *
 * @param {Object} context - Reference to the WireframeViewer instance
 * @returns {Object} - Returns all GUI references to attach back to the main class
 */
export function setupViewerGUI(context) {
    // 1️⃣ Define GUI action methods (these call class functions)
    context.actions = {
        ignitionPlug: () => {
            context.circlePointer("one");
            context.toggleCircle = !context.toggleCircle;
        },
        zoomOut: () => {
            context.circlePointer("two");
            context.toggleCircle = !context.toggleCircle;
        },
        adapter: () => context.circlePointer("three"),
        removePlug: () => context.circlePointer("four"),
        reinstall: () => context.circlePointer("five"),
        // eec: () => context.circlePointer("six"),
        toggleXray: () => context.toggleWireframeMode(),
        resetCamera: () => context.resetCamera(),
        lightPos: { x: 10, y: 20, z: 30 }
    };

    // 2️⃣ Initialize GUI and get all controls
    const {
        // gui, ignitionBtn, zoomBtn, adapterBtn, reinstallBtn, EECBtn, removalBtn, lightX, lightY, lightZ
        gui, ignitionBtn, zoomBtn, adapterBtn, reinstallBtn, removalBtn, lightX, lightY, lightZ
    } = initGUI(context.actions);

// 3️⃣ Attach enable/disable button behavior
function addClickHandler(controller, handler) {
  const button = controller.domElement.querySelector("button");
  if (button) button.addEventListener("click", handler);
}

// Attach handlers for buttons
addClickHandler(ignitionBtn, () => {
  ignitionBtn.disable();
  zoomBtn.enable();
  adapterBtn.enable();
  reinstallBtn.disable();
  // EECBtn.enable();
  removalBtn.disable();
});

// addClickHandler(zoomBtn, () => {
//   ignitionBtn.enable();
//   zoomBtn.disable();
//   adapterBtn.disable();
//   reinstallBtn.disable();
//   // EECBtn.disable();
//   removalBtn.disable();
// });

addClickHandler(adapterBtn, () => {
  ignitionBtn.disable();
  zoomBtn.enable();
  adapterBtn.disable();
  reinstallBtn.disable();
  // EECBtn.enable();
  setTimeout(() => {
    removalBtn.enable();
  }, 13000);
});

addClickHandler(reinstallBtn, () => {
  ignitionBtn.enable();
  zoomBtn.enable();
  adapterBtn.disable();
  reinstallBtn.disable();
  // EECBtn.enable();
  removalBtn.disable();
});

// addClickHandler(EECBtn, () => {
//   ignitionBtn.disable();
//   zoomBtn.enable();
//   adapterBtn.enable();
//   reinstallBtn.enable();
//   // EECBtn.enable();
//   removalBtn.enable();
// });

addClickHandler(removalBtn, () => {
  ignitionBtn.enable();
  zoomBtn.enable();
  adapterBtn.disable();
  setTimeout(() => {
    reinstallBtn.enable();
  }, 21000);
  // EECBtn.enable();
  removalBtn.disable();
});

    // 4️⃣ Light control sliders (call the class’s lightControls())
    lightX.onChange(() => context.lightControls());
    lightY.onChange(() => context.lightControls());
    lightZ.onChange(() => context.lightControls());

    // 5️⃣ Return references so the main class can use them
    return {
        gui,
        ignitionBtn,
        zoomBtn,
        adapterBtn,
        reinstallBtn,
        // EECBtn,
        removalBtn,
        lightX,
        lightY,
        lightZ
    };
}
