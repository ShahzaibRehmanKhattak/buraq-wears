"use client";
import { useEffect, useRef } from 'react';
 const BackgroundCanvas = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      const THREE = window.THREE;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);
      const geometry = new THREE.IcosahedronGeometry(1.5, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 0.05 });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      camera.position.z = 4;
      const animate = () => {
        requestAnimationFrame(animate);
        sphere.rotation.x += 0.001;
        sphere.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
      animate();
      return () => {
        window.removeEventListener('resize', handleResize);
        containerRef.current?.removeChild(renderer.domElement);
      };
    };
    document.head.appendChild(script);
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-[-1] opacity-20 pointer-events-none" />;
};

export default BackgroundCanvas;