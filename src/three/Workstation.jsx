import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { createCodeScreen } from './codeTexture'
import { snippets } from '../data'

const DESK_Y = 0.76

function Desk() {
  const legs = [
    [-1.12, -0.48],
    [1.12, -0.48],
    [-1.12, 0.48],
    [1.12, 0.48],
  ]
  return (
    <group>
      <RoundedBox args={[2.5, 0.06, 1.1]} radius={0.02} position={[0, DESK_Y, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#eae6f5" roughness={0.55} />
      </RoundedBox>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, DESK_Y / 2, z]} castShadow>
          <boxGeometry args={[0.05, DESK_Y, 0.05]} />
          <meshStandardMaterial color="#1a1624" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function Monitor({ screen }) {
  const glow = useRef()
  useFrame(({ clock }) => {
    if (glow.current) glow.current.intensity = 2.2 + Math.sin(clock.elapsedTime * 1.7) * 0.25
  })
  return (
    <group position={[0, DESK_Y + 0.03, -0.25]}>
      {/* stand */}
      <RoundedBox args={[0.42, 0.025, 0.26]} radius={0.01} position={[0, 0.012, 0]} castShadow>
        <meshStandardMaterial color="#26212f" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.26, -0.05]} castShadow>
        <boxGeometry args={[0.07, 0.5, 0.03]} />
        <meshStandardMaterial color="#26212f" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* bezel + screen */}
      <group position={[0, 0.66, 0]} rotation={[-0.04, 0, 0]}>
        <RoundedBox args={[1.66, 1.06, 0.05]} radius={0.025} castShadow>
          <meshStandardMaterial color="#121019" metalness={0.5} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.01, 0.027]}>
          <planeGeometry args={[1.58, 0.9875]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
        <pointLight ref={glow} position={[0, 0, 0.5]} color="#9b7bff" distance={3} intensity={2.2} />
      </group>
    </group>
  )
}

function Keyboard() {
  const keys = useRef()
  const cols = 14
  const rows = 4
  const count = cols * rows
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    let i = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dummy.position.set(-0.4 + c * 0.0615, 0.03, -0.1 + r * 0.066)
        dummy.updateMatrix()
        keys.current.setMatrixAt(i++, dummy.matrix)
      }
    }
    keys.current.instanceMatrix.needsUpdate = true
  }, [dummy])

  // a few keys "press" randomly so the setup feels in use
  const pressed = useRef({ index: 0, t: 0 })
  useFrame((_, dt) => {
    const p = pressed.current
    p.t -= dt
    if (p.t <= 0) {
      const r = (p.index / cols) | 0
      const c = p.index % cols
      dummy.position.set(-0.4 + c * 0.0615, 0.03, -0.1 + r * 0.066)
      dummy.updateMatrix()
      keys.current.setMatrixAt(p.index, dummy.matrix)
      p.index = (Math.random() * count) | 0
      const nr = (p.index / cols) | 0
      const nc = p.index % cols
      dummy.position.set(-0.4 + nc * 0.0615, 0.018, -0.1 + nr * 0.066)
      dummy.updateMatrix()
      keys.current.setMatrixAt(p.index, dummy.matrix)
      keys.current.instanceMatrix.needsUpdate = true
      p.t = 0.07 + Math.random() * 0.12
    }
  })

  return (
    <group position={[-0.05, DESK_Y + 0.03, 0.25]}>
      <RoundedBox args={[0.92, 0.03, 0.3]} radius={0.012} position={[0, 0.015, 0]} castShadow>
        <meshStandardMaterial color="#1b1724" roughness={0.5} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[null, null, count]} castShadow>
        <boxGeometry args={[0.052, 0.022, 0.056]} />
        <meshStandardMaterial color="#2c2638" roughness={0.6} emissive="#6d28d9" emissiveIntensity={0.08} />
      </instancedMesh>
    </group>
  )
}

