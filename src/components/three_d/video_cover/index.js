import * as THREE from "three";
import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Reflector, Text, useTexture, Environment } from "@react-three/drei";

const color = "white";

function VideoText({ clicked, ...props }) {
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: "/trailer.mp4",
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    })
  );
  useEffect(() => void (clicked && video.play()), [video, clicked]);
  return (
    <>
      <Text
        font="/fonts/nemisis.otf"
        fontSize={3}
        letterSpacing={-0.02}
        {...props}
        position={[0, 3.3, -2]}
      >
        HOUSE OF
        <meshBasicMaterial toneMapped={false}>
          <videoTexture
            attach="map"
            args={[video]}
            encoding={THREE.sRGBEncoding}
          />
        </meshBasicMaterial>
      </Text>
      <Text
        font="/fonts/avaro.otf"
        fontSize={3}
        letterSpacing={-0.06}
        {...props}
        position={[0, 0.7, -2]}
      >
        KILLING
        <meshBasicMaterial toneMapped={true}>
          <videoTexture
            attach="map"
            args={[video]}
            encoding={THREE.sRGBEncoding}
          />
        </meshBasicMaterial>
      </Text>
    </>
  );
}

function Ground() {
  const [floor, normal] = useTexture([
    "/SurfaceImperfections003_1K_var1.jpg",
    "/SurfaceImperfections003_1K_Normal.jpg",
  ]);
  return (
    <Reflector
      resolution={512}
      args={[70, 40]}
      mirror={0.4}
      mixBlur={8}
      mixStrength={1}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      blur={[400, 100]}
    >
      {(Material, props) => (
        <Material
          color={color}
          metalness={0.4}
          roughnessMap={floor}
          normalMap={normal}
          normalScale={[1, 1]}
          {...props}
        />
      )}
    </Reflector>
  );
}

export default function VideoCover() {
  const [clicked, setClicked] = useState(true);
  const [ready, setReady] = useState(false);
  const store = { clicked, setClicked, ready, setReady };

  return (
    <>
      <Canvas
        id="canvas"
        concurrent
        colorManagement
        shadowMap={true}
        RGB
        camera={{ position: [0, 0, 10], far: 100, near: 0.1, fov: 60 }}
        gl={{
          powerPreference: "high-performance",
          alpha: true,
          antialias: true,
          stencil: false,
          depth: false,
        }}
        style={{
          zIndex: "0",
          width: "100%",
          position: "fixed",
          top: "0",
          left: "0",
          background: "radial-gradient(#00ff04, pink, white)",
        }}
      >
        <fog attach="fog" args={["#00ff1d", 5, 50]} />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <VideoText {...store} />
            <Ground />
          </group>
          <Environment files="vr_landscape.hdr" background={false} />

          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={0.3} />
          <directionalLight position={[-20, 0, -10]} intensity={0.7} />
        </Suspense>
      </Canvas>
    </>
  );
}
