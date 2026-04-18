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
        airStarter: () => {
            context.circlePointer("one");
            context.toggleCircle = !context.toggleCircle;
        },
        zoomOut: () => {
            context.circlePointer("two");
            context.toggleCircle = !context.toggleCircle;
        },
        oilFill: () => context.circlePointer("three"),
        outputShaft: () => context.circlePointer("four"),
        electricConnector: () => context.circlePointer("five"),
        oilSight: () => context.circlePointer("six"),
        toggleXray: () => context.toggleWireframeMode(),
        resetCamera: () => context.resetCamera(),
        lightPos: { x: 10, y: 20, z: 30 }
    };

    // 2️⃣ Initialize GUI and get all controls
    const {
        gui,
        airStarterBtn,
        zoomBtn,
        oilBtn,
        outputShaftBtn,
        electricBtn,
        sightBtn,
        lightX,
        lightY,
        lightZ
    } = initGUI(context.actions);

// 3️⃣ Attach enable/disable button behavior
function addClickHandler(controller, handler) {
  const button = controller.domElement.querySelector("button");
  if (button) button.addEventListener("click", handler);
}

// Attach handlers for buttons
addClickHandler(airStarterBtn, () => {
  airStarterBtn.disable();
  zoomBtn.enable();
  oilBtn.enable();
  outputShaftBtn.enable();
  electricBtn.enable();
  sightBtn.enable();
});

addClickHandler(zoomBtn, () => {
  airStarterBtn.enable();
  zoomBtn.disable();
  oilBtn.disable();
  outputShaftBtn.disable();
  electricBtn.disable();
  sightBtn.disable();
});

addClickHandler(oilBtn, () => {
  airStarterBtn.disable();
  zoomBtn.enable();
  oilBtn.enable();
  outputShaftBtn.enable();
  electricBtn.enable();
  sightBtn.enable();
});

addClickHandler(outputShaftBtn, () => {
  airStarterBtn.disable();
  zoomBtn.enable();
  oilBtn.enable();
  outputShaftBtn.enable();
  electricBtn.enable();
  sightBtn.enable();
});

addClickHandler(electricBtn, () => {
  airStarterBtn.disable();
  zoomBtn.enable();
  oilBtn.enable();
  outputShaftBtn.enable();
  electricBtn.enable();
  sightBtn.enable();
});

addClickHandler(sightBtn, () => {
  airStarterBtn.disable();
  zoomBtn.enable();
  oilBtn.enable();
  outputShaftBtn.enable();
  electricBtn.enable();
  sightBtn.enable();
});

    // 4️⃣ Light control sliders (call the class’s lightControls())
    lightX.onChange(() => context.lightControls());
    lightY.onChange(() => context.lightControls());
    lightZ.onChange(() => context.lightControls());

    // 5️⃣ Return references so the main class can use them
    return {
        gui,
        airStarterBtn,
        zoomBtn,
        oilBtn,
        outputShaftBtn,
        electricBtn,
        sightBtn,
        lightX,
        lightY,
        lightZ
    };
}
