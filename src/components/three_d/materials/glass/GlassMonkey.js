import { useGLTF } from "@react-three/drei";
import React from "react";

import useTransmissionMaterial from "./use-material";
import usePostprocessing from "./use-postprocessing";

export default function GlassMonkey(props) {
  const { nodes } = useGLTF("/logo/suzanne-draco.glb", true);
  const [ref, pipeline] = useTransmissionMaterial({
    frontMaterial: {
      color: "white",
    },
    backMaterial: {
      color: "lightblue",
    },
    transmissionMaterial: {
      transmission: 1,
      transmissionIntensity: 5,
      distortionIntensity: 0.4,
      fresnel: 3,
      fresnelAmplifier: 2,
    },
  });

  usePostprocessing(pipeline);
  return (
    <mesh
      scale={[10, 10, 10]}
      ref={ref}
      geometry={nodes.Suzanne.geometry}
      position={props.position}
      rotation={props.rotation}
    />
  );
}
