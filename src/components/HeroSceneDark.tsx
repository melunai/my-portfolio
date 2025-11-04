import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, ShockWave, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import type { JSX } from "react";

export type HeroSceneProps = {
  mouse: { x: number; y: number };
  exploding?: boolean;
};

export default function HeroSceneDark({ mouse, exploding = false }: HeroSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 3.8], fov: 55 }} onCreated={({ gl }) => gl.setClearColor("#050507", 1)}>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 3, 4]} intensity={1.15} color="#ffb347" />

      {/* Слои */}
      <SunPoints mouse={mouse} exploding={exploding} />
      <ExplosionCore active={exploding} />
      <CoreShards trigger={exploding} />
      <ExplosionLight active={exploding} />

      {/* Звёзды и эффекты */}
      <Stars radius={200} depth={100} count={7500} factor={2.4} fade />
      <ExplosionPostFX active={exploding} />
    </Canvas>
  );
}

/* ========================= PARTICLES ========================= */
function SunPoints({ mouse, exploding }: HeroSceneProps) {
  const ref = useRef<THREE.Points>(null!);
  const count = 14000;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 1.25;
      arr[i * 3 + 0] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      arr[i * 3 + 2] = r * Math.cos(ph);
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    const palette = ["#fff2c4", "#ffd27f", "#ffae42", "#ff7139", "#ff4b3a"];
    for (let i = 0; i < count; i++) {
      const col = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      c[i * 3 + 0] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return c;
  }, []);

  const velocity = useMemo(() => {
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const speed = 0.004 + Math.random() * 0.008;
      v[i * 3 + 0] = Math.sin(ph) * Math.cos(th) * speed;
      v[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * speed;
      v[i * 3 + 2] = Math.cos(ph) * speed;
    }
    return v;
  }, []);

  const startRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const points = ref.current;
    const mat = points.material as THREE.PointsMaterial;

    if (!exploding) {
      startRef.current = null;
      points.rotation.y = t * 0.05 - mouse.x * 0.3;
      points.rotation.x = mouse.y * 0.2;
      mat.opacity = 0.65;
      return;
    }

    if (startRef.current === null) startRef.current = t;
    const localT = (t - startRef.current) * 0.28;

    const pulse = 1.0 + Math.sin(Math.min(localT * 2.2, Math.PI)) * 0.25;
    const pos = points.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count * 3; i++) {
      pos[i] += velocity[i] * (0.6 + localT * 3.2) * pulse;
    }
    points.geometry.attributes.position.needsUpdate = true;

    const s = 1 + localT * 1.8;
    points.scale.set(s, s, s);
    mat.opacity = Math.max(0.35, 0.65 - localT * 0.4);
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        vertexColors
        transparent
        opacity={0.65}
        size={0.036}
        sizeAttenuation
        depthWrite={false}
        depthTest={true}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/* ========================= EXPLODING CORE ========================= */
