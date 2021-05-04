import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import * as THREE from "three";
import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, extend, useThree } from "react-three-fiber";
extend({ EffectComposer, RenderPass, UnrealBloomPass });

export default function Bloom({ children }) {
  const { gl, camera, size, scene } = useThree();
  const ref = useRef();
  const composer = useRef();
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
    size,
  ]);
  useEffect(
    () => void scene && composer.current.setSize(size.width, size.height),
    [size]
  );
  useFrame(() => scene && composer.current.render(), 1);
  return (
    <>
      <scene ref={ref}>{children}</scene>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
        <unrealBloomPass attachArray="passes" args={[aspect, 4, 3, -3]} />
      </effectComposer>
    </>
  );
}
