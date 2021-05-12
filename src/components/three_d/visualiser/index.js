import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";

import Visualizer from "../materials/butterchurn_canvas";
import AudioVisualiserScene from "./butterchurnAnimation.js";

function AudioVisualiser() {
  const canvas_texture_ref = useRef();

  return (
    <>
      <Suspense fallback={null}>
        <Visualizer ref={canvas_texture_ref} />

        <Canvas
          concurrent
          colorManagement
          gl={{ powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 150], near: 0.1, far: 500 }}
          style={{
            zIndex: "0",
            width: "100%",
            position: "fixed",
            top: "0",
            left: "0",
            background: "radial-gradient(#00ff04, pink, white)",
          }}
        >
          <pointLight position={[-10, -10, -10]} />
          <pointLight intensity={0.3} position={[0, 0, 100]} />
          <color attach="background" args={["blue"]} />

          <Suspense fallback={null}>
            <AudioVisualiserScene canvas={canvas_texture_ref} />
          </Suspense>
        </Canvas>
      </Suspense>
    </>
  );
}

export default AudioVisualiser;
