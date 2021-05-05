import { Box, Sphere } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { useFrame, useThree, useLoader } from "react-three-fiber";
import { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import useRenderTarget from "../functions/use-render-target";

import { DistortTorusMaterial } from "../materials/DistortTorusMaterial";

const ImageMaterial = ({ url, side }) => {
  const imageRef = useRef(url);
  const [current, setCurrent] = useState(true);

  useEffect(() => {
    if (imageRef.current !== url && imageRef.current) {
      if (current) {
        setCurrent(false);
      } else {
        setCurrent(true);
      }

      imageRef.current = url;
    }
  }, [url, current]);

  let image_texture = useLoader(TextureLoader, url);

  if (current) {
    return (
      <meshBasicMaterial
        attach="material"
        side={side}
        map={image_texture}
        opacity={1}
        depthTest={false}
      />
    );
  } else {
    return (
      <meshBasicMaterial
        attach="material"
        side={side}
        map={image_texture}
        opacity={1}
        depthTest={false}
      />
    );
  }
};

function VideoMaterial({ url, side }) {
  const videoRef = useRef(url);

  const [video, setVideo] = useState(createVideo);
  const [current, setCurrent] = useState(true);

  function createVideo() {
    const vid = document.createElement("video");
    vid.src = url;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsinline = true;
    vid.play();
    return vid;
  }

  useEffect(() => {
    if (videoRef.current !== url && videoRef.current) {
      setVideo(createVideo());
      if (current) {
        setCurrent(false);
      } else {
        setCurrent(true);
      }

      videoRef.current = url;
    }
  }, [url]);

  return (
    <meshBasicMaterial depthTest={false} side={side} opacity={1}>
      {current && <videoTexture attach="map" args={[video]} />}
      {!current && <videoTexture attach="map" args={[video]} />}
    </meshBasicMaterial>
  );
}

///model loads alongside url of background image to envMap it on a texture cube for refraction
const Model = ({ envMap }) => {
  const mirrorMaterial = new THREE.MeshPhongMaterial({
    opacity: 0.999,
    envMap: envMap,
    combine: THREE.MixOperation,
    reflectivity: 0.9,
    refractionRatio: 0.1,
    transparent: true,
    side: THREE.FrontSide,
    shininess: 1000,
  });

  var logo_url = "logo/AlienFetus.glb";

  //load object and store it with useState (unnecessary as Logo Model remains the same)
  const gltf = useLoader(GLTFLoader, logo_url);

  if (gltf) {
    let model = gltf.scene;
    model.scale.set(50, 50, 50);
    model.traverse((children) => {
      if (children instanceof THREE.Mesh) {
        // maps mirrorMaterial onto all meshes in obj file.
        children.castShadow = true;
        children.receiveShadow = true;
        children.geometry.computeVertexNormals();
        children.material = mirrorMaterial;
      }
    });
  }

  return gltf ? <primitive object={gltf.scene} /> : null;
};

//places model inside Mesh which is rotation on x,y,z axis
const Animation = ({ envMap }) => {
  const model = useRef();

  useFrame(() => {
    if (model.current) {
      model.current.rotation.z += 0.003;
      model.current.rotation.x += 0.003;
      model.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={model} position={[0, 0, 0]} scale={[0.7, 0.7, 0.7]}>
      <Model envMap={envMap} />
    </group>
  );
};

function Swarm({ count, envMap }) {
  const mesh = useRef();
  const [dummy] = useState(() => new THREE.Object3D());

  const mirrorMaterial = new THREE.MeshPhongMaterial({
    opacity: 0.999,
    envMap: envMap,
    combine: THREE.MixOperation,
    reflectivity: 0.9,
    refractionRatio: 0.1,
    transparent: true,
    side: THREE.FrontSide,
    shininess: 1000,
  });

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -20 + Math.random() * 40;
      const yFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.max(1.5, Math.cos(t) * 5);
      particle.mx +=
        (state.mouse.x * state.viewport.width - particle.mx) * 0.02;
      particle.my +=
        (state.mouse.y * state.viewport.height - particle.my) * 0.02;
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={mesh}
        args={[null, null, count]}
        castShadow
        receiveShadow
      >
        <sphereBufferGeometry args={[1, 32, 32]} />
        <meshPhongMaterial material={mirrorMaterial} />
      </instancedMesh>
    </>
  );
}

function DistortedTorus() {
  const ref = useRef();
  const RADIUS = 4;
  const { size, viewport } = useThree();
  const [rEuler, rQuaternion] = useMemo(
    () => [new THREE.Euler(), new THREE.Quaternion()],
    []
  );
  useFrame(({ mouse }) => {
    rEuler.set(
      (mouse.y * viewport.height) / 300,
      (mouse.x * viewport.width) / 300,
      0
    );
    ref.current.quaternion.slerp(rQuaternion.setFromEuler(rEuler), 0.1);
  });
  return (
    <>
      <Sphere ref={ref} args={[RADIUS, 516, 516]}>
        <DistortTorusMaterial
          color="green"
          metalness={0.2}
          roughness={1}
          clearcoat={0.7}
          radius={RADIUS}
          resolution={[size.width, size.height]}
        />
      </Sphere>
    </>
  );
}

function Scene({ image_url, image, video_url, video }) {
  const [cubeCamera, renderTarget] = useRenderTarget();

  /// <Animation envMap={renderTarget.texture}/>
  return (
    <>
      <group>
        <Box
          layers={[11]}
          name="reflectioncube"
          args={[1, 1, 1]}
          position={[0, 0, 0]}
        >
          {image && <ImageMaterial url={image_url} side={THREE.BackSide} />}

          {video && <VideoMaterial url={video_url} side={THREE.BackSide} />}
        </Box>

        <ambientLight intensity={1.5} />
        <pointLight position={[100, 100, 100]} intensity={2} castShadow />
        <pointLight position={[-100, -100, -100]} intensity={5} color="red" />
        <Swarm count={150} envMap={renderTarget.texture} />
        <Animation envMap={renderTarget.texture} />

        <group position={[0, 0, 0]}>
          <DistortedTorus />
        </group>

        <cubeCamera
          layers={[11]}
          name="cubeCamera"
          ref={cubeCamera}
          args={[0.1, 100000, renderTarget]}
          position={[0, 0, 0]}
        />
      </group>
    </>
  );
}

export default Scene;
