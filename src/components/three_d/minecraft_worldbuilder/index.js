import React, { Suspense, useRef } from "react";
import { Canvas } from "react-three-fiber";
import { Vector3 } from "three";
import { Sky } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { Camera } from "./camera";
import { Ground } from "./ground";
import { Player } from "./player";
// import { useCubeStore, Cube } from "./Cube";

// {cubes.map((cube) => cube)}
// <Cube />

function MinecraftWorldbuilder() {
  //   const cubes = useCubeStore((state) => state.cubes);
  return (
    <>
      <Canvas
        shadowMap
        sRGB
        gl={{ powerPreference: "high-performance", alpha: false }}
        camera={{ position: [0, 0, 0], near: 0.1, far: 500 }}
        style={{
          height: window.innerHeight,
          position: "fixed",
          width: "100%",
          zIndex: "-1",
        }}
      >
        <Camera fov={50} />
        <Sky sunPosition={new Vector3(100, 10, 100)} />
        <ambientLight intensity={0.3} />

        <pointLight castShadow position={[10, 10, 10]} />
        <pointLight castShadow intensity={0.2} position={[0, 0, 50]} />

        <Physics>
          <Ground />
          <Player />
        </Physics>
      </Canvas>
    </>
  );
}

export default MinecraftWorldbuilder;
