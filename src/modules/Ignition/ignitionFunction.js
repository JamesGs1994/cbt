import * as THREE from 'three';
import gsap from 'gsap';
// import { displayToolTip, updateTooltips, hideToolTip, highlightMesh, resetMesh, loadInfoData, showInfoPanel, ToEul, focusOnObject } from '../../helper-old.js';
import { highlightMesh, resetMesh, loadInfoData, showInfoPanel, ToEul, focusOnObject } from '../../helper.js';
import { createArrow,createCurvedArrow } from '../../arrow.js';
import { createLabel } from '../../labels.js';
import { toggleTooltipMode } from '../../helper.js';
// import { IgnitionAnimation } from './ignitionAnimation.js';

export function circlePointer(viewer,id){
    if (id === 'one') {
        const availableTooltips = [
            'DIFFUSER_OUTTER_CASE',
            'MOUNTING_BOSS_1',
            'IGNITER_PLUG_1',
            'MOUNTING_BOSS_2',
            'IGNITER_PLUG_2',
            'EXCITER_TO_IGNITER_PLUG_1',
            'EXCITER_TO_IGNITER_PLUG_BOLT_1',
            'EXCITER_TO_IGNITER_PLUG_2',
            'EXCITER_TO_IGNITER_PLUG_BOLT_2',
            'EXCITER_TO_IGNITER_PLUG_CABLE_2',
            'EXCITER_TO_IGNITER_PLUG_CABLE_1',
            'Ignitor_Tool',
            'Drive_Attachment',
            'SPANNER_90_Degree',
            'SPANNER',
            'TOEQUE_WRENCH',
            'WRENCH_Attachment',
            'IGNITION_EXCITER'
        ];

        // ✅ Activate tooltip mode
        toggleTooltipMode(true);

        // 👉 Focus on your target object
        const diffuserObj = viewer.objects.find(obj => obj.name === 'DIFFUSER_OUTTER_CASE');
        if (diffuserObj) {
            focusOnObject(viewer, diffuserObj, 1.3);
            diffuserObj.frustumCulled = false;
        }

        // 👉 Show tooltips once
        setTimeout(() => {
            // viewer.toggleCircle=true;
            if (viewer.toggleCircle) {
            toggleTooltipMode(true);
            // displayToolTip(viewer, availableTooltips);
            } else {
            toggleTooltipMode(false);
            //viewer.hideToolTip();
            }
        }, 1000);
    }
    else if(id == 'two'){
        toggleTooltipMode(false);
        //viewer.hideToolTip();
        viewer.objects.forEach(obj=>{
            if(obj.name === 'DIFFUSER_OUTTER_CASE'){
                console.log('in id two')
                focusOnObject(viewer,obj,3.5)
            }
        })
    }
    else if (id === 'three') {
        toggleTooltipMode(false);
        //viewer.hideToolTip();
        if (!viewer.ignitionAnim) {
            console.warn('Ignition animation not found');
            return;
        }
        
        // Optional: check available clips
        console.log('Available clips:', viewer.ignitionAnim.animations.map(a => a.name));

        // Example: play the clip named 'IgnitionAnimation' (adjust name as per gltf.animations)
        const audio = document.querySelector('.cable-detaching');
        if(!audio.pause()){
            audio.play();
            console.log('audio playing')
        }else{ audio.pause() ; console.log('audio not playing') }
        setTimeout(() => {
            viewer.ignitionAnim.playSegment('Animation', 0, 100, 24);
            console.log('▶ Segment 1');
            
            setTimeout(() => {
                viewer.ignitionAnim.playSegment('Animation', 100, 200, 24);
                console.log('▶ Segment 2');

                setTimeout(() => {
                    viewer.ignitionAnim.playSegment('Animation', 200, 300, 24);
                    console.log('▶ Segment 3');
                }, 4000);

            }, 4000);

        }, 5000);
    }
    else if(id == 'four'){
        toggleTooltipMode(false);
        //viewer.hideToolTip();
        if (!viewer.ignitionAnim) {
            console.warn('Ignition animation not found');
            return;
        }
        
        // Optional: check available clips
        console.log('Available clips:', viewer.ignitionAnim.animations.map(a => a.name));

        // Example: play the clip named 'IgnitionAnimation' (adjust name as per gltf.animations)
        const audio = document.querySelector('.plug-removal');
        if(!audio.pause()){
            audio.play();
            console.log('audio playing')
        }else{ audio.pause() ; console.log('audio not playing') }

        setTimeout(() => {
            viewer.ignitionAnim.playSegment('Animation', 300, 450, 24);
            console.log('▶ Segment 1');
            
            setTimeout(() => {
                viewer.ignitionAnim.playSegment('Animation', 450, 600, 24);
                console.log('▶ Segment 2');

                setTimeout(() => {
                    viewer.ignitionAnim.playSegment('Animation', 600, 800, 24);
                    console.log('▶ Segment 3');
                }, 6000);

            }, 8000);

        }, 8000);
        
        setTimeout(()=>{
            viewer.arrow1 = createCurvedArrow(0.2);
            viewer.arrow1.position.set(-5.95,-0.25,-3)
            viewer.arrow1.scale.x *= -1;
            gsap.to(viewer.arrow1.rotation,{
                X: 0.5,
                z: -0.2,
                y : 7,
                duration: 10,
                ease: 'power3.inOut',
                onComplete:()=>{
                    viewer.scene.remove(viewer.arrow1)
                }
            })
            viewer.scene.add(viewer.arrow1);
        },7000)
    }
    else if(id == 'five'){
        toggleTooltipMode(false);
        //viewer.hideToolTip();
        if (!viewer.ignitionAnim) {
            console.warn('Ignition animation not found');
            return;
        }
        
        // Optional: check available clips
        console.log('Available clips:', viewer.ignitionAnim.animations.map(a => a.name));
        // Example: play the clip named 'IgnitionAnimation' (adjust name as per gltf.animations)
        viewer.ignitionAnim.playReverseSegment('Animation', 0, 800, 24);
        setTimeout(()=>{
            viewer.arrow1 = createCurvedArrow(0.2);
            viewer.arrow1.position.set(-5.95,-0.25,-3)
            gsap.to(viewer.arrow1.rotation,{
                X: 0.5,
                z: -0.2,
                y : -7,
                duration: 10,
                ease: 'power3.inOut',
                onComplete:()=>{
                    viewer.scene.remove(viewer.arrow1)
                }
            })
            viewer.scene.add(viewer.arrow1);
        },3000)

    }
    else if(id == 'six'){
        toggleTooltipMode(false);
        

    }
} 

export function toScreenPosition(viewer, obj, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = 0.5 * renderer.domElement.clientWidth;
    const heightHalf = 0.5 * renderer.domElement.clientHeight;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { x: vector.x, y: vector.y };
} 



// We will begin the maintenance of Ignition Assembly by first detaching the Ignition Cable from the Ignition Plug.
// This process is done using a Spanner which is placed on the cable bolt and rotating it anti-clockwise to loosen it.
// As the bolt is loosened using the spanner, the bolt then can be removed by the hands if it is reachable.


// After removing the cable from plug the next step is to bring the plug outside this is done by using a specially designed tool known as
// Adapter Tool.
// We will safely place the adapter tool onto the ignition plug then using the torque wrench at specified torque range we place it at the end of the adapter tool.
// Then we provide a supporting to the outer body of adapter tool using spanner. 
// finally rotate the torque wrench in anti-clockwise direction to remove the igntion plug out of the assembly.