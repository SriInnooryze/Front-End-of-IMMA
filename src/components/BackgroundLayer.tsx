import { useEffect, useRef, memo } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
  phase: number;
  driftX: number;
  driftY: number;
}

interface BackgroundLayerProps {
  isDarkMode: boolean;
}

export const BackgroundLayer = memo(function BackgroundLayer({ isDarkMode }: BackgroundLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const prefersReducedMotion = useRef(false);
  const isDarkModeRef = useRef(isDarkMode);

  // Update ref when prop changes
  useEffect(() => {
    isDarkModeRef.current = isDarkMode;
  }, [isDarkMode]);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // More stars for a richer galaxy effect
    const starCount = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 8000));
    
    // Dark mode: vibrant cyan/blue/purple/white stars
    const darkColors = [
      "rgba(0, 227, 227, ",    // bright cyan
      "rgba(100, 180, 255, ",  // blue
      "rgba(180, 130, 255, ",  // purple
      "rgba(255, 255, 255, ",  // white
      "rgba(0, 200, 200, ",    // teal
    ];
    
    // Light mode: more visible blue/slate tones
    const lightColors = [
      "rgba(60, 100, 140, ",   // slate blue
      "rgba(40, 120, 160, ",   // ocean blue
      "rgba(80, 80, 120, ",    // dusty purple
      "rgba(20, 80, 120, ",    // deep teal
    ];

    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 3 + 0.5,
      size: Math.random() * 2.5 + 0.8,
      speed: Math.random() * 0.15 + 0.05,
      // Higher opacity for visibility
      opacity: isDarkMode 
        ? Math.random() * 0.4 + 0.2  // 0.2-0.6 for dark mode
        : Math.random() * 0.25 + 0.15, // 0.15-0.4 for light mode
      color: isDarkMode 
        ? darkColors[Math.floor(Math.random() * darkColors.length)]
        : lightColors[Math.floor(Math.random() * lightColors.length)],
    }));

    // Nebulae - larger, more visible glowing areas
    const nebulaCount = 4;
    nebulaeRef.current = Array.from({ length: nebulaCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 300 + 200,
      color: isDarkMode ? "0, 200, 220" : "60, 140, 180",
      opacity: isDarkMode ? 0.08 : 0.05, // More visible
      phase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.3,
      driftY: (Math.random() - 0.5) * 0.2,
    }));

    let time = 0;

    const animate = () => {
      if (!ctx || !canvas) return;
      
      time += 0.003;
      const dark = isDarkModeRef.current;

      // Clear with slight fade for trail effect
      ctx.fillStyle = dark ? "rgba(10, 15, 25, 0.1)" : "rgba(250, 252, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae (galaxy dust clouds)
      nebulaeRef.current.forEach((nebula) => {
        if (!prefersReducedMotion.current) {
          nebula.phase += 0.001;
          nebula.x += nebula.driftX;
          nebula.y += nebula.driftY;

          // Wrap around
          if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius;
          if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius;
          if (nebula.y < -nebula.radius) nebula.y = canvas.height + nebula.radius;
          if (nebula.y > canvas.height + nebula.radius) nebula.y = -nebula.radius;
        }
        
        const pulseOpacity = nebula.opacity * (0.7 + 0.3 * Math.sin(nebula.phase));
        const nebulaColor = dark ? "0, 200, 220" : "60, 120, 160";
        
        const gradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius
        );
        gradient.addColorStop(0, `rgba(${nebulaColor}, ${pulseOpacity})`);
        gradient.addColorStop(0.3, `rgba(${nebulaColor}, ${pulseOpacity * 0.6})`);
        gradient.addColorStop(0.7, `rgba(${nebulaColor}, ${pulseOpacity * 0.2})`);
        gradient.addColorStop(1, `rgba(${nebulaColor}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw stars with parallax
      starsRef.current.forEach((star, index) => {
        if (!prefersReducedMotion.current) {
          star.y += star.speed * star.z * 0.3;
          star.x += star.speed * 0.1;

          if (star.y > canvas.height + 10) {
            star.y = -10;
            star.x = Math.random() * canvas.width;
          }
          if (star.x > canvas.width + 10) {
            star.x = -10;
          }
        }

        // Twinkle effect
        const twinkle = 0.6 + 0.4 * Math.sin(time * 3 + index * 0.5);
        const baseOpacity = dark 
          ? Math.random() * 0.4 + 0.3 
          : Math.random() * 0.3 + 0.2;
        const finalOpacity = baseOpacity * twinkle;

        // Star glow (for brighter stars)
        if (star.size > 1.5 && dark) {
          const glowGradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
          );
          glowGradient.addColorStop(0, `${star.color}${finalOpacity * 0.3})`);
          glowGradient.addColorStop(1, `${star.color}0)`);
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * star.z * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${finalOpacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
});
