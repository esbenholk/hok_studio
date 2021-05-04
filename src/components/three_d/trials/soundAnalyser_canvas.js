import * as THREE from "three";
import React, { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, extend, useThree } from "react-three-fiber";
import { PositionalAudio, OrbitControls } from "@react-three/drei";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { MeshDistortMaterial } from "@react-three/drei";

extend({ EffectComposer, RenderPass, UnrealBloomPass });

function Analyzer({ sound }) {
  // <Analyzer /> will not run before everything else in the suspense block is resolved.
  // That means <PositionalAudio/>, which executes async, is ready by the time we're here.
  // The next frame (useEffect) is guaranteed(!) to access positional-audios ref.
  const ref = useRef();
  const sphereRef = useRef();
  const analyser = useRef();
  console.log("active sound", sound);

  useEffect(
    () => void (analyser.current = new THREE.AudioAnalyser(sound.current, 32))
  );

  useFrame(({ clock }) => {
    if (analyser.current) {
      const data = analyser.current.getAverageFrequency();
      ref.current.scale.x = ref.current.scale.y = ref.current.scale.z =
        (data / 100) * 2;
      // setDistortion(data / 10000);
    }
  });
  // <meshPhysicalMaterial attach="material" color="#35469C" />

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry attach="geometry" args={[20, 50, 62]} ref={sphereRef} />
        <meshPhysicalMaterial attach="material" color="#35469C" />
      </mesh>
    </group>
  );
}

function PlaySound({ url }) {
  // This component creates a suspense block, blocking execution until
  // all async tasks (in this case PositionAudio) have been resolved.
  const sound = useRef();
  return (
    <Suspense fallback={null}>
      <PositionalAudio url={url} ref={sound} />
      <Analyzer sound={sound} />
    </Suspense>
  );
}

function Bloom({ children }) {
  const { gl, camera, size, scene } = useThree();
  const ref = useRef();
  const composer = useRef();
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
    size,
  ]);
  useEffect(
    () => void scene && composer.current.setSize(size.width, size.height),
    [size]
  );
  useFrame(() => scene && composer.current.render(), 1);
  return (
    <>
      <scene ref={ref}>{children}</scene>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
        <unrealBloomPass attachArray="passes" args={[aspect, 4, 3, -3]} />
      </effectComposer>
    </>
  );
}

export default function SoundAnalyser() {
  return (
    <Canvas
      concurrent
      colorManagement
      gl={{ powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 50], near: 0.1, far: 100 }}
      style={{ height: window.innerHeight, zIndex: "-1" }}
    >
      <rectAreaLight
        intensity={20}
        position={[0, 10, -10]}
        width={30}
        height={30}
        onUpdate={(self) => self.lookAt(new THREE.Vector3(0, 0, 0))}
      />
      <pointLight position={[-10, -10, -10]} />
      <pointLight intensity={0.2} position={[0, 0, 50]} />
      <ambientLight />

      <Bloom>
        <PlaySound url="sounds/afrodisiac.mp3" />
      </Bloom>

      <OrbitControls />
    </Canvas>
  );
}
