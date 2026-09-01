import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
    };
    const handleLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    let rafId;
    const animate = () => {
      const dx = posRef.current.x - currentRef.current.x;
      const dy = posRef.current.y - currentRef.current.y;
      currentRef.current.x += dx * 0.2;
      currentRef.current.y += dy * 0.2;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentRef.current.x - 16}px, ${currentRef.current.y - 16}px)`;
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
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-100 hidden md:block opacity-0"
      style={{ willChange: 'transform' }}
    >
      <div
        className="w-8 h-8 rounded-full border-2"
        style={{ borderColor: 'var(--accent)' }}
      />
    </div>
  );
};

export default CustomCursor;