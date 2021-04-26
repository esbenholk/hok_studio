import * as THREE from 'three'
import React, { useMemo, useEffect, useState, useRef } from 'react'
import { createPortal, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer, EffectPass, SavePass, RenderPass, BlendFunction, NoiseEffect, BloomEffect } from 'postprocessing'

import { Text, TorusKnot} from '@react-three/drei'
import { MeshDistortMaterial} from '@react-three/drei'

import { DistortTorusMaterial }  from '../materials/DistortTorusMaterial'
import { Color } from 'three'

import useRenderTarget from '../functions/use-render-target'

import Cubes from "./Cubes";

const HTMLCanvasMaterial = () => {
    const { gl } = useThree()

    const canvas_texture_ref = useRef();


    let canvas = document.getElementById('dataCanvas'), ctx, texture;


    ctx = canvas.getContext("2d")
    texture = new THREE.CanvasTexture(ctx.canvas);
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    texture.flipY = true;
    texture.flipX = false;
  

 
    useFrame(() => {
        texture.needsUpdate = true
    })
     

    return ( 
    
        <MeshDistortMaterial
                    ref={canvas_texture_ref}
                    color="#FFFFFF"
                    attach="material"
                    distort={0} // Strength, 0 disables the effect (default=1)
                    speed={1} // Speed (default=1)
                    roughness={9}
                    reflectivity= {0.9}
                    refractionRatio={0.1}
                    transparent= {true}
                    map = {texture}
                    side = {THREE.DoubleSide}
                    shininess= {1000}
                    depthTest={true}
                >

                <canvasTexture attach="map" image={canvas}/>

        </MeshDistortMaterial>)
}




const PerspectiveGrid = ()=> {

    return ( 
        <group position-z={-0}>

            <group rotation-z={Math.PI * -0.5}>
                <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
                    <planeBufferGeometry args={[100, 255]} />
                    <HTMLCanvasMaterial />
                </mesh>
            </group>

            <group rotation-z={Math.PI * 1}>
                <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
                    <planeBufferGeometry args={[100, 255]} />
                    <HTMLCanvasMaterial />
                </mesh>
            </group>

            <group rotation-z={Math.PI * 0}>
                <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
                    <planeBufferGeometry args={[100, 255]} />
                    <HTMLCanvasMaterial />
                </mesh>
            </group>

            <group rotation-z={Math.PI * 0.5}>
                <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
                    <planeBufferGeometry args={[100, 255]} />
                    <HTMLCanvasMaterial />
                </mesh>
            </group>






    
        </group>

   )

}


function SpinningThing() {
    return (
      <group scale={[0.25, 3.5, 1]}>
        <Text color="black" fontSize={1.5} font="fonts\fonts\TarrgetCondensedItalic.woff">
          PLAY 4 US NOW
        </Text>
      </group>
    )
  }
  
function Cube({ envMap }) {
    const [targetCamera] = useState(new THREE.PerspectiveCamera())
    const [targetScene] = useState(new THREE.Scene())

    const group_mesh = useRef();
  
    const { gl, scene, size, camera } = useThree()
  
    const [composer, savePass] = useMemo(() => {
      const composer = new EffectComposer(gl, { })
      const renderPass = new RenderPass(scene, camera)
      const targetRenderPass = new RenderPass(targetScene, targetCamera)
      const savePass = new SavePass(new THREE.WebGLRenderTarget(2048, 2048))
  
      const BLOOM = new BloomEffect({
        luminanceThreshold: 0.3,
        luminanceSmoothing: 0.1
      })
      const NOISE = new NoiseEffect({
        blendFunction: BlendFunction.COLOR_DODGE
      })
      NOISE.blendMode.opacity.value = 0.1
      const effectPass = new EffectPass(camera, BLOOM)
  
      composer.addPass(targetRenderPass)
      composer.addPass(savePass)
      composer.addPass(renderPass)
      composer.addPass(effectPass)
      return [composer, savePass]
    }, [camera, gl, scene, targetCamera, targetScene])
  




    useEffect(() => {
      composer.setSize(size.width, size.height)
      targetScene.background = new Color('white')
      targetCamera.position.z = 5
    }, [composer, size, targetScene, targetCamera])
    useFrame((_, delta) => void composer.render(delta), 1)
    useFrame(() => {
      group_mesh.current.rotation.z -= 0.005
    
    });
  
    return (
      <group position-z={20} position-y={1} ref={group_mesh}>
    
        {createPortal(<SpinningThing />, targetScene)}

        <TorusKnot args={[10, 5, 1200, 4, 2, 3]}>
          <DistortTorusMaterial
            transparent
            //side={THREE.DoubleSide}
            clearcoat={0}
            roughness={0}
            metalness={1}
            color="white"
            myTexture={savePass.texture}
            envMap = {envMap}
       
            speed={0.1}
          />
        </TorusKnot>
      </group>
    )
  }



export default function Play4UsNowCanvasAnimation({video}) {

  
  const [cubeCamera, renderTarget] = useRenderTarget()

 

  
  return (
    <>
      <group>
   
         
          <PerspectiveGrid/>

          <cubeCamera
            layers={[]}
            name="cubeCamera"
            ref={cubeCamera}
            args={[0.1, 100000, renderTarget]}
            position={[0, 0, 0]}
          />


          <Cubes video={video}/>
     
          <Cube envMap={renderTarget.texture}/>
        
  
      </group>
    </>
  )
}






