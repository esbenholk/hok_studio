import React, { Suspense, useRef } from "react";
import { Canvas } from "react-three-fiber";

import DataCanvas from "../materials/matrix-data_canvas";

import Play4UsNowCanvasAnimation from "./Play4UsNowAnimation.js";

function Play4UsNowCanvas() {
  const videoRef = useRef();

  return (
    <>
      <DataCanvas />

      <Canvas
        concurrent
        colorManagement
        gl={{ powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 70], near: 0.1, far: 500 }}
        style={{
          zIndex: "0",
          width: "100%",
          position: "fixed",
          top: "0",
          left: "0",
          background: "radial-gradient(purple, black, grey)",
        }}
      >
        <fog attach="fog" args={["red", 40, 100]} />

        <pointLight position={[-10, -10, -10]} />
        <pointLight intensity={0.2} position={[0, 0, 50]} />
        <color attach="background" args={["red"]} />

        <Suspense fallback={null}>
          <Play4UsNowCanvasAnimation video={videoRef} />
        </Suspense>
      </Canvas>
    </>
  );
}

export default Play4UsNowCanvas;
