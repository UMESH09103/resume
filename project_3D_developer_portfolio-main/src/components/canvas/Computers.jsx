import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

// Preload the GLTF asset
useGLTF.preload("/desktop_pc/scene.gltf");

const Computers = ({ isMobile }) => {
  const computer = useGLTF("/desktop_pc/scene.gltf");
  const computerRef = useRef();

  // Animation with safeguard
  useFrame((state, delta) => {
    if (computerRef.current) {
      computerRef.current.rotation.y += delta * 0.2;
    } else {
      console.warn("Computer model not loaded for animation");
    }
  });

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={isMobile ? 0.5 : 1}
        castShadow={false} // Disable shadows for testing
        shadow-mapSize={1024}
      />
      <pointLight intensity={isMobile ? 0.5 : 1} />
      <primitive
        ref={computerRef}
        object={computer.scene}
        scale={isMobile ? 0.6 : 0.75}
        position={isMobile ? [0, -2.5, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = ({ isMobile: parentIsMobile }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches || parentIsMobile);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches || parentIsMobile);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [parentIsMobile]);

  return (
    <Canvas
      frameloop="always"
      shadows={false} // Disable shadows for testing
      dpr={1} // Lower DPR for better mobile performance
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, outputColorSpace: "srgb", antialias: true }}
      style={{ width: "100%", height: "100vh", minHeight: "350px" }}
    >
      <Suspense fallback={<div>Loading 3D model...</div>}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;