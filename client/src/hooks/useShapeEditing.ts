import { useEffect, useRef} from "react";
import type { ShapeInterface } from "../type/shapes";
import { Helper } from "../classes/Helper/helper";
import { Canvas } from "../classes/drawing/canvas";
import { Socket } from "socket.io-client";

export const useShapeEditing = (
  canvasInstanceRef: React.MutableRefObject<Canvas | null>,
  shapes: ShapeInterface[],
  setShapes: React.Dispatch<React.SetStateAction<ShapeInterface[]>>,
  selectedShapeId: number,
  socket: Socket,
  roomId: string | null,
  changeColor: string,
  setChangeColor: React.Dispatch<React.SetStateAction<string>>,
  changeColorFill: string,
  setChangeColorFill: React.Dispatch<React.SetStateAction<string>>,
  changeStroke: number,
  setChangeStroke: React.Dispatch<React.SetStateAction<number>>,
  changeStrokeStyle: number[],
  setChangeStrokeStyle: React.Dispatch<React.SetStateAction<number[]>>,

) => {

  const isPopulatingRef = useRef(false);

  // 1️ Populate editing fields when a shape is selected
  useEffect(() => {
    if (!canvasInstanceRef.current || selectedShapeId === 0) return;

    const currentShapes = canvasInstanceRef.current.storage.shapes;
    const shape = currentShapes.find(s => s.id === selectedShapeId);
    if (!shape) return;

    isPopulatingRef.current = true;

    setChangeColor(shape.shape.color ?? "");
    setChangeColorFill(shape.shape.fillColor ?? "");
    setChangeStroke(shape.shape.strokeWidth ?? 1);
    setChangeStrokeStyle([...shape.shape.strokeStyle ?? [0, 0]]);
  }, [selectedShapeId]);

  // 2️ Apply editing changes to selected shape
  useEffect(() => {
    if (!canvasInstanceRef.current || selectedShapeId === 0) return;

    if (isPopulatingRef.current) {
      isPopulatingRef.current = false; // prevent blink
      return;
    }

    const updatedShapes = [...shapes];
    const idx = updatedShapes.findIndex(s => s.id === selectedShapeId);
    if (idx === -1) return;

    const selected = updatedShapes[idx];
    let changed = false;

    if (changeColor) {
      if (selected.shape.color) {
        selected.shape.color = changeColor;
      } else {
        selected.shape.textColor = changeColor;
      }
      changed = true;
    }

    if (changeStroke && changeStroke > 0) {
      selected.shape.strokeWidth = changeStroke;
      changed = true;
    }

    if (changeColorFill) {
      selected.shape.fillColor = changeColorFill;
      changed = true;
    }

    if (
      Array.isArray(changeStrokeStyle) &&
      (changeStrokeStyle[0] !== 0 || changeStrokeStyle[1] !== 0)
    ) {
      selected.shape.strokeStyle = [...changeStrokeStyle];
      changed = true;
    }

    if (changed) {
      updatedShapes[idx] = { ...selected };
      canvasInstanceRef.current.storage.shapes = updatedShapes;
      setShapes(updatedShapes);
      canvasInstanceRef.current.storage.saveToLocal();
      canvasInstanceRef.current.draw(selectedShapeId);

      if (socket.connected && roomId) {
        socket.emit("drawing", Helper.serializeShape(updatedShapes[idx]));
      }
    }
  }, [
    changeColor,
    changeStroke,
    changeColorFill,
    changeStrokeStyle,
    selectedShapeId,
    shapes,
    roomId,
    socket,
    canvasInstanceRef,
    setShapes
  ]);

  return {
    changeColor,
    setChangeColor,
    changeColorFill,
    setChangeColorFill,
    changeStroke,
    setChangeStroke,
    changeStrokeStyle,
    setChangeStrokeStyle,
  };
};
