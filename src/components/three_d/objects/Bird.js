import React, { useEffect, useRef, useState } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export default function Bird({ speed, factor, url, ...props }) {
  console.log(url);
  const [gltf, objects] = useLoader(GLTFLoader, "/stork.glb");

  const group = useRef();
  const [mixer] = useState(() => new THREE.AnimationMixer());
  useEffect(() => {
    mixer.clipAction(gltf.animations[0], group.current).play();
    return () => gltf.animations.forEach((clip) => mixer.uncacheClip(clip));
  }, []);

  useFrame((state, delta) => {
    group.current.rotation.y +=
      Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5;
    mixer.update(delta * speed);
  });

  return (
    <group ref={group}>
      <scene name="Scene" {...props} scale={[0.8, 0.8, 0.8]}>
        <mesh
          name="Object_0"
          morphTargetDictionary={objects[1].morphTargetDictionary}
          morphTargetInfluences={objects[1].morphTargetInfluences}
          rotation={[1.5707964611537577, 0, 0]}
        >
          <bufferGeometry attach="geometry" {...objects[1].geometry} />
          <meshStandardMaterial
            attach="material"
            {...objects[1].material}
            color="black"
          />
        </mesh>
      </scene>
    </group>
  );
}
