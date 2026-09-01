import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const glowRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
        dotRef.current.style.opacity = '1';
      }
      if (ringRef.current) ringRef.current.style.opacity = '1';
      if (glowRef.current) glowRef.current.style.opacity = '1';
    };
    const handleLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (glowRef.current) glowRef.current.style.opacity = '0';
    };
    const handleDown = () => {
      if (ringRef.current) ringRef.current.style.transform += ' scale(0.8)';
    };

    let rafId;
    const animate = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.18;
      glowPos.current.x += (posRef.current.x - glowPos.current.x) * 0.08;
      glowPos.current.y += (posRef.current.y - glowPos.current.y) * 0.08;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.current.x - 60}px, ${glowPos.current.y - 60}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);
    window.addEventListener('mousedown', handleDown);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('mousedown', handleDown);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-99 hidden md:block opacity-0"
        style={{ willChange: 'transform', transition: 'opacity 0.3s' }}
      >
        <div
          className="w-30 h-30 rounded-full blur-2xl"
          style={{ width: '120px', height: '120px', background: 'var(--accent)', opacity: 0.08 }}
        />
      </div>
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
          style={{ borderColor: 'var(--accent)', opacity: 0.6 }}
        />
      </div>
    </>
  );
};

export default CustomCursor;