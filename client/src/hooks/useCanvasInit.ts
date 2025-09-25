import { useEffect } from "react";
import { Canvas } from "../classes/drawing/canvas";
import { HistoryManager } from "../classes/historyManager/storage";
import type { ShapeInterface } from "../type/shapes";

export const useCanvasInit = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  historyManagerRef: React.MutableRefObject<HistoryManager | null>,
  setShapes: React.Dispatch<React.SetStateAction<ShapeInterface[]>>,
  pushSnapshot: (snapshot?: ShapeInterface[]) => void 
) => {
  useEffect(() => {
    if (!canvasRef?.current || canvasInstanceRef.current) return;

    const canvasInstance = new Canvas("drawingCanvas");
    canvasInstance.canvas = canvasRef.current;
    canvasInstance.ctx = canvasRef.current.getContext("2d")!;
    canvasInstanceRef.current = canvasInstance;

    historyManagerRef.current = new HistoryManager([]);
    const loadedShapes = canvasInstance.storage.getAllShapes();
    setShapes(loadedShapes);

    // push initial snapshot
    pushSnapshot(loadedShapes);

    canvasInstanceRef.current.draw();
  }, []);
};
