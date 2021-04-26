import React, { Suspense, useRef } from "react";
import { Canvas } from "react-three-fiber";

import DataCanvas from "../materials/data_code";

import Play4UsNowCanvasAnimation from "./Play4UsNowAnimation.js";

function Play4UsNowCanvas() {
  const videoRef = useRef();

  return (
    <>
      <DataCanvas />

      <video
        ref={videoRef}
        loop
        crossOrigin="anonymous"
        style={{ display: "none" }}
      >
        <source src="trailer.mp4" />
      </video>

      <Canvas
        concurrent
        colorManagement
        gl={{ powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 50], near: 0.1, far: 100 }}
        style={{ height: window.innerHeight, zIndex: "-1" }}
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
