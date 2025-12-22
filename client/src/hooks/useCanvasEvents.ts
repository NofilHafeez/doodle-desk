import { Point } from "../classes/geometry/point";
import { Canvas } from "../classes/drawing/canvas";
import { Circle } from "../classes/geometry/circle";
import { Rectangle } from "../classes/geometry/rectangle";
import { Diamond } from "../classes/geometry/diamond";
import { Line } from "../classes/geometry/line";
import { Text } from "../classes/Text/text";
import { Socket } from "socket.io-client";
import { Helper } from "../classes/Helper/helper";


// --- Mouse Down ---
export const handleMouseDown = (
  event: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement | null>, 
  startPosRef: React.RefObject<{ x: number; y: number } | null>,
  setIsDragging: (isDragging: boolean) => void,
  buttonTool: string,
  canvasInstance: Canvas,
  setSelectedShapeId: (id: number) => void,
  setIsResizing: (isResizing: boolean) => void,
  setIsMoving: (isMoving: boolean) => void,
  activeHandleRef: React.RefObject<string | null>,
  setdeleteShape: (deleteShape: number) => void,
  socket: Socket,
  roomId: string,
  changeColor: string,
  changeStroke: number
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const { x: worldX, y: worldY } = Helper.getWorldMousePos(event, canvas, canvasInstance.camera);
  startPosRef.current = { x: worldX, y: worldY };
  (startPosRef as any).screen = { x: event.clientX, y: event.clientY };
  // startPosRef.current = { x: event.clientX, y: event.clientY }

  if (buttonTool === "Eraser") {
    const shape = canvasInstance.findShapeAt(worldX, worldY);
    if (shape) {
      canvasInstance.removeShape(shape.id);
      setdeleteShape(shape.id)

        if (socket.connected && roomId) {
          // console.log(shape.id)
          socket.emit("delete-shape",  shape.id );
    }
      }

    } if (buttonTool === "Draw") {
  canvasInstance.startBrush(worldX, worldY, changeColor, changeStroke);
}

  

  if (buttonTool === "Select") {
    const { hit, handle } = Helper.findShapeAndHandleAt(canvasInstance, worldX, worldY);

    if (hit && handle) {
      setSelectedShapeId(hit.id);
      setIsResizing(true);
      setIsMoving(false);
      // console.log(hit)
      activeHandleRef.current = handle;
      canvasRef.current!.style.cursor = getCursorForHandle(handle);

      canvasInstance.draw(hit.id);
      // hit.shape.drawSelectionBox(canvasInstance.getContext(), canvasInstance.camera);
      setIsDragging(true);
      return;
    }

    const clicked = canvasInstance.findShapeAt(worldX, worldY);

    //  safe property updates
    if (clicked) {
      setSelectedShapeId(clicked.id);
      setIsResizing(false);
      setIsMoving(true);
      activeHandleRef.current = null;
      canvasRef.current!.style.cursor = "move";

      canvasInstance.draw(clicked.id);
    } else {
      setSelectedShapeId(0);
      setIsMoving(false);
      setIsResizing(false);
      activeHandleRef.current = null;
      canvasRef.current!.style.cursor = "default";

      canvasInstance.draw();
    }
  }

  setIsDragging(true);
};


