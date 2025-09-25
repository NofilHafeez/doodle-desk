import { Circle } from "../../classes/geometry/circle";
import { Rectangle } from "../../classes/geometry/rectangle";
import { Diamond } from "../../classes/geometry/diamond";
import { Line } from "../../classes/geometry/line";
import { Text } from "../../classes/Text/text";
import { Point } from "../../classes/geometry/point";
import type { ShapeInterface } from "../../type/shapes";
import type { SerializedShapeData } from "../../type/shapes";
import { drawingBrush } from "../../classes/drawing/drawingBrush";
import type { Canvas } from "../../classes/drawing/canvas";
import type { Drawable } from "../../type/drawable";
import { Shape } from "../shape";


export class Helper {    
    static deserializeShape(data: SerializedShapeData): ShapeInterface{
      let shapeInstance;
      // console.log()
    
      switch (data.type) {
        case "circle":
          shapeInstance = new Circle(
            new Point(data.shape.center.x, data.shape.center.y),
            data.shape.radiusx,
            data.shape.radiusy,
            data.shape.color,
            data.shape.name,
            data.shape.strokeWidth,
            data.shape.fillColor,
            data.shape.strokeStyle
          );
          break;
    
        case "rectangle":
          shapeInstance = new Rectangle(
            new Point(data.shape.topLeft.x, data.shape.topLeft.y),
            data.shape.width,
            data.shape.height,
            data.shape.color,
            data.shape.name,
            data.shape.strokeWidth,
            data.shape.fillColor,
            data.shape.strokeStyle
          );
          break;
    
        case "diamond":
          shapeInstance = new Diamond(
            new Point(data.shape.center.x, data.shape.center.y),
            data.shape.radiusx,
            data.shape.radiusy,
            data.shape.color,
            data.shape.name,
            data.shape.strokeWidth,
            data.shape.fillColor,
            data.shape.strokeStyle
          );
          break;
    
        case "line":
          shapeInstance = new Line(
            new Point(data.shape.start.x, data.shape.start.y),
            new Point(data.shape.end.x, data.shape.end.y),
            data.shape.color,
            data.shape.name,
            data.shape.strokeWidth,
            data.shape.fillColor,
            data.shape.strokeStyle
          );
          break;
    
        case "text":
          shapeInstance = new Text(
            data.shape.text,
            new Point(data.shape.topLeft.x, data.shape.topLeft.y),
            data.shape.width,
            data.shape.height,
            data.shape.textColor
          );
          break;
        case "draw": // <<-- Add brush support
          shapeInstance = new drawingBrush(
            data.shape.points,
            data.shape.color,
            data.shape.strokeWidth
          );
          break;
    
        default:
          throw new Error("Unknown shape type: " + data);
      }
    
      return {
        id: data.id, 
        type: data.type,
        shape: shapeInstance,
      };
    }

    static serializeShape(shapeObj: ShapeInterface) {
  const { id, type, shape } = shapeObj;

  switch (type) {
    case "draw":
      return {
        id,
        type,
        shape: {
          points: shape.points,        // all brush stroke points
          color: shape.color,
          strokeWidth: shape.strokeWidth,
        },
      };

    default:
      return { id, type, shape }; // fallback for other shapes
  }
    }
    
    static addShape(shape: any, canvasInstance: Canvas | null, setShapeCreated:  React.Dispatch<React.SetStateAction<number>>) {
      switch (shape.type) {
        case "circle":
          canvasInstance?.add_circle(
            new Point(Number(shape.x), Number(shape.y)),
            shape.radius,
            shape.radius,
            shape.stroke || "black",
            2,
            shape.fill || "transparent",
            []
          );
          setShapeCreated(prev => prev + 1)
          break; 
        case "rectangle":
          canvasInstance?.add_rectangle(
            new Point(shape.x, shape.y),
            shape.width,
            shape.height,
            shape.stroke || "black",
            2,
            shape.fill || "transparent",
            []
          );
          setShapeCreated(prev => prev + 1)
          break;
        case "line":
          canvasInstance?.add_line(
            new Point(shape.x1, shape.y1),
            new Point(shape.x2, shape.y2),
            shape.stroke || "black",
            2,
            []
          );
          setShapeCreated(prev => prev + 1)
          break;
        case "diamond":
          canvasInstance?.add_diamond(
            new Point(shape.x, shape.y),
            shape.rx || 50, // default sizes if missing
            shape.ry || 50,
            shape.stroke || "black",
            2,
            shape.fill || "transparent",
            []
          );
          setShapeCreated(prev => prev + 1)
          break;
          case "text":
          canvasInstance?.add_text(
            shape.text,
            new Point(shape.x, shape.y),
            shape.width,
            shape.height,
            shape.textColor
          );
          setShapeCreated(prev => prev + 1)
          break;
        default:
          console.warn(`Shape type "${shape.type}" is not supported by Canvas.`);
      }
          // setShapeCreated(0)
      // 
      canvasInstance?.draw();
    } 

    static getWorldMousePos(
      event: MouseEvent,
      canvas: HTMLCanvasElement,
      camera: { x: number; y: number; scale: number }
    ) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
    
      // screen coords in *canvas pixels*
      const screenX = (event.clientX - rect.left) * scaleX;
      const screenY = (event.clientY - rect.top) * scaleY;
    
      // screen -> world : world = screen/scale + camera
      return {
        x: screenX / camera.scale + camera.x,
        y: screenY / camera.scale + camera.y,
      };
    }
    
    static worldToScreen(
      x: number,
      y: number,
      camera: { x: number; y: number; scale: number }
    ) {
      return {
        x: (x - camera.x) * camera.scale,
        y: (y - camera.y) * camera.scale,
      };
    }
    
    static findShapeAndHandleAt(canvasInstance: Canvas, x: number, y: number) {
      const shapes = canvasInstance.storage?.shapes || [];
      for (let i = shapes.length - 1; i >= 0; i--) {
        const s = shapes[i];
        if (!s || !s.shape) continue;
        const handle = this.getHandleAt?.(s.shape, x, y);
        if (handle) return { hit: s, handle };
      }
      return { hit: null, handle: null };
    }
    
    static getHandleAt(shape: Drawable, x: number, y: number): string | null {
      const size = Shape.HANDLE_SIZE;
      const half = size / 2;
      for (const h of shape.getHandles()) { 
        const withinX = x >= h.x - half && x <= h.x + half;
        const withinY = y >= h.y - half && y <= h.y + half;
        if (withinX && withinY) return h.name;
      }
      return null;
    }
    
}