import GUI from "lil-gui";

let gui; // singleton

export function initGUI(actions, folderBorderColor = '#ffae23') {
    if (gui) {
        gui.destroy(); // clean up previous
        gui = null;
    }

    gui = new GUI({ title: "Controls", width: 250 });
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '12%';
    gui.domElement.style.right = '1%';
    gui.domElement.style.zIndex = '10';
    gui.domElement.style.display = 'flex';

    // ---- Top-level buttons (no folder) ----
    const airStarterBtn = gui.add(actions, "airStarter").name("Air Starter");
    const oilBtn = gui.add(actions, "oilFill").name("Oil Fill");
    const sightBtn = gui.add(actions, "oilSight").name("Oil Sight Glass");
    const outputShaftBtn = gui.add(actions, "outputShaft").name("Output Shaft");
    const electricBtn = gui.add(actions, "electricConnector").name("Electrical Connector J30");
    const zoomBtn = gui.add(actions, "zoomOut").name("Reset Camera");

    // ---- Folders ----
    const modeFolder = gui.addFolder("Mode");
    modeFolder.add(actions, "toggleXray").name("Toggle X-ray");

    // const cameraFolder = gui.addFolder("Camera");
    // cameraFolder.add(actions, "resetCamera").name("Reset Camera");

    const lightFolder = gui.addFolder("Lights");
    const lightX = lightFolder.add(actions.lightPos, "x", -20, 20).name("X");
    const lightY = lightFolder.add(actions.lightPos, "y", -20, 20).name("Y");
    const lightZ = lightFolder.add(actions.lightPos, "z", -20, 20).name("Z");

    // open folders
    modeFolder.open();
    // cameraFolder.open();
    lightFolder.open();

    // disable initially
    airStarterBtn.disable();
    zoomBtn.disable();
    oilBtn.disable();
    outputShaftBtn.disable();
    electricBtn.disable();
    sightBtn.disable();

    // ---- Left-side Resizer ----
    const resizer = document.createElement('div');
    resizer.style.width = '2px';
    resizer.style.cursor = 'ew-resize';
    resizer.style.background = 'rgba(0, 0, 0, 0)';
    resizer.style.position = 'absolute';
    resizer.style.top = '12%';
    resizer.style.left = gui.domElement.offsetLeft + 'px';
    resizer.style.height = gui.domElement.offsetHeight + 'px';
    resizer.style.zIndex = '20';
    document.body.appendChild(resizer);

    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'ew-resize';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        e.preventDefault();
        const newWidth = window.innerWidth - e.clientX - 10;
        gui.width = Math.max(200, newWidth);
        gui.domElement.style.width = gui.width + 'px';
        resizer.style.left = gui.domElement.offsetLeft + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (!isResizing) return;
        isResizing = false;
        document.body.style.cursor = 'default';
    });

    // ---- Add left border to folder elements only ----
    function setFolderBorders(folder) {
        folder.domElement.querySelectorAll('.lg-folder, .lg-controller').forEach(el => {
            el.style.borderLeft = `3px solid ${folderBorderColor}`;
            el.style.paddingLeft = '8px';
            el.style.boxSizing = 'border-box';
        });
    }

    setFolderBorders(modeFolder);
    // setFolderBorders(cameraFolder);
    setFolderBorders(lightFolder);

    return { gui, airStarterBtn, zoomBtn, oilBtn, outputShaftBtn, electricBtn, sightBtn, lightX, lightY, lightZ };
}
