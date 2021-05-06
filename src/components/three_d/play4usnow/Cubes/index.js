import React, { useRef } from "react";
import { map } from "lodash";
import { useFrame } from "@react-three/fiber";

import Cube from "./Cube";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ video }) => {
  const group = useRef();

  useFrame(() => {
    group.current.rotation.y += 0.008;
  });

  const nodesCubes = map(new Array(15), (el, i) => {
    return <Cube key={i} video={video} />;
  });

  return (
    <group ref={group} position={[0, 0, 20]}>
      {nodesCubes}
    </group>
  );
};
