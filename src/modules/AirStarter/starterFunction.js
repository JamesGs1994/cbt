import gsap from 'gsap';
import { highlightMesh, resetMesh, loadInfoData, showInfoPanel, ToEul, focusOnObject } from '../../helper.js';
import { createArrow } from '../../arrow.js';
import { createLabel } from '../../labels.js';
import { toggleTooltipMode } from '../../helper.js';

export function circlePointer(viewer,id){
    if(id == 'one'){
        document.getElementById('oilFillTaskBtns1').style.visibility='hidden'
        const availableTooltips = [
            // 'STARTER_ctrl_1',
            'Air_Inlet_Housing',
            // 'Air_Turbine_Starter',
            'Magnetic_Plug_Assembly',
            'Output_Shaft',
            // 'Mesh020',
            'Starter_Speed_Sensor',
            'Oil_Fill',
            'Mesh027_1'
            // 'Oil_Fill_Plug',
            // 'Plug_Bolt',
            // 'Plug_Packing'
        ];
        viewer.objects.forEach(obj=>{
            if(obj.name == 'STARTER_AIR_DUCT'){
                // console.log(obj.position.x +'--'+obj.position.y+'--'+obj.position.z)

                gsap.to(obj.position,{
                    // y : -100,
                    z : -10,
                    duration : 2,
                    ease : 'power3.inOut'
                })
            }
            
            if(obj.name == 'MAIN_GEARBOX'){
                // console.log(obj.position.x +'--'+obj.position.y+'--'+obj.position.z)
                gsap.to(obj.position,{
                    // y : 100,
                    z : 10,
                    duration : 2,
                    ease : 'power3.inOut',
                    onComplete: () => {
                        if(obj.name == "STARTER_ctrl_1"){
                            viewer.focusOnObject(obj, 2.5); // use bound method
                            obj.frustumCulled = false;
                        }
                    }
                })          
            }

            if(obj.name == 'STARTER_AIR_DUCT1' || obj.name == 'STARTER_AIR_VALVE' || obj.name == 'STARTER_AIR_DUCT' || obj.name == 'MAIN_GEARBOX' || obj.name == 'QAD_RING' || obj.name == 'V_BAND_CLAMP_1' || obj.name == 'V_BAND_CLAMP_2' ){
                obj.material = obj.material.clone();
                obj.material.transparent = true;
                obj.material.opacity = 1;
                gsap.to(obj.material,{
                    opacity : 0   ,
                    duration : 1.5,
                    ease : 'power3.inOut'
                })
                setTimeout(()=>{
                obj.visible = false;
                },1500);
                
            }
            
            setTimeout(()=>{
                if(obj.name == "STARTER_ctrl_1")
                {
                    focusOnObject(viewer, obj, 2.5);
                    obj.frustumCulled = false;
                        
                }
                if(viewer.toggleCircle){
                    toggleTooltipMode(true);
                    // console.log(viewer.toggleCircle)
                    // //viewer.displayToolTip(availableTooltips);
                    //viewer.displayToolTip(availableTooltips); 
                    // console.log("Tooltip elements:", viewer.tooltipElements);
                }else{
                    toggleTooltipMode(false);
                    viewer.hideToolTip()
                }
            },1000);
            
        })
        
    }
    else if(id == 'two'){
        document.getElementById('oilFillTaskBtns1').style.visibility='hidden'
        viewer.objects.forEach(obj=>{
            if(obj.name == 'STARTER_AIR_DUCT'){
                // console.log(obj.position.x +'--'+obj.position.y+'--'+obj.position.z)
                gsap.to(obj.position,{
                    // y : -62,
                    z : -0.62,
                    duration : 2,
                    ease : 'power3.inOut',
                    // onComplete : ()=>{
                    //     setTimeout(()=>{
                    //         document.getElementById('circle-pointer2').style.visibility = 'hidden';
                    //         document.getElementById('circle-pointer3').style.visibility = 'hidden';
                    //         document.getElementById('circle-pointer1').style.visibility = 'visible';
                            
                    //     },100);
                    // }

                });
            }
            if(obj.name == 'MAIN_GEARBOX'){
                // console.log(obj.position.x +'--'+obj.position.y+'--'+obj.position.z)
                gsap.to(obj.position,{
                    // y : 15,
                    z : 0.15,
                    duration : 2,
                    ease : 'power3.inOut'
                })          
            }  

            if(obj.name == 'STARTER_AIR_DUCT1' || obj.name == 'STARTER_AIR_VALVE' || obj.name == 'STARTER_AIR_DUCT' || obj.name == 'MAIN_GEARBOX' || obj.name == 'QAD_RING' || obj.name == 'V_BAND_CLAMP_1' || obj.name == 'V_BAND_CLAMP_2'){
                obj.material = obj.material.clone();
                obj.material.transparent = true;
                obj.material.opacity = 0;
                gsap.to(obj.material,{
                    opacity : 1,
                    duration : 1.5,
                    ease : 'power3.inOut'
                })
                obj.visible = true;
            }
            setTimeout(()=>{
                if(obj.name == "STARTER_ctrl_1")
                {
                        focusOnObject(viewer, obj, 6);
                        obj.frustumCulled = false;
                        
                }
            },1000);
        })
        toggleTooltipMode(false);
        //viewer.hideToolTip();
    }
    else if(id == 'three'){
        // var task1 = document.getElementById('oilFillTaskBtns1');
        // console.log(task1.style.visibility)
        // task1.style.visibility = 'visible';
        // console.log(task1.style.visibility)
        const availableTooltips = [
            // 'STARTER_ctrl_1',
            // 'Air_Inlet_Housing',
            // 'Air_Turbine_Starter',
            // 'Magnetic_Plug_Assembly',
            // 'Output_Shaft',
            // 'Mesh020',
            // 'Starter_Speed_Sensor',
            'Oil_Fill',
            'Oil_Fill_Plug',
            'Plug_Bolt',
            'Plug_Packing'
        ];
        toggleTooltipMode(false);
        //viewer.hideToolTip();
        viewer.toggleGTF = !viewer.toggleGTF;
        console.log(viewer.toggleGTF)
        console.log(viewer.toggleCircle)
        if(!viewer.toggleGTF){
            //viewer.displayToolTip(availableTooltips); 
            toggleTooltipMode(true);
            
            viewer.objects.forEach(obj=>{
                if(obj.name == 'Oil_Fill'){
                    console.log('focuused')
                    focusOnObject(viewer, obj, 2.5);
                    setTimeout(()=>{
                        // task1.style.visibility = 'visible'
                        viewer.oilFill();
                        viewer.showInfoPanel(obj);
                    },1500)

                }
            })
        }
        else{
            document.getElementById('oilFillTaskBtns1').style.visibility='hidden'
            toggleTooltipMode(false);
            //viewer.hideToolTip();
                const newavailableTooltips = [
                // 'STARTER_ctrl_1',
                'Air_Inlet_Housing',
                // 'Air_Turbine_Starter',
                'Magnetic_Plug_Assembly',
                'Output_Shaft',
                'Mesh027_1',
                'Starter_Speed_Sensor',
                'Oil_Fill',
                // 'Oil_Fill_Plug',
                // 'Plug_Bolt',
                // 'Plug_Packing'
            ];
            displayToolTip(viewer, newavailableTooltips); 
            toggleTooltipMode(true);    
            viewer.objects.forEach(obj=>{
                if(obj.name == 'STARTER_ctrl_1'){
                    focusOnObject(viewer, obj);
                }
                // if(obj.name == 'Oil_Fill'){
                //     gsap.to(obj.position,{
                //         y : 3.5,
                //         duration : 1.5,
                //         ease : 'power3.inOut',
                //         // onComplete : ()=>{
                //         //     document.getElementById('circle-pointer1').style.visibility = 'hidden';        
                //         // }
                //     })
                // }
                if(obj.name == 'Oil_Fill_Plug'){
                    gsap.to(obj.position,{
                        y : 3.8,
                        duration : 1.5,
                        ease : 'power3.inOut'
                    })
                }
                if(obj.name == 'Plug_Bolt'){
                    gsap.to(obj.position,{
                        y : 8.6,
                        duration : 1.5,
                        ease : 'power3.inOut'
                    })
                }
                if(obj.name == 'Plug_Packing'){
                    // viewer.highlightMesh(obj)
                    gsap.to(obj.position,{
                        y : 3.5,
                        duration : 1.5,
                        ease : 'power3.inOut'
                    })
                }
            })            
        }

    }
    else if(id == 'four'){
        document.getElementById('oilFillTaskBtns1').style.visibility='hidden'
        const availableTooltips = [
            // 'STARTER_ctrl_1',
            // 'Air_Inlet_Housing',
            // 'Air_Turbine_Starter',
            // 'Magnetic_Plug_Assembly',
            'Output_Shaft',
            // 'Mesh020',
            // 'Starter_Speed_Sensor',
            // 'Oil_Fill',
            // 'Oil_Fill_Plug',
            // 'Plug_Bolt',
            // 'Plug_Packing'
        ];
        viewer.controls.maxAzimuthAngle = viewer.ToEul(90);
        toggleTooltipMode(false);
        //viewer.hideToolTip();
        viewer.toggleShaft = !viewer.toggleShaft;
        if(viewer.toggleShaft){
            //viewer.displayToolTip(availableTooltips);
            viewer.objects.forEach(obj=>{
                if(obj.name == 'Output_Shaft'){
                    focusOnObject(viewer, obj, 5);

                    // console.log(obj.position)
                    viewer.arrow1 = createArrow(0.5); // smaller arrow
                    viewer.arrow1.position.copy(obj.position); // place at object center
                    viewer.arrow1.position.z = -4.5
                    viewer.arrow1.position.x = -3.9
                    viewer.arrow1.position.y = -2
                    viewer.arrow1.rotation.z = -1.7
                    
                    viewer.arrow2 = createArrow(0.5);
                    viewer.arrow2.position.copy(viewer.arrow1.position)
                    viewer.arrow2.rotation.copy(viewer.arrow1.rotation)
                    viewer.arrow2.position.y = -2.45
                    
                    viewer.arrow3 = createArrow(0.5);
                    viewer.arrow3.position.copy(viewer.arrow1.position)
                    viewer.arrow3.rotation.copy(viewer.arrow1.rotation)
                    viewer.arrow3.position.x = -3
                    viewer.arrow3.position.z = -4.8
                    viewer.arrow3.rotation.z = 1.5
                    viewer.arrow3.position.y = -2.3
                
                    viewer.scene.add(viewer.arrow1);
                    viewer.scene.add(viewer.arrow2);
                    viewer.scene.add(viewer.arrow3);
                    console.log('arrow added');

                    createLabel("Upper Oil Scavenge", viewer.arrow1.position, viewer.scene).then(label => {
                        viewer.label1 = label;
                        viewer.label1.visible = true
                        viewer.label1.position.x += 0.05; // now you can adjust
                        viewer.label1.position.z += -0.05; // now you can adjust
                        viewer.label1.position.y += 0.05; // now you can adjust
                        viewer.label1.rotation.y += 0.09
                    });
                    
                    createLabel("Lower Oil Scavenge", viewer.arrow2.position, viewer.scene).then(label => {
                        viewer.label2 = label;
                        viewer.label2.visible = true
                        viewer.label2.position.x += 0.05; // now you can adjust
                        viewer.label2.position.y += -0.2;
                        viewer.label2.rotation.y += 0.09
                    });
                    
                    createLabel("Oil Pressure", viewer.arrow3.position, viewer.scene).then(label => {
                        viewer.label3 = label;
                        viewer.label3.visible = true
                        viewer.label3.position.x += -0.7; // now you can adjust
                        viewer.label3.position.y += 0.15; // now you can adjust
                        viewer.label3.rotation.y += 0.09
                        // label3.position.z -= 0.2;
                    });

                }
                if(obj.name == 'MAIN_GEARBOX'){
                    console.log(obj.position.x +'--'+obj.position.y+'--'+obj.position.z+'NEW')
                    gsap.to(obj.position,{
                        // y : 30,
                        z : 0.3,
                        duration : 2,
                        ease : 'power3.inOut'
                    })          
                }
                if(obj.name == 'MAIN_GEARBOX' || obj.name == 'QAD_RING' || obj.name == 'V_BAND_CLAMP_1' || obj.name == 'V_BAND_CLAMP_2' ){
                    obj.material = obj.material.clone();
                    obj.material.transparent = true;
                    obj.material.opacity = 0;
                    gsap.to(obj.material,{
                        opacity : 1   ,
                        duration : 1.5,
                        ease : 'power3.inOut'
                    })
                    setTimeout(()=>{
                    obj.visible = true;
                    },1500);
                    
                }
            })
        }
        else{
            viewer.scene.remove(viewer.arrow1);
            viewer.scene.remove(viewer.arrow2);
            viewer.scene.remove(viewer.arrow3);
            viewer.label1.visible = false
            viewer.label2.visible = false
            viewer.label3.visible = false
            toggleTooltipMode(false);
            //viewer.hideToolTip();
                const newavailableTooltips = [
                // 'STARTER_ctrl_1',
                'Air_Inlet_Housing',
                // 'Air_Turbine_Starter',
                'Magnetic_Plug_Assembly',
                'Output_Shaft',
                'Mesh027_1',
                'Starter_Speed_Sensor',
                'Oil_Fill',
                // 'Oil_Fill_Plug',
                // 'Plug_Bolt',
                // 'Plug_Packing'
            ];
            toggleTooltipMode(true);
            //viewer.displayToolTip(availableTooltips); 
            // document.getElementById('circle-pointer1').style.visibility = 'visible';        
            viewer.objects.forEach(obj=>{
                if(obj.name == 'STARTER_ctrl_1'){
                    focusOnObject(viewer, obj);
                }
                if(obj.name == 'MAIN_GEARBOX'){
                    console.log(obj.position.x +'--'+obj.position.y+'--'+obj.position.z)
                    gsap.to(obj.position,{
                        // y : 100,
                        z : 10,
                        duration : 2,
                        ease : 'power3.inOut'
                    })          
                }
                if(obj.name == 'MAIN_GEARBOX' || obj.name == 'QAD_RING' || obj.name == 'V_BAND_CLAMP_1' || obj.name == 'V_BAND_CLAMP_2' ){
                    obj.material = obj.material.clone();
                    obj.material.transparent = true;
                    obj.material.opacity = 1;
                    gsap.to(obj.material,{
                        opacity : 0,
                        duration : 1.5,
                        ease : 'power3.inOut'
                    })
                    setTimeout(()=>{
                    obj.visible = false;
                    },1500);
                    
                }
            })            
        }

    }
    else if(id == 'five'){
        document.getElementById('oilFillTaskBtns1').style.visibility='hidden'
        const availableTooltips = [
            // 'STARTER_ctrl_1',
            // 'Air_Inlet_Housing',
            // 'Air_Turbine_Starter',
            // 'Magnetic_Plug_Assembly',
            // 'Output_Shaft',
            // 'Mesh020',
            'Starter_Speed_Sensor',
            // 'Oil_Fill',
            // 'Oil_Fill_Plug',
            // 'Plug_Bolt',
            // 'Plug_Packing'
        ];
        viewer.controls.maxAzimuthAngle = viewer.ToEul(90);
        toggleTooltipMode(false);
        //viewer.hideToolTip();
        viewer.toggleElectricCon = !viewer.toggleElectricCon;
        if(viewer.toggleElectricCon){
            //viewer.displayToolTip(availableTooltips); 
            toggleTooltipMode(true);
            viewer.objects.forEach(obj=>{
                if(obj.name == 'Starter_Speed_Sensor'){
                    focusOnObject(viewer, obj, 5);
                    // obj.updateMatrixWorld();
                    viewer.arrow4 = createArrow(0.1); // smaller arrow
                    viewer.arrow4.position.copy(obj.position); // place at object center
                    // viewer.arrow4.position.z = -4.5
                    // viewer.arrow4.position.x = -3.9
                    // viewer.arrow4.position.y = 1
                    // viewer.arrow4.rotation.y = -90;
                    // viewer.arrow4.rotation.z = -1.7
                    viewer.scene.add(viewer.arrow4)
                    console.log('arrow added 5');
                }


            })
        }
        else{
            viewer.scene.remove(viewer.arrow4);
            toggleTooltipMode(false);
            //viewer.hideToolTip();
                const newavailableTooltips = [
                // 'STARTER_ctrl_1',
                'Air_Inlet_Housing',
                // 'Air_Turbine_Starter',
                'Magnetic_Plug_Assembly',
                'Output_Shaft',
                'Mesh027_1',
                'Starter_Speed_Sensor',
                'Oil_Fill',
                // 'Oil_Fill_Plug',
                // 'Plug_Bolt',
                // 'Plug_Packing'
            ];
            //viewer.displayToolTip(availableTooltips); 
            toggleTooltipMode(true);
            // document.getElementById('circle-pointer1').style.visibility = 'visible';        
            viewer.objects.forEach(obj=>{
                if(obj.name == 'STARTER_ctrl_1'){
                    focusOnObject(viewer, obj);
                }
            })            
        }

    }
    else if(id == 'six'){
        document.getElementById('oilFillTaskBtns1').style.visibility='hidden'
        const availableTooltips = [
            // 'STARTER_ctrl_1',
            // 'Air_Inlet_Housing',
            // 'Air_Turbine_Starter',
            // 'Magnetic_Plug_Assembly',
            // 'Output_Shaft',
            // 'Mesh020',
            // 'Starter_Speed_Sensor',
            // 'Oil_Fill',
            // 'Oil_Fill_Plug',
            // 'Plug_Bolt',
            // 'Plug_Packing'
        ];
        viewer.controls.maxAzimuthAngle = viewer.ToEul(90);
        toggleTooltipMode(false);
        //viewer.hideToolTip();
        viewer.toggleElectricCon = !viewer.toggleElectricCon;
        if(viewer.toggleElectricCon){
            //viewer.displayToolTip(availableTooltips);
            viewer.objects.forEach(obj=>{
                if(obj.name == 'Mesh027_1'){
                    focusOnObject(viewer, obj, 5);
                    // obj.updateMatrixWorld();
                    // viewer.arrow4 = createArrow(0.1); // smaller arrow
                    // viewer.arrow4.position.copy(obj.position); // place at object center
                    // viewer.arrow4.position.z = -4.5
                    // viewer.arrow4.position.x = -3.9
                    // viewer.arrow4.position.y = 1
                    // viewer.arrow4.rotation.y = -90;
                    // viewer.arrow4.rotation.z = -1.7
                    // viewer.scene.add(viewer.arrow4)
                    // console.log('arrow added 5');
                }


            })
        }
        else{
            viewer.scene.remove(viewer.arrow4);
            toggleTooltipMode(false);
            //viewer.hideToolTip();
                const newavailableTooltips = [
                // 'STARTER_ctrl_1',
                'Air_Inlet_Housing',
                // 'Air_Turbine_Starter',
                'Magnetic_Plug_Assembly',
                'Output_Shaft',
                'Mesh027_1',
                'Starter_Speed_Sensor',
                'Oil_Fill',
                // 'Oil_Fill_Plug',
                // 'Plug_Bolt',
                // 'Plug_Packing'
            ];
            //viewer.displayToolTip(availableTooltips); 
            toggleTooltipMode(true);
            // document.getElementById('circle-pointer1').style.visibility = 'visible';        
            viewer.objects.forEach(obj=>{
                if(obj.name == 'STARTER_ctrl_1'){
                    focusOnObject(viewer, obj);
                }
            })            
        }

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

export function oilFill(viewer){
        // ✅ Always make the first task visible when starting oil fill
    const task1 = document.getElementById('oilFillTaskBtns1');
    const task2 = document.getElementById('oilFillTaskBtns2');
    const task3 = document.getElementById('oilFillTaskBtns3');
    const task4 = document.getElementById('oilFillTaskBtns4');

    // Hide all first
    [task1, task2, task3, task4].forEach(el => el.style.visibility = 'hidden');
    // Show only first
    task1.style.visibility = 'visible';
    document.getElementById('oilFillTaskBtns1').addEventListener('click',()=>{
        viewer.objects.forEach(obj=>{
            if(obj.name == 'Plug_Bolt'){
                gsap.to(obj.position,{
                    y : 18,
                    duration : 1.5,
                    ease : 'power3.inOut',
                    onComplete : ()=>{
                        document.getElementById('oilFillTaskBtns1').style.visibility = 'hidden'
                        document.getElementById('oilFillTaskBtns2').style.visibility = 'visible'
                    }
                })
            }
        })
    })
    document.getElementById('oilFillTaskBtns2').addEventListener('click',()=>{
        viewer.objects.forEach(obj=>{
            if(obj.name == 'Oil_Fill_Plug'){
                 gsap.to(obj.position,{
                    y : 12,
                    duration : 1.5,
                    ease : 'power3.inOut',
                    onComplete : ()=>{
                        document.getElementById('oilFillTaskBtns1').style.visibility = 'hidden'
                        document.getElementById('oilFillTaskBtns2').style.visibility = 'hidden'
                        document.getElementById('oilFillTaskBtns3').style.visibility = 'visible'
                    }
                })
            }
        })        
    })
    document.getElementById('oilFillTaskBtns3').addEventListener('click',()=>{
        viewer.objects.forEach(obj=>{
            if(obj.name == 'Plug_Packing'){
                 gsap.to(obj.position,{
                    y : 6,
                    duration : 1.5,
                    ease : 'power3.inOut',
                    onComplete : ()=>{
                        document.getElementById('oilFillTaskBtns1').style.visibility = 'hidden'
                        document.getElementById('oilFillTaskBtns2').style.visibility = 'hidden'
                        document.getElementById('oilFillTaskBtns3').style.visibility = 'hidden'
                        document.getElementById('oilFillTaskBtns4').style.visibility = 'visible'
                    }
                })
            }
        })        
    })
    document.getElementById('oilFillTaskBtns4').addEventListener('click',()=>{
        viewer.objects.forEach(obj=>{
            if(obj.name == 'Plug_Packing'){
                obj.material = obj.material.clone();
                obj.material.transparent = true;
                obj.material.opacity = 1
                gsap.to(obj.material,{
                    opacity : 0,
                    duration : 1.5,
                    ease : 'power3.inOut',
                    onComplete : ()=>{
                        setTimeout(()=>{
                            obj.material.opacity = 0
                            gsap.to(obj.material,{
                                opacity : 1,
                                duration : 1.5,
                                ease : 'power3.inOut',
                            })
                        },200)
                        document.getElementById('oilFillTaskBtns1').style.visibility = 'hidden'
                        document.getElementById('oilFillTaskBtns2').style.visibility = 'hidden'
                        document.getElementById('oilFillTaskBtns3').style.visibility = 'hidden'
                        document.getElementById('oilFillTaskBtns4').style.visibility = 'hidden'
                    }
                })
            }
        })        
    })
}
