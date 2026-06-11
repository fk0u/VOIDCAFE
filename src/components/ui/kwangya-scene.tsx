import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'
import * as THREE from 'three'


function generateNodes() {
  return Array.from({ length: 20 }).map(() => ({
    position: [
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
    ] as [number, number, number],
    scale: Math.random() * 0.05 + 0.02,
    color: Math.random() > 0.5 ? '#22d3ee' : '#a855f7', // cyan or purple
  }))
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000 * 3), { radius: 1.5 }))

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere as Float32Array} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#a855f7" // neon-purple
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

function FloatingNodes() {
  const ref = useRef<THREE.Group>(null!)
  const nodes = useMemo(() => generateNodes(), [])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={ref}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position} scale={node.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={2}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

export function KwangyaScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <ParticleField />
        <FloatingNodes />
      </Canvas>
      {/* Vignette overlay to blend edges */}
      <div className="absolute inset-0 bg-void-black/20 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  )
}
