import { useEffect, useRef } from "react";

const NetworkAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // ✅ Prevents null errors

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const setCanvasSize = () => {
      if (!canvas) return; // ✅ Extra safety check
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    class Particle {
      x!: number;
      y!: number;
      vx!: number;
      vy!: number;
      size!: number;
    
      constructor() {
        if (!canvas) return; // ✅ Ensures canvas is still available
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
      }

      update() {
        if (!canvas) return;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
    }

    const particles = Array.from({ length: 70 }, () => new Particle());

    const animate = () => {
      if (!canvas) return; // ✅ Extra safety check
      ctx.fillStyle = "rgba(2, 6, 23, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.update();

        particles.slice(i + 1).forEach((other) => {
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const gradient = ctx.createLinearGradient(
              particle.x,
              particle.y,
              other.x,
              other.y
            );
            const alpha = 1 - distance / 150;
            gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha * 0.4})`);
            gradient.addColorStop(1, `rgba(147, 197, 253, ${alpha * 0.4})`);

            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 2
        );
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
        gradient.addColorStop(1, "rgba(147, 197, 253, 0.1)");

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef} // ✅ Uses ref, no need for an ID
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default NetworkAnimation;
