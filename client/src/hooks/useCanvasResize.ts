import { useEffect } from "react";
import { Canvas } from "../classes/drawing/canvas";

export const useCanvasResize = (
  canvasRef: React.RefObject<HTMLCanvasElement | null> ,
  canvasInstanceRef: React.MutableRefObject<Canvas | null>
) => {
  useEffect(() => {
    const resizeCanvas = () => {
      if (!canvasInstanceRef.current || !canvasRef?.current) return;
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvasInstanceRef.current.resize(canvas.width, canvas.height);
      canvasInstanceRef.current.draw();
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);
};