// --- Mouse Move ---
export const handleMouseMove = (
  event: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  buttonTool: string,
  startPosRef: React.RefObject<{ x: number; y: number } | null>,
  isDragging: boolean,
  canvasInstance: Canvas,
  changeColor: string,
  changeStroke: number,
  changeColorFill: string,
  changeStrokeStyle: number[],
  selectedShapeId: number,
  isResizing: boolean,
  isMoving: boolean,
  activeHandleRef: React.RefObject<string | null>,
  deleteShape: number,
  socket: Socket,
  roomId: string,
) => {
  if (!isDragging || !startPosRef.current) return;
  const canvas = canvasRef.current;
  if (!canvas) return;

  const { x: worldX, y: worldY } = Helper.getWorldMousePos(event, canvas, canvasInstance.camera);

  const dx = worldX - startPosRef.current.x;
  const dy = worldY - startPosRef.current.y;

  if (buttonTool !== "Draw" && buttonTool !== "Hand") {
    canvasInstance.clear();
    canvasInstance.draw();
  }

  // helper to draw preview in WORLD coords with camera transform applied
  const drawPreview = (fn: (ctx: CanvasRenderingContext2D) => void) => {
    const ctx = canvasInstance.getContext();
    ctx.save();
    ctx.setTransform(
      canvasInstance.camera.scale, 0, 0, canvasInstance.camera.scale,
      -canvasInstance.camera.x * canvasInstance.camera.scale,
      -canvasInstance.camera.y * canvasInstance.camera.scale
    );
    fn(ctx); // draw your world-space temp shape
    ctx.restore();
  };

  switch (buttonTool) {
    case "Circle": {
      const circle = new Circle(
        new Point(startPosRef.current.x, startPosRef.current.y), // WORLD
        Math.abs(dx), // WORLD radii
        Math.abs(dy),
        changeColor,
        "circle",
        changeStroke,
        changeColorFill,
        changeStrokeStyle
      );
      drawPreview(ctx => circle.draw(ctx));
      break;
    }
    case "Rectangle": {
      const rect = new Rectangle(
        new Point(startPosRef.current.x, startPosRef.current.y), // WORLD
        dx, // WORLD width/height
        dy,
        changeColor,
        "rectangle",
        changeStroke,
        changeColorFill,
        changeStrokeStyle
      );
      drawPreview(ctx => rect.draw(ctx));
      break;
    }
    case "Diamond": {
      const diamond = new Diamond(
        new Point(startPosRef.current.x, startPosRef.current.y),
        Math.abs(dx),
        Math.abs(dy),
        changeColor,
        "diamond",
        changeStroke,
        changeColorFill,
        changeStrokeStyle
      );
      drawPreview(ctx => diamond.draw(ctx));
      break;
    }
    case "Line": {
      const line = new Line(
        new Point(startPosRef.current.x, startPosRef.current.y), // WORLD
        new Point(worldX, worldY),                               // WORLD
        changeColor,
        "line",
        changeStroke,
        "transparent",
        changeStrokeStyle
      );
      drawPreview(ctx => line.draw(ctx));
      break;
    }
    case "Draw": {
      // const strokeSeg = new drawingBrush(
      //   // startPosRef.current.x, // WORLD
      //   // startPosRef.current.y, // WORLD
      //   worldX,
      //   worldY,
      //   changeColor,
      //   changeStroke
      // );
      // drawPreview(ctx => strokeSeg.draw(ctx));

      // // persist stroke in WORLD
      // canvasInstance.do_drawing(
      //   // startPosRef.current.x,
      //   // startPosRef.current.y,
      //   worldX,
      //   worldY,
      //   changeColor,
      //   changeStroke
      // );
      // startPosRef.current = { x: worldX, y: worldY };

  //       let currentBrush = canvasInstance.currentBrush;

  // // If starting a new stroke
  // if (!currentBrush) {
  //   currentBrush = new drawingBrush(
  //     startPosRef.current.x,
  //     startPosRef.current.y,
  //     changeColor,
  //     changeStroke
  //   );
  //   canvasInstance.currentBrush = currentBrush;
  //   canvasInstance.addShape(currentBrush); // store it in shapes
  // }

  // // Add new point
  // currentBrush.addPoint(worldX, worldY);

  // // Redraw
  // canvasInstance.clear();
  // canvasInstance.draw();

    canvasInstance.updateBrush(worldX, worldY);
      break;
    }
    case "Eraser": {
      const shape = canvasInstance.findShapeAt(worldX, worldY);
      if (shape && deleteShape) {
        canvasInstance.removeShape(shape.id);
        canvasInstance.draw();

         if (socket.connected && roomId) {
          console.log(shape.id)
          socket.emit("delete-shape",  shape.id); 
    }
      }
      break;
    }
    case "Select": {
        
      const item = canvasInstance.getShapeById(selectedShapeId);
      if (!item) return;

     
      
      

      if (!isMoving && !isResizing) {
        const { handle } = Helper.findShapeAndHandleAt(canvasInstance, worldX, worldY);
        canvasRef.current!.style.cursor = handle
          ? getCursorForHandle(handle)
          : canvasInstance.findShapeAt(worldX, worldY)
          ? "move"
          : "default";
      }

      if (isMoving) {
        item.shape.move(dx, dy); // WORLD delta
        startPosRef.current = { x: worldX, y: worldY };
        canvasRef.current!.style.cursor = "move";
        // canvasInstance.clear();
        canvasInstance.draw(selectedShapeId); 
        // item.shape.drawSelectionBox(canvasInstance.getContext(), canvasInstance.camera);
      }

      if (isResizing && activeHandleRef.current) {
        canvasRef.current!.style.cursor = getCursorForHandle(activeHandleRef.current);
        item.shape.resize(activeHandleRef.current, worldX, worldY); // WORLD mouse
        // canvasInstance.clear();
        canvasInstance.draw(selectedShapeId);
        // item.shape.drawSelectionBox(canvasInstance.getContext(), canvasInstance.camera);

      }
      break;
    }
    case "Hand": {
      const lastScreen = (startPosRef as any).screen;
      // const lastScreen = startPosRef.current
      const dxScreen = event.clientX - lastScreen.x;
      const dyScreen = event.clientY - lastScreen.y;

      // drag to right => move camera left in WORLD
      canvasInstance.camera.x -= dxScreen / canvasInstance.camera.scale;
      canvasInstance.camera.y -= dyScreen / canvasInstance.camera.scale;

      (startPosRef as any).screen = { x: event.clientX, y: event.clientY };
      //  startPosRef.current = { x: event.clientX, y: event.clientY }
      canvasInstance.draw(selectedShapeId);
        // item.shape.drawSelectionBox(canvasInstance.getContext(), canvasInstance.camera);

      break;
    } case "Text": {
      // const userText = prompt("Enter text:", "hello");
       const rect = new Text(
        "",
        new Point(startPosRef.current.x, startPosRef.current.y), // WORLD
        dx, // WORLD width/height
        dy,
        changeColor,
      );
      drawPreview(ctx => rect.draw(ctx, true));

      break;

    }
  }
};

