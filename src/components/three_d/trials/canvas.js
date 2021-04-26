/* eslint-disable no-empty-pattern */
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./scene";

function R3FCanvas({}) {
  return (
    <>
      <Canvas
        style={{ height: window.innerHeight, zIndex: "-1" }}
        camera={{ fov: 50, position: [0, 0, 40] }}
        colorManagement={false}
        alpha={true}
      >
        <Suspense fallback={null}>
          <Scene
            image_url={"tinyvr3.jpg"}
            video_url={""}
            video={false}
            image={true}
          />
        </Suspense>
      </Canvas>
    </>
  );
}

export default R3FCanvas;