function DeskItems() {
  return (
    <group>
      {/* mouse */}
      <mesh position={[0.62, DESK_Y + 0.045, 0.28]} scale={[0.06, 0.03, 0.1]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#1b1724" roughness={0.4} />
      </mesh>
      {/* mug */}
      <group position={[0.95, DESK_Y + 0.03, 0.05]}>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.14, 24]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.35} />
        </mesh>
        <mesh position={[0.065, 0.075, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.035, 0.01, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.35} />
        </mesh>
      </group>
      {/* plant */}
      <group position={[-1.0, DESK_Y + 0.03, -0.3]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.065, 0.16, 20]} />
          <meshStandardMaterial color="#efeaf8" roughness={0.6} />
        </mesh>
        {[
          [0, 0.26, 0, 0.1],
          [0.06, 0.34, 0.02, 0.08],
          [-0.05, 0.31, -0.03, 0.08],
          [0.01, 0.42, -0.01, 0.065],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <icosahedronGeometry args={[r, 0]} />
            <meshStandardMaterial color="#4ade80" roughness={0.7} flatShading />
          </mesh>
        ))}
      </group>
      {/* desk lamp */}
      <group position={[-0.95, DESK_Y + 0.03, 0.25]} rotation={[0, 0.6, 0]}>
        <mesh position={[0, 0.012, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.025, 24]} />
          <meshStandardMaterial color="#1b1724" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, -0.03]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
          <meshStandardMaterial color="#1b1724" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.39, 0.04]} rotation={[-2.2, 0, 0]} castShadow>
          <coneGeometry args={[0.08, 0.13, 24, 1, true]} />
          <meshStandardMaterial color="#1b1724" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[0, 0.34, 0.1]} color="#ffd9a8" intensity={1.4} distance={1.6} />
      </group>
    </group>
  )
}

/** Small server tower next to the desk, LEDs blink like live traffic. */
function Server() {
  const leds = useRef([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    leds.current.forEach((m, i) => {
      if (!m) return
      const on = Math.sin(t * (3 + i * 1.7) + i * 2.1) > 0.2
      m.emissiveIntensity = on ? 3 : 0.3
    })
  })
  return (
    <group position={[1.62, 0, -0.1]} rotation={[0, -0.25, 0]}>
      <RoundedBox args={[0.48, 0.92, 0.62]} radius={0.03} position={[0, 0.46, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#15121d" metalness={0.6} roughness={0.35} />
      </RoundedBox>
      {[0, 1, 2, 3].map((row) => (
        <group key={row} position={[0, 0.2 + row * 0.18, 0.312]}>
          <mesh>
            <boxGeometry args={[0.38, 0.12, 0.01]} />
            <meshStandardMaterial color="#221d2c" roughness={0.5} />
          </mesh>
          {[0, 1, 2].map((k) => (
            <mesh key={k} position={[-0.14 + k * 0.045, 0, 0.008]}>
              <boxGeometry args={[0.022, 0.022, 0.006]} />
              <meshStandardMaterial
                ref={(m) => (leds.current[row * 3 + k] = m)}
                color={k === 2 ? '#22c55e' : '#a78bfa'}
                emissive={k === 2 ? '#22c55e' : '#a78bfa'}
                emissiveIntensity={1}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function Chair() {
  return (
    <group position={[-0.35, 0, 1.0]} rotation={[0, 0.9, 0]}>
      <RoundedBox args={[0.55, 0.07, 0.52]} radius={0.03} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#2a2435" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.52, 0.6, 0.06]} radius={0.03} position={[0, 0.86, 0.25]} rotation={[-0.12, 0, 0]} castShadow>
        <meshStandardMaterial color="#2a2435" roughness={0.7} />
      </RoundedBox>
      <mesh position={[0, 0.27, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
        <meshStandardMaterial color="#8b85a0" metalness={0.8} roughness={0.25} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.04, 0]} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
          <boxGeometry args={[0.04, 0.03, 0.56]} />
          <meshStandardMaterial color="#8b85a0" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}
    </group>
  )
}

export default function Workstation() {
  const screen = useMemo(
    () =>
      createCodeScreen([
        { name: 'MatchingEngine.java', code: snippets.matching },
        { name: 'BookingService.java', code: snippets.booking },
      ]),
    []
  )
  useEffect(() => () => screen.dispose(), [screen])
  useFrame((_, dt) => screen.tick(Math.min(dt, 0.1)))

  return (
    <group>
      <Desk />
      <Monitor screen={screen.texture} />
      <Keyboard />
      <DeskItems />
      <Server />
      <Chair />
    </group>
  )
}
