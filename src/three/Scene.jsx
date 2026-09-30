import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import Workstation from './Workstation'
import { createLabelTexture } from './codeTexture'
import { sceneState } from './state'

// Rig poses for each scroll stop: [x, y, z, rotY, scale]
const POSES_DESKTOP = [
  [-0.2, -0.95, 0, -0.42, 0.72],
  [-1.85, -1.0, 0, 0.42, 0.8],
  [-1.25, -1.9, 1.7, 0.22, 1.05],
]
const POSES_MOBILE = [
  [0, -0.35, -1.2, -0.4, 0.62],
  [0, -2.0, -1.6, 0.35, 0.62],
  [0, -2.2, -0.6, 0.2, 0.75],
]

const lerp = THREE.MathUtils.lerp

function samplePose(poses, p) {
  const i = Math.min(Math.floor(p), poses.length - 2)
  const t = THREE.MathUtils.smootherstep(p - i, 0, 1)
  return poses[i].map((v, k) => lerp(v, poses[i + 1][k], t))
}

const KEYCAPS = [
  { label: 'Java', pos: [-0.5, 2.85, -0.6], color: '#7c3aed', text: '#ffffff' },
  { label: 'Spring', pos: [1.1, 3.1, -1.0], color: '#f1edfb', text: '#4c1d95' },
  { label: 'JWT', pos: [2.3, 2.35, -1.3], color: '#1f1a2b', text: '#c4b5fd' },
  { label: 'Docker', pos: [2.9, 3.1, -1.6], color: '#1f1a2b', text: '#c4b5fd' },
  { label: 'SQL', pos: [-2.5, 1.2, 0.9], color: '#1f1a2b', text: '#e9e4ff' },
  { label: 'Redis', pos: [-1.9, 0.45, 1.6], color: '#7c3aed', text: '#ffffff' },
]

function Keycap({ label, pos, color, text, speed }) {
  const map = useMemo(() => createLabelTexture(label, { color: text }), [label, text])
  useEffect(() => () => map.dispose(), [map])
  return (
    <Float position={pos} speed={speed} rotationIntensity={0.6} floatIntensity={0.9}>
      <group rotation={[0.95, -0.2, 0.08]}>
        <RoundedBox args={[0.42, 0.2, 0.42]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} />
        </RoundedBox>
        <mesh position={[0, 0.101, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.36, 0.36]} />
          <meshBasicMaterial map={map} transparent toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

function FloorGlow() {
  const map = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const g = c.getContext('2d')
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128)
    grd.addColorStop(0, 'rgba(167,139,250,0.55)')
    grd.addColorStop(0.45, 'rgba(124,58,237,0.18)')
    grd.addColorStop(1, 'rgba(124,58,237,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 256, 256)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
      <planeGeometry args={[7, 7]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

function Rig({ children }) {
  const group = useRef()
  const size = useThree((s) => s.size)
  const mobile = size.width < 820
  const pose = useRef(null)

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const [x, y, z, ry, s] = samplePose(mobile ? POSES_MOBILE : POSES_DESKTOP, sceneState.progress)
    if (!pose.current) {
      g.position.set(x, y, z)
      g.scale.setScalar(s)
      g.rotation.y = ry
      pose.current = true
    }
    const d = Math.min(dt, 0.1)
    const damp = THREE.MathUtils.damp
    g.position.x = damp(g.position.x, x, 4, d)
    g.position.y = damp(g.position.y, y, 4, d)
    g.position.z = damp(g.position.z, z, 4, d)
    g.scale.setScalar(damp(g.scale.x, s, 4, d))
    const follow = mobile ? 0 : 1
    g.rotation.y = damp(g.rotation.y, ry + sceneState.pointerX * 0.28 * follow, 3, d)
    g.rotation.x = damp(g.rotation.x, sceneState.pointerY * 0.06 * follow, 3, d)
  })

  return <group ref={group}>{children}</group>
}

export default function Scene({ active = true, onReady }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.0, 6.2], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, 0.35, 0)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        requestAnimationFrame(() => onReady?.())
      }}
    >
      <ambientLight intensity={0.35} color="#c8bfff" />
      <directionalLight position={[3, 5, 4]} intensity={1.3} color="#ffffff" />
      <pointLight position={[-3, 2.5, -2]} intensity={18} distance={9} color="#8b5cf6" />
      <pointLight position={[3, 1.5, -2.5]} intensity={12} distance={9} color="#c026d3" />

      <Rig>
        <Workstation />
        <FloorGlow />
        <ContactShadows position={[0, 0, 0]} scale={6} blur={2.4} opacity={0.65} far={2.5} frames={1} resolution={512} color="#000000" />
        {KEYCAPS.map((k, i) => (
          <Keycap key={k.label} {...k} speed={1.2 + (i % 3) * 0.35} />
        ))}
      </Rig>
    </Canvas>
  )
}
