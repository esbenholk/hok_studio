import React, {
  forwardRef,
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "react-three-fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  CurveModifier,
  MeshDistortMaterial,
} from "@react-three/drei";
import { TorusKnotHelper } from "./Util";

import * as THREE from "three";

import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import useRenderTarget from "../functions/use-render-target";

export default function InfiniteModel() {
  return (
    <Canvas
      concurrent
      colorManagement
      gl={{ powerPreference: "high-performance" }}
      camera={{
        position: [0, 0, 80],
        near: 0.1,
        far: 500,
      }}
      style={{
        height: window.innerHeight,
        zIndex: "-1",
        width: window.innerWidth,
        position: "fixed",
        background: "radial-gradient(purple, black, grey)",
      }}
    >
      <Scene />
    </Canvas>
  );
}

function Scene() {
  const [cubeCamera, renderTarget] = useRenderTarget();

  return (
    <Suspense fallback={null}>
      <OrbitControls autoRotateSpeed={(-60 * 0.15) / 2} />

      <PerspectiveGrid />

      <cubeCamera
        layers={[]}
        name="cubeCamera"
        ref={cubeCamera}
        args={[0.1, 100000, renderTarget]}
        position={[0, 0, 0]}
      />
      <Environment preset="warehouse" />

      <CurvyModel p={3} q={4} speed={0.05} envMap={renderTarget.texture} />

      <ambientLight />
    </Suspense>
  );
}

function CurvyModel({
  radius = 5,
  tubularSegments = 64,
  p = 2,
  q = 3,
  speed = 0.0001,
  envMap,
  ...props
}) {
  const { curve } = useMemo(() => {
    const curve = TorusKnotHelper.generateCurve(radius, tubularSegments, p, q);
    const points = curve.getPoints(300);
    return { curve, points };
  }, [radius, tubularSegments, p, q]);
  const flowRef = useRef();
  useFrame((_, delta) => {
    flowRef.current && flowRef.current.moveAlongCurve(delta * speed);
  });
  return (
    <>
      <group {...props} position={[0, 10, 0]} rotation={[0, 0, 0]}>
        <CurveModifier ref={flowRef} curve={curve}>
          <Model envMap={envMap} />
        </CurveModifier>
      </group>
    </>
  );
}

// CurveModifier needs to pass a ref, so we forwardRef
const Model = forwardRef((props, ref) => {
  const gltf = useGLTF("logo/scene.gltf");

  console.log(props.envMap);

  const mirrorMaterial = new THREE.MeshPhongMaterial({
    opacity: 0.999,
    envMap: props.envMap,
    metalness: 0.9,
    reflectivity: 0.9,
    refractionRatio: 0.1,
    transparent: true,
    shininess: 1000,
  });

  if (gltf) {
    let model = gltf.scene;
    // model.scale.set(50, 50, 50);
    model.traverse((children) => {
      console.log(model);
      if (children instanceof THREE.Mesh) {
        // maps mirrorMaterial onto all meshes in obj file.
        children.castShadow = true;
        children.receiveShadow = true;
        children.geometry.computeVertexNormals();
        children.material = mirrorMaterial;
      }
    });
  }

  useLayoutEffect(() => {
    let model = gltf.scene;
    model.scale.set(10, 10, 10);
    model.rotateZ(Math.PI / 2);
    model.rotateY(Math.PI / 2);
  }, [gltf.scene]);

  console.log(gltf);

  // return <mesh ref={ref} args={[geometry, material]}{...props} />;
  return gltf ? <primitive ref={ref} object={gltf.scene} /> : null;
});

const PerspectiveGrid = () => {
  return (
    <group position-z={-0}>
      <group rotation-z={Math.PI * -0.5}>
        <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
          <planeBufferGeometry args={[100, 255]} />
          <meshStandardMaterial attach="material" color="blue" />
        </mesh>
      </group>

      <group rotation-z={Math.PI * 1}>
        <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
          <planeBufferGeometry args={[100, 255]} />
          <meshStandardMaterial attach="material" color="red" />
        </mesh>
      </group>

      <group rotation-z={Math.PI * 0}>
        <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
          <planeBufferGeometry args={[100, 255]} />
          <meshStandardMaterial attach="material" color="yellow" />
        </mesh>
      </group>

      <group rotation-z={Math.PI * 0.5}>
        <mesh rotation-x={Math.PI * -0.5} position-y={-40}>
          <planeBufferGeometry args={[100, 255]} />
          <meshStandardMaterial attach="material" color="hotpink" />
        </mesh>
      </group>
    </group>
  );
};
