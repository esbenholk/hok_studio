import React from "react";
import { TextureLoader, MirroredRepeatWrapping } from "three";

export const Ground = (props) => {
  const texture = new TextureLoader().load(props.texture);

  texture.wrapS = MirroredRepeatWrapping;
  texture.wrapT = MirroredRepeatWrapping;
  texture.repeat.set(100, 100);

  return (
    <mesh
      castShadow
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 10, 0]}
    >
      <planeBufferGeometry receiveShadow attach="geometry" args={[100, 100]} />
      <meshStandardMaterial map={texture} attach="material" />
    </mesh>
  );
};
