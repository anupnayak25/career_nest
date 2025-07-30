import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const Loading = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const eyeRef = useRef(null);
  const pupilRef = useRef(null);
  const spinnerRingsRef = useRef([]);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef(null);

//   const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
//   const [clickCount, setClickCount] = useState(0);
//   const [progress, setProgress] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const phases = [
    { message: "Initializing server...", icon: "⚡", color: 0x3b82f6 },
    { message: "Loading configurations...", icon: "⚙️", color: 0x6366f1 },
    { message: "Connecting to database...", icon: "🗄️", color: 0x8b5cf6 },
    { message: "Starting services...", icon: "🚀", color: 0xec4899 },
    { message: "Almost ready...", icon: "✨", color: 0x10b981 }
  ];

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Camera position
    camera.position.z = 5;

    // Create orbiting particles around the eye
    const orbitGroup = new THREE.Group();
    const orbitParticles = [];
    
    for (let i = 0; i < 8; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({ 
        color: phases[0].color,
        transparent: true,
        opacity: 0.8
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      const angle = (i / 8) * Math.PI * 2;
      const radius = 2;
      particle.position.x = Math.cos(angle) * radius;
      particle.position.z = Math.sin(angle) * radius;
      
      orbitGroup.add(particle);
      orbitParticles.push(particle);
    }
    
    scene.add(orbitGroup);
    spinnerRingsRef.current = { orbitGroup, orbitParticles };

    // Create eye
    const eyeGroup = new THREE.Group();
    
    // Eye white
    const eyeGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeGroup.add(eye);
    
    // Pupil
    const pupilGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x1f2937 });
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.z = 0.35;
    eyeGroup.add(pupil);
    
    // Iris
    const irisGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const irisMaterial = new THREE.MeshBasicMaterial({ 
      color: phases[0].color,
      transparent: true,
      opacity: 0.7
    });
    const iris = new THREE.Mesh(irisGeometry, irisMaterial);
    iris.position.z = 0.3;
    eyeGroup.add(iris);

    scene.add(eyeGroup);
    eyeRef.current = eyeGroup;
    pupilRef.current = pupil;

    // Create particle system
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
      
      sizes[i] = Math.random() * 5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Mouse move handler
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Click handler
    const handleClick = () => {
    
      // Add click effect - scale eye briefly
      if (eyeRef.current) {
        eyeRef.current.scale.setScalar(1.2);
        setTimeout(() => {
          if (eyeRef.current) eyeRef.current.scale.setScalar(1);
        }, 200);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate orbiting particles
      if (spinnerRingsRef.current.orbitGroup) {
        spinnerRingsRef.current.orbitGroup.rotation.y += 0.02;
        // Add some vertical bobbing to particles
        spinnerRingsRef.current.orbitParticles.forEach((particle, index) => {
          particle.position.y = Math.sin(Date.now() * 0.003 + index) * 0.3;
        });
      }

      // Eye tracking mouse
      if (eyeRef.current && pupilRef.current) {
        const maxMovement = 0.2;
        pupilRef.current.position.x = mouseRef.current.x * maxMovement;
        pupilRef.current.position.y = mouseRef.current.y * maxMovement;
        
        // Subtle head rotation
        eyeRef.current.rotation.y = mouseRef.current.x * 0.1;
        eyeRef.current.rotation.x = mouseRef.current.y * 0.1;
      }

      // Animate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.005;
        particlesRef.current.rotation.x += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);

  // Update colors based on phase
  useEffect(() => {
    if (spinnerRingsRef.current.orbitParticles) {
      const currentColor = phases[currentPhase].color;
      spinnerRingsRef.current.orbitParticles.forEach(particle => {
        particle.material.color.setHex(currentColor);
      });

      // Update iris color
      if (eyeRef.current && eyeRef.current.children[2]) {
        eyeRef.current.children[2].material.color.setHex(currentColor);
      }
    }
  }, [currentPhase]);

//   // Progress simulation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress(prev => {
//         const newProgress = prev + (Math.random() * 3 + 1);
//         const phaseIndex = Math.min(Math.floor(newProgress / 20), phases.length - 1);
//         setCurrentPhase(phaseIndex);
//         return Math.min(newProgress, 100);
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

  const currentPhaseData = phases[currentPhase];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center text-white z-10 mt-80">
          {/* Status Message */}
          <div className="mb-6">
            <p className="text-xl font-medium mb-2 transition-all duration-500">
              {currentPhaseData.icon} {currentPhaseData.message}
            </p>
            <div className="flex justify-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white animate-bounce opacity-60"
                  style={{ 
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.4s'
                  }}
                />
              ))}
            </div>
          </div>




        </div>
      </div>

      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 pointer-events-auto">
          <div className="text-center text-white">
            <div className="text-6xl animate-bounce mb-4">🎉</div>
            <div className="text-2xl font-bold mb-2">Achievement Unlocked!</div>
            <div className="text-gray-300 mb-4">Click Master - The eye sees all!</div>
            <button 
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              onClick={() => setShowEasterEgg(false)}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loading;