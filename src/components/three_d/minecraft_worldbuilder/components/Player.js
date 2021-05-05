import React, { useEffect, useRef, useState } from "react";
import { useSphere } from "@react-three/cannon";
import { useThree, useFrame } from "react-three-fiber";
import { FPVControls } from "./FPVControls";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { Vector3 } from "three";
import { OrbitControls } from "@react-three/drei";

const SPEED = 6;

const Player = (props) => {
  const { camera } = useThree();

  const {
    moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    jump,
  } = useKeyboardControls();

  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    ...props,
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
  }, [api.velocity]);

  useFrame(() => {
    camera.position.copy(ref.current.position);
    const direction = new Vector3();

    const frontVector = new Vector3(
      0,
      0,
      (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
    );
    const sideVector = new Vector3(
      (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
      0,
      0
    );

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1].toFixed(2)) < 0.05) {
      api.velocity.set(velocity.current[0], 8, velocity.current[2]);
    }
  });
  return (
    <>
      <FPVControls starter={props.starter} />

      <mesh ref={ref} />
    </>
  );
};

export const Control = (props) => {
  const [active, setActive] = useState(false);
  const { camera } = useThree();

  useEffect(() => {
    document.getElementById("canvas").addEventListener("click", () => {
      if (!active) {
        setActive(true);
      }
    });
  }, []);

  return (
    <>
      {active ? (
        <Player position={[camera.position.x, 3, camera.position.y]} />
      ) : (
        <>
          <OrbitControls
            autoRotate
            autoRotateSpeed={(-60 * 0.15) / 5}
            maxZoom={30}
            minZoom={10}
            minDistance={10}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2 - 0.1}
          />
        </>
      )}
    </>
  );
};
