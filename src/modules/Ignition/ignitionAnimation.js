// animation.js
import * as THREE from 'three';

export class IgnitionAnimation {
  constructor(gltf) {
    this.model = gltf.scene;
    this.animations = gltf.animations;
    this.mixer = new THREE.AnimationMixer(this.model);
    this.activeAction = null;
    this.clock = new THREE.Clock();

    // Create an action map for quick access
    this.actions = {};
    this.animations.forEach((clip) => {
      this.actions[clip.name] = this.mixer.clipAction(clip);
      console.log('Clip Name : ', clip.name);
    });
    console.log("🎬 Animation system initialized with clips:", Object.keys(this.actions));
  }

  playClip(name, loop = THREE.LoopOnce) {
    const action = this.actions[name];
    if (!action) return console.warn(`⚠️ Animation '${name}' not found.`);

    if (this.activeAction) this.activeAction.stop();
    action.reset();
    action.setLoop(loop);
    action.clampWhenFinished = true;
    action.timeScale = 1;
    action.play();

    this.activeAction = action;
  }

  // 🎞️ Play specific frame range (forward)
  playSegment(name, startFrame, endFrame, fps = 30) {
    const clip = this.animations.find(a => a.name === name);
    if (!clip) return console.warn(`Clip '${name}' not found.`);

    const action = this.mixer.clipAction(clip);
    const duration = clip.duration;
    const startTime = startFrame / fps;
    const endTime = Math.min(endFrame / fps, duration);

    action.reset();
    action.setLoop(THREE.LoopOnce, 0);
    action.clampWhenFinished = true;
    action.enabled = true;
    action.paused = false;
    action.timeScale = 1;
    action.time = startTime;
    action.play();

    this.currentAction = { action, stopTime: endTime, reverse: false };
  }

  // 🔁 Play a frame segment in reverse
  playReverseSegment(name, startFrame, endFrame, fps = 30) {
    const clip = this.animations.find(a => a.name === name);
    if (!clip) return console.warn(`Clip '${name}' not found.`);

    const action = this.mixer.clipAction(clip);
    const duration = clip.duration;
    const startTime = startFrame / fps;
    const endTime = Math.min(endFrame / fps, duration);

    // Swap start/end if necessary
    const playFrom = endTime;
    const playTo = startTime;

    action.reset();
    action.setLoop(THREE.LoopOnce, 0);
    action.clampWhenFinished = true;
    action.enabled = true;
    action.paused = false;
    action.timeScale = -1; // reverse direction
    action.time = playFrom;
    action.play();

    // Store control data to pause when reaching playTo
    this.currentAction = { action, stopTime: playTo, reverse: true };
  }

  pause() {
    if (this.mixer) this.mixer.timeScale = 0;
  }

  resume() {
    if (this.mixer) this.mixer.timeScale = 1;
  }

  stop() {
    if (this.activeAction) {
      this.activeAction.stop();
      this.activeAction = null;
    }
  }

  update(delta) {
    if (!this.mixer) return;

    this.mixer.update(delta);

    if (this.currentAction) {
      const { action, stopTime, reverse } = this.currentAction;

      if (!reverse && action.time >= stopTime) {
        // Forward segment done
        action.time = stopTime;
        action.paused = true;
        this.currentAction = null;
      }

      if (reverse && action.time <= stopTime) {
        // Reverse segment done
        action.time = stopTime;
        action.paused = true;
        this.currentAction = null;
      }
    }
  }
}
