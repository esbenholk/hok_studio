import React, { useEffect, useRef, useLayoutEffect } from "react";
import { useThree } from "react-three-fiber";

export const Camera = (props) => {
  const ref = useRef();
  const set = useThree(({ set }) => set);

  useLayoutEffect(() => {
    set({ camera: ref.current });
  }, []);

  return <perspectiveCamera ref={ref} {...props} />;
};
