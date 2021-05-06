import React, { useMemo, useRef } from "react";
import { random } from "lodash";
import { useFrame } from "react-three-fiber";

import { Sphere } from "@react-three/drei";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const mesh = useRef();
  const time = useRef(0);

  const isActiveRef = useRef(true);

  // position
  const position = useMemo(() => {
    return [
      random(-15, 15, true),
      random(-15, 15, true),
      random(-15, 15, true),
    ];
  }, []);

  // random time mod factor
  const timeMod = useMemo(() => random(0.1, 4, true), []);

  // raf loop
  useFrame(() => {
    mesh.current.rotation.y += 0.01 * timeMod;
    if (isActiveRef.current) {
      time.current += 0.03;
      mesh.current.position.y = position[1] + Math.sin(time.current) * 0.4;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <Sphere visible args={[0.9, 16, 200]}>
        <meshStandardMaterial
          color="#FFFFFF"
          attach="material"
          distort={0.7} // Strength, 0 disables the effect (default=1)
          speed={10} // Speed (default=1)
          roughness={0}
          metalness={0.8}
        />
      </Sphere>
    </mesh>
  );
};