// --- Mouse Up (unchanged logic, now consistent with WORLD coords) ---
export const handleMouseUp = (
  event: MouseEvent,
  buttonTool: string,
  startPosRef: React.RefObject<{ x: number; y: number } | null>,
  isDragging: boolean,
  setIsDragging: (isDragging: boolean) => void,
  canvasInstance: Canvas,
  changeColor: string,
  changeStroke: number,
  changeColorFill: string,
  changeStrokeStyle: number[],
  selectedShapeId: number,
  isResizing: boolean,
) => {
  if (!isDragging || !startPosRef.current) return;

  const canvas = canvasInstance.canvas;
  const { x: worldX, y: worldY } = Helper.getWorldMousePos(event, canvas, canvasInstance.camera);

  const dx = worldX - startPosRef.current.x;
  const dy = worldY - startPosRef.current.y;

  switch (buttonTool) {
    case "Circle":
      canvasInstance.add_circle(
        new Point(startPosRef.current.x, startPosRef.current.y),
        Math.abs(dx),
        Math.abs(dy),
        changeColor, 
        changeStroke,
        changeColorFill,
        changeStrokeStyle
      );
      break;
    case "Rectangle":
      canvasInstance.add_rectangle(
        new Point(startPosRef.current.x, startPosRef.current.y),
        dx,
        dy,
        changeColor,
        changeStroke,
        changeColorFill,
        changeStrokeStyle
      );
      break;
     case "Text":
      // const userText = prompt("Enter text:", "hello");
      canvasInstance.add_text(
        "Text",
        new Point(startPosRef.current.x, startPosRef.current.y),
        dx,
        dy,
        changeColor,
      );
      break;
    case "Diamond":
      canvasInstance.add_diamond(
        new Point(startPosRef.current.x, startPosRef.current.y),
        Math.abs(dx),
        Math.abs(dy),
        changeColor,
        changeStroke,
        changeColorFill,
        changeStrokeStyle
      );
      break;
    case "Line":
      canvasInstance.add_line(
        new Point(startPosRef.current.x, startPosRef.current.y),
        new Point(worldX, worldY),
        changeColor,
        changeStroke,
        changeStrokeStyle
      );
      break;    
    case "Eraser":
      break;
    case "Select":
      if (selectedShapeId) {
        const shape = canvasInstance.getShapeById(selectedShapeId);
        if (shape) {canvasInstance.canvas.style.cursor = isResizing ? "default" : "move"
          
        }
        ;
      }
      break;
    case "Hand":
      break;
    case "Draw":
        canvasInstance.endBrush();
        break;
  }

  setIsDragging(false);
  // setdeleteShape(0)
  startPosRef.current = null;
};

// --- cursors ---
const getCursorForHandle = (handle: string) => {
  const cursorMap: Record<string, string> = {
    "left-center": "w-resize",
    "right-center": "e-resize",
    "top-center": "n-resize",
    "bottom-center": "s-resize",
    "top-left": "nw-resize",
    "top-right": "ne-resize",
    "bottom-left": "sw-resize",
    "bottom-right": "se-resize",
    start: "nw-resize",
    end: "se-resize",
  };
  return cursorMap[handle] || "default";
};
