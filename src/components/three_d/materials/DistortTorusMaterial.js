import React, { useState } from 'react'
import { MeshPhysicalMaterial } from 'three'
import { useFrame } from 'react-three-fiber'

class DistortMaterialImpl extends MeshPhysicalMaterial {
  _time
  _myTexture
  constructor(parameters = {}) {
    super(parameters)
    this.setValues(parameters)
    this._time = { value: 0 }
    this._myTexture = { value: null }
  }

  onBeforeCompile(shader) {
    shader.uniforms.time = this._time
    shader.uniforms.myTexture = this._myTexture

    shader.vertexShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPos;
      ${shader.vertexShader}
    `
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      `
        #include <project_vertex>
        vNormal = normal;
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed,1.);
      `
    )
    shader.fragmentShader = `
      uniform float time;
      uniform sampler2D myTexture;
      varying vec2 vUv;
      varying vec3 vPos;

      ${shader.fragmentShader}
    `
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>
      vec2 repeat = -vec2(10., 4.);
      vec2 uv = fract(vUv * repeat - vec2(time, 0.));
      float shadow = clamp(vPos.z / 5., 0., 1.);
      vec4 texture = texture2D(myTexture, uv);
      gl_FragColor = gl_FragColor * vec4(texture.rbg * shadow, texture.r * shadow);
      `
    )
  }
  get time() {
    return this._time.value
  }
  set time(v) {
    this._time.value = v
  }
  get myTexture() {
    return this._myTexture.value
  }
  set myTexture(v) {
    this._myTexture.value = v
  }
}

export const DistortTorusMaterial = React.forwardRef(({ speed = 1, ...props }, ref) => {
  const [material] = useState(() => new DistortMaterialImpl(), [])
  useFrame((state) => {
    if (material) {
      material.time = state.clock.getElapsedTime() * speed
    }
  })
  return <primitive object={material} ref={ref} attach="material" {...props} />
})
