import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "react-three-fiber";
import { extend } from "react-three-fiber";
import { PointerLockControls as PointerLockControlsImpl } from "three/examples/jsm/controls/PointerLockControls";

extend({ PointerLockControlsImpl });

export const PointerLockControls = (props) => {
  const controls = useRef();
  const { camera, gl } = useThree();

  useEffect(() => {
    document.addEventListener("click", () => {
      if (controls.current) {
        controls.current.lock();
      }
    });
  }, []);

  return (
    <pointerLockControlsImpl
      ref={controls}
      args={[camera, gl.domElement]}
      {...props}
    />
  );
};
