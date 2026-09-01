import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
        dotRef.current.style.opacity = '1';
      }
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };
    const handleLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    let rafId;
    const animate = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-100 hidden md:block opacity-0"
        style={{ willChange: 'transform', transition: 'opacity 0.2s' }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
      </div>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-100 hidden md:block opacity-0"
        style={{ willChange: 'transform', transition: 'opacity 0.2s' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2"
          style={{ borderColor: 'var(--accent)', opacity: 0.5 }}
        />
      </div>
    </>
  );
};

export default CustomCursor;