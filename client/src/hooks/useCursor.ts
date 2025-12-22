import { useEffect } from "react";
// import { Diamond } from "../classes/geometry/diamond";

export const useCursor = (
  buttonTool: string,
  canvasRef: React.RefObject<HTMLCanvasElement  | null> ,
) => {
  useEffect(() => {
    const cursorMap: Record<string, string> = {
      Draw: "crosshair",
      Eraser: "cell",
      Circle: "crosshair",
      Rectangle: "crosshair",
      Line: "crosshair",
      Diamond: "crosshair",
      Hand: "grab",
    };
    if (canvasRef?.current) {
      canvasRef.current.style.cursor = cursorMap[buttonTool] || "default";
    }
  }, [buttonTool, canvasRef]);
};
