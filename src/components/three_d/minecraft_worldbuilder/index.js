import React from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { nanoid } from "nanoid";

import { Ground } from "./components/Ground";
import { Cube } from "./components/Cube";
import { Control } from "./components/Player";
// import { Hud } from "./components/Hud";

/* <Hud position={[0, 0, -2]} /> */

import { useStore } from "./hooks/useStore";
import { useInterval } from "./hooks/useInterval";

function MinecraftWorldbuilder() {
  const [cubes, saveWorld] = useStore((state) => [
    state.cubes,
    state.saveWorld,
  ]);

  useInterval(
    () => {
      saveWorld(cubes);
    },
    // every 60 seconds
    60000
  );

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: "-1",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "5px",
            height: "5px",
            backgroundColor: "black",
            zIndex: "9999999",
          }}
        ></div>
      </div>
      <Canvas
        shadowMap
        sRGB
        style={{
          zIndex: "0",
          width: "100%",
          position: "fixed",
          top: "0",
          left: "0",
        }}
        id="canvas"
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        camera={{ position: [50, 5, 50], near: 0.1, far: 500 }}
      >
        <color attach="background" args={["yellow"]} />
        <fog attach="fog" args={["red", 0, 100]} />
        <ambientLight intensity={0.25} />
        <pointLight castShadow intensity={0.7} position={[100, 100, 100]} />
        <pointLight position={[-10, -10, -10]} />
        <pointLight intensity={0.2} position={[0, 0, 50]} />
        <Physics gravity={[0, -30, 0]}>
          <Ground position={[0, 0.5, 0]} />

          <Control />

          {cubes.map((cube) => (
            <Cube key={nanoid()} texture={cube.texture} position={cube.pos} />
          ))}
        </Physics>
      </Canvas>
    </>
  );
}

export default MinecraftWorldbuilder;
