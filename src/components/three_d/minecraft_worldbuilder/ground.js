import React, { useEffect, useRef } from "react";
import { useThree, useLoader } from "react-three-fiber";
import { MirroredRepeatWrapping } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { usePlane } from "@react-three/cannon";

export const Ground = (props) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    ...props,
  }));
  const texture = useLoader(TextureLoader, "tinyvr3.jpg");
  texture.wrapS = MirroredRepeatWrapping;
  texture.wrapT = MirroredRepeatWrapping;
  texture.repeat.set(240, 240);
  return (
    <>
      <mesh receiveShadow ref={ref}>
        <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
        <meshStandardMaterial attach="material" map={texture} />
      </mesh>
    </>
  );
};
