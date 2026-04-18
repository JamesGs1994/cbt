// arrow.js
import * as THREE from 'three';

export function createArrow(scale = 1, color = 0xA98B2D) {
    const group = new THREE.Group();

    // Cylinder for shaft
    const shaftGeometry = new THREE.CylinderGeometry(0.05 * scale, 0.05 * scale, 1 * scale, 16);
    const shaftMaterial = new THREE.MeshBasicMaterial({ color, opacity:0.5 });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

    // Move shaft so its bottom aligns with origin
    shaft.position.y = 0.5 * scale;

    // Cone for arrowhead
    const headGeometry = new THREE.ConeGeometry(0.15 * scale, 0.3 * scale, 16);
    const headMaterial = new THREE.MeshBasicMaterial({ color, opacity:0.5 });
    const head = new THREE.Mesh(headGeometry, headMaterial);

    // Position cone on top of shaft
    head.position.y = 1 * scale;

    // Add to group
    group.add(shaft);
    group.add(head);

    // Rotate to point along +Y by default (can change later)
    group.rotation.x = Math.PI / 2;

    return group;
}

export function createCurvedArrow(scale = 1, color = 0xff0000) {
  const group = new THREE.Group();

  // 🔹 Create a semicircular curve (half circle)
  // The arc goes from 0 → π radians (180°)
  const radius = scale;
  const curve = new THREE.CurvePath();
  const arcCurve = new THREE.ArcCurve(
    0,            // center X
    0,            // center Y
    radius,       // radius
    0,            // start angle
    Math.PI,      // end angle (half circle)
    false         // clockwise = false
  );

  // Convert 2D arc (XY plane) to 3D curve (XZ plane)
  const points = arcCurve.getPoints(50).map(p => new THREE.Vector3(p.x, 0, p.y));

  const curve3D = new THREE.CatmullRomCurve3(points);

  // 🔹 Create tube (shaft)
  const shaftGeometry = new THREE.TubeGeometry(curve3D, 64, 0.05 * scale, 8, false);
  const shaftMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 });
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
  group.add(shaft);

  // 🔹 Create arrowhead
  const headGeometry = new THREE.ConeGeometry(0.15 * scale, 0.3 * scale, 16);
  const headMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
  const head = new THREE.Mesh(headGeometry, headMaterial);

  // Place the head at the end of the curve
  const endPoint = curve3D.getPoint(1);
  head.position.copy(endPoint);

  // Orient the arrowhead to match the curve tangent
  const tangent = curve3D.getTangent(1).normalize();
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, tangent);
  head.quaternion.copy(quaternion);

  group.add(head);

  // Optional rotation to orient arrow in scene (Y-up)
  group.rotation.x = Math.PI / 2;

  return group;
}
