import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Ground } from "./Ground.js";
import { Control } from "./Player";
import { Physics } from "@react-three/cannon";

import useRenderTarget from "../functions/use-render-target";

export default function PlaygroundCanvas() {
  return (
    <Canvas
      id="canvas"
      concurrent
      colorManagement
      gl={{ powerPreference: "high-performance" }}
      camera={{
        near: 0.1,
        far: 500,
      }}
      style={{
        zIndex: "0",
        width: "100%",
        position: "fixed",
        top: "0",
        left: "0",
        background: "radial-gradient(#00ff04, pink, white)",
      }}
    >
      {" "}
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

function Scene() {
  const [cubeCamera, renderTarget] = useRenderTarget();

  return (
    <>
      <Ground texture="tinyvr3.jpg" />

      <Physics gravity={[0, 0, 0]}>
        <Control />
      </Physics>

      <cubeCamera
        name="cubeCamera"
        ref={cubeCamera}
        args={[0.1, 100000, renderTarget]}
        position={[0, 0, 0]}
      />

      <ambientLight />
    </>
  );
}
