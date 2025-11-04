import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Stars } from "@react-three/drei";
import type { HeroSceneProps } from "./HeroSceneDark";

export default function HeroSceneLight({ mouse }: HeroSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 3.6], fov: 55 }}>
      <ambientLight intensity={1.0} />
      <pointLight position={[2, 3, 3]} intensity={0.9} color="#a5cfff" />
      <AuroraShader mouse={mouse} />
      <Stars radius={140} depth={60} count={2500} factor={1.4} fade />
    </Canvas>
  );
}

function AuroraShader({ mouse }: HeroSceneProps) {
  const ref = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uMouse.value.set(mouse.x, mouse.y);
  });

  const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.y += sin(uv.x * 6.283 + uTime * 0.8) * 0.12;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    void main() {
      float wave = sin(vUv.x * 12.0 + uTime * 1.2) * 0.5 + 0.5;
      vec3 color = mix(vec3(0.8, 0.9, 1.0), vec3(1.0, 0.7, 0.9), wave);
      color += 0.25 * vec3(sin(uTime + vUv.y * 5.0), cos(uTime * 0.7), wave);
      gl_FragColor = vec4(color, 0.8);
    }
  `;

  return (
    <mesh rotation={[Math.PI / -2.5, 0, 0]} position={[0, -0.3, 0]}>
      <planeGeometry args={[6, 4, 128, 128]} />
      <shaderMaterial
        ref={ref}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
