import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshDistortMaterial,
  Points,
  PointMaterial,
  Line,
} from "@react-three/drei";
import * as THREE from "three";

function cssVar(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
    .replace(/rgba?\(([^,]+,[^,]+,[^,]+)(?:,[^)]+)?\)/, "rgb($1)");
}

type MouseState = { x: number; y: number };

export default function HeroScene({ mouse }: { mouse: MouseState }) {
  const [theme, setTheme] = useState<"light" | "dark">(
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light"
  );

  // следим за изменением темы
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const th = document.documentElement.getAttribute("data-theme");
      if (th === "dark" || th === "light") setTheme(th);
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={theme === "dark" ? 0.5 : 0.7} />
        <pointLight
          position={[3, 4, 5]}
          intensity={theme === "dark" ? 1.3 : 1.6}
          color={theme === "dark" ? cssVar("--accent") : "#60a5fa"} // голубоватый в светлой
        />
        <SceneContent mouse={mouse} theme={theme} />
      </Canvas>
    </div>
  );
}

function SceneContent({ mouse, theme }: { mouse: MouseState; theme: "light" | "dark" }) {
  const group = useRef<THREE.Group>(null);
  const mainMesh = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const { camera } = state;
    const tx = mouse.x * 0.4;
    const ty = mouse.y * 0.3;
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, ty * 0.25, delta * 3);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -tx * 0.25, delta * 3);

    if (group.current) {
      group.current.rotation.y += delta * 0.2;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }

    if (mainMesh.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      mainMesh.current.scale.setScalar(scale);
    }

    if (glow.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      glow.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      {/* --- основная фигура --- */}
      <mesh ref={mainMesh}>
        <icosahedronGeometry args={[1, 5]} />
        <MeshDistortMaterial
          color={
            theme === "dark"
              ? cssVar("--accent")
              : "color-mix(in srgb, var(--accent), white 20%)"
          }
          speed={2.5}
          distort={0.5}
          roughness={0.25}
          metalness={0.85}
          emissive={cssVar("--glow")}
          emissiveIntensity={theme === "dark" ? 0.45 : 0.25}
          transparent
          opacity={theme === "dark" ? 0.38 : 0.45}
        />
      </mesh>

      <HexGrid theme={theme} />
      <Particles mouse={mouse} theme={theme} />
      <GlowVolume ref={glow} theme={theme} />
    </group>
  );
}

/* === Гексагон === */
function HexGrid({ theme }: { theme: "light" | "dark" }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.4;
      ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
  });

  const hexagon = (radius: number, y: number) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 6; i++) {
      const a = (Math.PI / 3) * i;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
    }
    return pts;
  };

  return (
    <group ref={ref}>
      {[0, 0.3, -0.3].map((y, i) => (
        <Line
          key={i}
          points={hexagon(0.9 - Math.abs(y) * 0.25, y)}
          color={theme === "dark" ? cssVar("--confetti1") : "#f472b6"} // светлая версия
          lineWidth={1}
          transparent
          opacity={theme === "dark" ? 0.35 : 0.25}
        />
      ))}
    </group>
  );
}

/* === Частицы === */
function Particles({
  mouse,
  count = 250,
  theme,
}: {
  mouse: MouseState;
  count?: number;
  theme: "light" | "dark";
}) {
  const ref = useRef<THREE.Points>(null!);
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 2.5;
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.random() * Math.PI;
      arr[i * 3] = r * Math.sin(φ) * Math.cos(θ);
      arr[i * 3 + 1] = r * Math.sin(φ) * Math.sin(θ);
      arr[i * 3 + 2] = r * Math.cos(φ);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += Math.sin(t * 0.4 + i) * 0.001 + mouse.x * 0.001;
      arr[i * 3 + 1] += Math.cos(t * 0.4 + i) * 0.001 + mouse.y * 0.001;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={theme === "dark" ? cssVar("--confetti2") : "#ec4899"}
        size={theme === "dark" ? 0.04 : 0.03}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

/* === Glow === */
const GlowVolume = React.forwardRef<
  THREE.Mesh,
  { theme: "light" | "dark" }
>(({ theme }, ref) => (
  <mesh ref={ref}>
    <sphereGeometry args={[1.4, 64, 64]} />
    <meshBasicMaterial
      color={theme === "dark" ? cssVar("--accent") : "#a5b4fc"}
      transparent
      opacity={theme === "dark" ? 0.18 : 0.12}
      side={THREE.BackSide}
    />
  </mesh>
));
GlowVolume.displayName = "GlowVolume";
