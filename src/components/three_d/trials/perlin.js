import React, { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, CubeCamera, Sphere } from "@react-three/drei";

import DataCanvas from "../materials/matrix-data_canvas";
import * as THREE from "three";

const fragmentShader = `
varying float qnoise;
  
uniform float time;
uniform bool redhell;

void main() {
  float r, g, b;

  
  if (!redhell == true) {
    r = cos(qnoise + 0.5);
    g = cos(qnoise - 0.5);
    b = 0.0;
  } else {
    r = cos(qnoise + 0.5);
    g = cos(qnoise - 0.5);
    b = abs(qnoise);
  }
  gl_FragColor = vec4(r, g, b, 1.0);
}`;
const vertexShader = `
//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 1.5 * n_xyz;
}

// Turbulence By Jaume Sanchez => https://codepen.io/spite/

varying vec2 vUv;
varying float noise;
varying float qnoise;
varying float displacement;

uniform float time;
uniform float pointscale;
uniform float decay;
uniform float complex;
uniform float waves;
uniform float eqcolor;
uniform bool fragment;

float turbulence( vec3 p) {
  float t = - 0.1;
  for (float f = 1.0 ; f <= 3.0 ; f++ ){
    float power = pow( 2.0, f );
    t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
  }
  return t;
}

void main() {

  vUv = uv;

  noise = (1.0 *  - waves) * turbulence( decay * abs(normal + time));
  qnoise = (2.0 *  - eqcolor) * turbulence( decay * abs(normal + time));
  float b = pnoise( complex * (position) + vec3( 1.0 * time ), vec3( 100.0 ) );
  
  if (fragment == true) {
    displacement = - sin(noise) + normalize(b * 0.5);
  } else {
    displacement = - sin(noise) + cos(b * 0.5);
  }

  vec3 newPosition = (position) + (normal * displacement);
  gl_Position = (projectionMatrix * modelViewMatrix) * vec4( newPosition, 1.0 );
  gl_PointSize = (pointscale);
  //gl_ClipDistance[0];

}
`;

const uniforms = {
  time: {
    type: "f",
    value: 0.1,
  },
  pointscale: {
    type: "f",
    value: 20.0,
  },
  decay: {
    type: "f",
    value: 0.01,
  },
  complex: {
    type: "f",
    value: 0.3,
  },
  waves: {
    type: "f",
    value: 10.0,
  },
  eqcolor: {
    type: "f",
    value: 10.0,
  },
  fragment: {
    type: "i",
    value: true,
  },
  redhell: {
    type: "i",
    value: true,
  },
};

const options = {
  perlin: {
    vel: 0.002,
    speed: 0.0005,
    perlins: 1.0,
    decay: 0.1,
    complex: 0.3,
    waves: 20.0,
    eqcolor: 11.0,
    fragment: true,
    redhell: true,
  },
  spin: {
    sinVel: 0.0,
    ampVel: 80.0,
  },
};

const start = Date.now();

function PerlinTexture(props) {
  const meshRef = useRef();
  const matRef = useRef();

  useFrame(() => {
    const performance = Date.now() * 0.003;
    meshRef.current.rotation.y += options.perlin.vel;
    meshRef.current.rotation.x =
      (Math.sin(performance * options.spin.sinVel) *
        options.spin.ampVel *
        Math.PI) /
      180;
    matRef.current.uniforms["time"].value =
      options.perlin.speed * (Date.now() - start);
  });

  return (
    <mesh {...props} ref={meshRef} wireframe={false} scale={[1, 1, 1]}>
      <points>
        <icosahedronBufferGeometry attach="geometry" args={[3, 7]} />
        <shaderMaterial
          ref={matRef}
          attach="material"
          wireframe={false}
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </points>
    </mesh>
  );
}

const HTMLCanvasMaterial = () => {
  const { gl } = useThree();

  const canvas_texture_ref = useRef();

  let canvas = document.getElementById("dataCanvas"),
    ctx,
    texture;

  ctx = canvas.getContext("2d");
  texture = new THREE.CanvasTexture(ctx.canvas);
  texture.anisotropy = gl.capabilities.getMaxAnisotropy();
  texture.needsUpdate = true;

  useFrame(() => {
    texture.needsUpdate = true;
  });

  return (
    <meshStandardMaterial
      ref={canvas_texture_ref}
      color="#FFFFFF"
      attach="material"
      distort={0} // Strength, 0 disables the effect (default=1)
      speed={1} // Speed (default=1)
      roughness={9}
      reflectivity={0.9}
      refractionRatio={0.1}
      transparent={true}
      map={texture}
      shininess={1000}
    >
      <canvasTexture attach="map" image={canvas} />
    </meshStandardMaterial>
  );
};

function R3FCanvasWDataAnimation() {
  // const image_texture = useLoader(TextureLoader, "tinyvr3.jpg");

  return (
    <>
      <DataCanvas />

      <Canvas
        colorManagement={true}
        style={{
          backgroundColor: "black",
          position: "relative",
          top: "0",
          left: "0",
        }}
        camera={{ fov: 50, position: [0, 0, 40] }}
        alpha={true}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, -10, 5]} intensity={1} />

        <PerlinTexture />

        <OrbitControls
          enableDamping
          enableZoom={true}
          enablePan={false}
          dampingFactor={0.05}
          rotateSpeed={1.1}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.5}
        />

        <Suspense fallback={null}>
          <Sphere visible position={[0, 0, 0]} args={[1, 16, 200]}>
            <HTMLCanvasMaterial />
          </Sphere>
        </Suspense>

        <CubeCamera
          resolution={256} // Size of the off-buffer (256 by default)
          frames={Infinity} // How many frames it should render (Indefinitively by default)
          // fog={customFog} // Allows you to pass a Fog or FogExp2 instance for a smaller frustrum
          near={1}
          far={1000}
        >
          {(texture) => (
            <mesh>
              <sphereGeometry />
              <meshStandardMaterial envMap={texture} />
            </mesh>
          )}
        </CubeCamera>
      </Canvas>
    </>
  );
}

export default R3FCanvasWDataAnimation;
