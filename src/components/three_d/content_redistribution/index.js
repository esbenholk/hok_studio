import React, { Suspense, useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";

import { Control } from "../playground/Player";
import { Physics } from "@react-three/cannon";

import { softShadows, Loader, Environment, Sky } from "@react-three/drei";
import { useReflector } from "../functions/use-reflector";
import usePostprocessing from "../functions/use-postprocessing";

import { TextureLoader } from "three";
import * as THREE from "three";

softShadows();

export default function ContentRedistributionCanvas(imageUrls) {
  return (
    <>
      <Canvas
        id="canvas"
        concurrent
        colorManagement
        shadowMap={true}
        RGB
        camera={{ position: [0, 0, 10], far: 100, near: 0.1, fov: 60 }}
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
          stencil: false,
          depth: false,
        }}
        style={{
          zIndex: "0",
          width: "100%",
          position: "fixed",
          top: "0",
          left: "0",
          background: "radial-gradient(purple, black, grey)",
        }}
      >
        <fogExp2 attach="fog" args={[0xbffffd, 0.049]} />
        <Sky
          distance={450000} // Camera distance (default=450000)
          sunPosition={[0, 10, 0]} // Sun position normal (defaults to inclination and azimuth if not set)
          inclination={1} // Sun elevation angle from 0 to 1 (default=0)
          azimuth={0.25}
        />

        <ambientLight intensity={0.3} />
        <Suspense fallback={null}>
          <Scene props={imageUrls} />
          <Environment files="vr_landscape.hdr" background={false} />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Cubes({ imageUrls, material }) {
  const ref = useRef();

  return imageUrls.map((imageUrl, index) => (
    <mesh
      key={index}
      ref={ref}
      position={[
        randomIntFromInterval(-50, 50),
        Math.floor(Math.random() * 10),
        randomIntFromInterval(-50, 50),
      ]}
      castShadow
      receiveShadow
    >
      <boxBufferGeometry
        attach="geometry"
        args={[5, 5, 5]}
        material={material}
      />
      <Suspense fallback={null}>
        <ImageTextureMaterial imageUrl={imageUrl} material={material} />
      </Suspense>
    </mesh>
  ));
}

const ImageTextureMaterial = (imageUrl, material) => {
  const texture = useLoader(TextureLoader, imageUrl.imageUrl);
  return (
    <meshStandardMaterial
      attach="material"
      roughness={1}
      color="white"
      map={texture}
      material={material}
    />
  );
};

function Scene(props) {
  const material = useRef();
  const lightRef = useRef();
  const lightRef1 = useRef();
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.5;
    lightRef.current.position.x = Math.sin(t) * 50;
    lightRef1.current.position.x = Math.sin(t) * 50;

    lightRef.current.position.z = Math.cos(t) * 50;
    lightRef1.current.position.z = Math.sin(t) * 50;

    lightRef1.current.position.y = Math.sin(t) * 50;

    if (groupRef) {
      groupRef.current.children.forEach((element) => {
        element.rotation.x = Math.sin(t) * 0.05;
        element.rotation.y = Math.sin(t) * 0.05;
        element.rotation.z = Math.sin(t) * 0.05;
      });
    }
  });

  const [meshRef, ReflectorMaterial, passes] = useReflector();
  usePostprocessing(passes);

  console.log("group", groupRef);

  return (
    <group position-z={-5}>
      <group ref={groupRef}>
        <Cubes imageUrls={props.props.imageUrls} material={material.current} />
      </group>

      <mesh
        receiveShadow
        ref={meshRef}
        rotation-x={-Math.PI / 2}
        position-y={-3.001}
      >
        <planeBufferGeometry
          receiveShadow
          attach="geometry"
          args={[300, 300]}
        />

        <ReflectorMaterial
          metalness={0.8}
          roughness={0.3}
          clearcoat={0.5}
          reflectorOpacity={0.3}
          args={[300, 300]}
        />
      </mesh>

      <spotLight
        ref={lightRef}
        position={[20, 20, 10]}
        intensity={3}
        castShadow
        color="#00e9ff"
        angle={Math.PI / 3}
        penumbra={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <spotLight
        ref={lightRef1}
        position={[20, 20, 10]}
        intensity={0.2}
        castShadow
        color="#e1ff00"
        angle={Math.PI / 3}
        penumbra={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Physics gravity={[0, 0, 0]}>
        <Control />
      </Physics>
    </group>
  );
}