function ExplosionCore({ active }: { active: boolean }) {
  const startRef = useRef<number | null>(null);
  const meshRef = useRef<THREE.Mesh>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uHeat: { value: 0 },
      uCut: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;

    if (!active) {
      startRef.current = null;
      uniforms.uPhase.value = 0;
      uniforms.uHeat.value = 0;
      uniforms.uCut.value = 0;
      if (meshRef.current) meshRef.current.scale.set(1, 1, 1);
      return;
    }

    if (startRef.current === null) startRef.current = t;
    const local = t - startRef.current;

    const over = THREE.MathUtils.smoothstep(local, 0.8, 2.6);
    const crack = THREE.MathUtils.smoothstep(local, 2.0, 8.0);

    uniforms.uPhase.value = crack;
    uniforms.uHeat.value = Math.min(1, over * 1.2);
    uniforms.uCut.value = THREE.MathUtils.clamp((local - 2.2) * 0.18, 0, 1);

    // ядро увеличивается — до x3, потом постепенно схлопывается
    const scale = 1 + Math.sin(Math.min(local * 0.9, Math.PI)) * 2.0 * (1 - crack * 0.3);
    meshRef.current.scale.set(scale, scale, scale);
  });

  const vertex = `
    varying vec3 vPos;
    varying vec3 vN;
    void main() {
      vPos = position;
      vN = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragment = `
    uniform float uTime;
    uniform float uPhase;
    uniform float uHeat;
    uniform float uCut;
    varying vec3 vPos;
    varying vec3 vN;

    float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
    float noise(vec3 p){
      vec3 i = floor(p);
      vec3 f = fract(p);
      float n = mix(mix(mix( hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                        mix( hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                   mix(mix( hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                        mix( hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
      return n;
    }

    void main() {
      float r = length(vPos);
      vec3 N = normalize(vN);

      vec3 base = mix(vec3(1.0,0.75,0.45), vec3(1.0), uHeat*0.6);
      vec3 mid  = mix(vec3(1.0,0.55,0.25), vec3(1.0,0.9,0.8), uHeat*0.4);
      vec3 edge = vec3(0.92,0.25,0.08);

      float n = noise(normalize(vPos)*3.0 + vec3(uTime*0.8, uTime*0.6, 0.0));
      vec3 color = mix(base, mid, n) + edge * n * 0.35;
      float rim = pow(1.0 - max(dot(N, vec3(0.0,0.0,1.0)), 0.0), 3.0);
      float cracks = noise(normalize(vPos)*6.0 + uTime*0.5);
      float mask = smoothstep(uCut+0.06, uCut, cracks);
      float glow = (1.4 + uHeat*1.2) * (1.0 - r*0.2) + rim*0.35;
      vec3 col = color * glow;
      float alpha = mask * (1.0 - r*0.1);
      gl_FragColor = vec4(col, alpha);
    }
  `;

  return (
    <mesh ref={meshRef} renderOrder={999} position={[0, 0, -1]}>
      <sphereGeometry args={[0.8, 96, 96]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
      />
      <meshStandardMaterial
        emissive={"#ffb347"}
        emissiveIntensity={3.2}
        roughness={0.5}
        metalness={0.1}
        transparent
        opacity={0.5}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ========================= CORE SHARDS ========================= */
function CoreShards({ trigger }: { trigger: boolean }) {
  const inst = useRef<THREE.InstancedMesh>(null!);
  const started = useRef(false);
  const [live, setLive] = useState(false);

  const COUNT = 900;
  const dirs = useMemo(() => {
    const d = new Float32Array(COUNT * 3);
    const sp = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const dir = new THREE.Vector3(
        Math.sin(ph) * Math.cos(th),
        Math.sin(ph) * Math.sin(th),
        Math.cos(ph)
      ).normalize();
      const speed = 0.9 + Math.random() * 1.6;
      d[i * 3 + 0] = dir.x;
      d[i * 3 + 1] = dir.y;
      d[i * 3 + 2] = dir.z;
      sp[i] = speed;
    }
    return { d, sp };
  }, []);

  const rot = useMemo(() => {
    const r = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) r[i] = (Math.random() - 0.5) * 6.0;
    return r;
  }, []);

  const startRef = useRef<number>(0);

  useFrame(({ clock }) => {
    if (trigger && !started.current) {
      started.current = true;
      setLive(true);
      startRef.current = clock.getElapsedTime();
    }
    if (!live) return;

    const t = clock.getElapsedTime() - startRef.current;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s0 = 0.015;
    for (let i = 0; i < COUNT; i++) {
      const dx = dirs.d[i * 3 + 0];
      const dy = dirs.d[i * 3 + 1];
      const dz = dirs.d[i * 3 + 2];
      const speed = dirs.sp[i];
      const dist = Math.pow(t, 1.1) * speed;
      const px = dx * dist * 0.9;
      const py = dy * dist * 0.9;
      const pz = dz * dist * 0.9;
      q.setFromEuler(new THREE.Euler(rot[i * 3] * t, rot[i * 3 + 1] * t, rot[i * 3 + 2] * t));
      const scale = Math.max(0, 1.0 - t * 0.22);
      m.compose(new THREE.Vector3(px, py, pz), q, new THREE.Vector3(s0 * scale, s0 * scale, s0 * scale));
      inst.current.setMatrixAt(i, m);
    }
    inst.current.instanceMatrix.needsUpdate = true;
    if (t > 10) setLive(false);
  });

  if (!live) return null;

  return (
    <instancedMesh ref={inst} args={[undefined as any, undefined as any, COUNT]} renderOrder={998}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color={"#ffd27f"}
        transparent
        opacity={0.95}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

/* ========================= HALO LIGHT ========================= */
function ExplosionLight({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const startRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (!active) { ref.current.scale.set(0,0,0); matRef.current.opacity = 0; startRef.current = null; return; }
    const t = clock.getElapsedTime();
    if (startRef.current === null) startRef.current = t;
    const localT = (t - startRef.current) * 0.28;
    const s = 1 + localT * 9.0;
    const opacity = Math.max(0, 0.24 - localT * 0.045);
    ref.current.scale.set(s, s, s);
    matRef.current.opacity = opacity;
  });

  return (
    <mesh ref={ref} position={[0,0,-2]} renderOrder={5}>
      <sphereGeometry args={[1.05, 48, 48]} />
      <meshBasicMaterial
        ref={matRef}
        color="#ffd9a6"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* ========================= POST FX ========================= */
function ExplosionPostFX({ active }: { active: boolean }) {
  const ref = useRef<any>(null);
  const { camera } = useThree();
  const startRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (active) {
      if (startRef.current === null) startRef.current = clock.getElapsedTime();
      const t = clock.getElapsedTime() - startRef.current;
      const amp = Math.max(0, 1.0 - t * 0.25) * 0.018;
      camera.position.x = Math.sin(t * 28) * amp;
      camera.position.y = Math.cos(t * 31) * amp;
      camera.position.z = 3.8 + Math.sin(t * 12) * amp * 0.8;
      if (ref.current) ref.current.time = clock.elapsedTime * 0.55;
    } else {
      startRef.current = null;
      camera.position.set(0, 0, 3.8);
    }
  });

  const effects = [
    <Bloom key="bloom" intensity={1.25} luminanceThreshold={0.32} luminanceSmoothing={0.92} height={420} />,
    active ? <ShockWave key="wave" ref={ref} position={[0,0,0]} speed={0.12} amplitude={0.72} wavelength={1.05} /> : null,
    active ? <ChromaticAberration key="ab" offset={[0.0012, 0.0012]} radialModulation /> : null,
  ].filter(Boolean) as JSX.Element[];

  return <EffectComposer>{effects}</EffectComposer>;
}
