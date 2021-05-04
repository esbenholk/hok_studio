import React, { useEffect, useState } from "react";
import { useLoader, useFrame } from "react-three-fiber";

import { useBox } from "@react-three/cannon";

import create from "zustand";
import { nanoid } from "nanoid";

import { TextureLoader } from "three/src/loaders/TextureLoader.js";

export const useCubeStore = create((set) => ({
  cubes: [],
  addCube: (x, y, z) =>
    set((state) => ({
      cubes: [...state.cubes, <Cube key={nanoid()} position={[x, y, z]} />],
    })),
}));

export const Cube = (props) => {
  const [hover, set] = useState(null);

  const addCube = useCubeStore((state) => state.addCube);

  const texture = useLoader(TextureLoader, "tinyvr3.jpg");

  const [ref] = useBox({
    type: "Static",
    ...props,
  });
  console.log(props);

  return (
    <mesh
      castShadow
      ref={ref}
      onPointerMove={(e) => {
        e.stopPropagation();
        set(Math.floor(e.faceIndex / 2));
      }}
      onPointerLeave={(e) => {
        set(null);
      }}
      onClick={(e) => {
        e.stopPropagation();

        const faceIndex = Math.floor(e.faceIndex / 2);

        const { x, y, z } = ref.current.position;

        switch (faceIndex) {
          case 4: {
            addCube(x, y, z + 1);
            return;
          }
          case 2: {
            addCube(x - 1, y, z);
            return;
          }
          case 1: {
            addCube(x - 1, y, z - 1);
            return;
          }
          case 5: {
            addCube(x, y, z - 1);
            return;
          }
          case 3: {
            addCube(x, y + 1, z);
            return;
          }
          default: {
            addCube(x + 1, y, z);
            return;
          }
        }
      }}
    >
      <boxBufferGeometry attach="geometry" />

      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial
          receiveShadow
          attachArray="material"
          map={texture}
          key={index}
          color={hover === index ? "grey" : "white"}
        />
      ))}
    </mesh>
  );
};
