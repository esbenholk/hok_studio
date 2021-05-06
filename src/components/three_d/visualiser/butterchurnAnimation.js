import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame, useThree, extend } from "react-three-fiber";
import { EffectComposer, RenderPass } from "postprocessing";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

extend({ EffectComposer, RenderPass, UnrealBloomPass });

const HTMLCanvasMaterial = ({ canvas }) => {
  const { gl } = useThree();

  let texture = new THREE.CanvasTexture(canvas.current.state.canvas);

  texture.anisotropy = gl.capabilities.getMaxAnisotropy();
  texture.needsUpdate = true;
  texture.flipY = true;
  texture.flipX = false;

  useFrame(() => {
    if (texture) {
      texture.needsUpdate = true;
    }
  });

  return (
    <meshStandardMaterial
      color="#FFFFFF"
      attach="material"
      distort={0} // Strength, 0 disables the effect (default=1)
      speed={1} // Speed (default=1)
      roughness={9}
      reflectivity={0.9}
      refractionRatio={0.1}
      transparent={true}
      map={texture}
      side={THREE.DoubleSide}
      shininess={1000}
      depthTest={true}
    />
  );
};

const PerspectiveGrid = ({ canvas }) => {
  return (
    <group position-z={-0}>
      <group rotation-z={Math.PI * -0.5}>
        <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
          <planeBufferGeometry args={[100, 255]} />
          <HTMLCanvasMaterial canvas={canvas} />
        </mesh>
      </group>

      <group rotation-z={Math.PI * 1}>
        <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
          <planeBufferGeometry args={[100, 255]} />
          <HTMLCanvasMaterial canvas={canvas} />
        </mesh>
      </group>

      <group rotation-z={Math.PI * 0}>
        <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
          <planeBufferGeometry args={[100, 255]} />
          <HTMLCanvasMaterial canvas={canvas} />
        </mesh>
      </group>

      <group rotation-z={Math.PI * 0.5}>
        <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
          <planeBufferGeometry args={[100, 255]} />
          <HTMLCanvasMaterial canvas={canvas} />
        </mesh>
      </group>
    </group>
  );
};

export default function AudioVisualiserScene({ canvas }) {
  const new_canvas = canvas;

  const ref = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(time / 4);
    ref.current.rotation.y = Math.sin(time / 2);
  });

  return (
    <>
      <group>
        <PerspectiveGrid canvas={new_canvas} />

        <mesh ref={ref} position={[0, 0, 50]}>
          <boxGeometry args={[20, 20, 20]} attach="geometry" />
          <HTMLCanvasMaterial canvas={new_canvas} />
        </mesh>
      </group>
    </>
  );
}
