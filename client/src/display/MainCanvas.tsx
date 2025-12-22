import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas } from '../classes/drawing/canvas';
import { handleMouseDown, handleMouseMove, handleMouseUp } from '../hooks/useCanvasEvents';
import { HistoryManager } from '../classes/historyManager/storage';
import { io } from 'socket.io-client';
import type { ShapeInterface } from '../type/shapes';
import { ShapesStorage } from '../classes/shapeStorage/storage';
import { Helper } from '../classes/Helper/helper';
import UI from '../components/Ui';
import { useCanvasInit } from '../hooks/useCanvasInit';
import { useCanvasResize } from '../hooks/useCanvasResize';
import { useHistoryShortcuts } from '../hooks/useHistoryShortcuts';
import { useCursor } from '../hooks/useCursor';
import { useShapeEditing } from '../hooks/useShapeEditing';
import type { EditableText } from '../type/drawable';


const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
});

const MainCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const startPosRef = useRef<{x: number; y: number} | null>(null);
  const [buttonTool, setButtonTool] = useState<string>("Select");
  const [isDragging, setIsDragging] = useState(false);
  const canvasInstanceRef = useRef<Canvas | null>(null);
  const historyManagerRef = useRef<HistoryManager | null>(null);
  const [shapes, setShapes] = useState<ShapeInterface[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number>(0);
  const selectedShapeIdRef = useRef<number>(0); // ref to fix undo/redo issue
  const [changeColor, setChangeColor] = useState<string>('#000000');
  const [changeStroke, setChangeStroke] = useState<number>(1);
  const [changeColorFill, setChangeColorFill] = useState<string>('#ffffff');
  const [changeStrokeStyle, setChangeStrokeStyle] = useState<number[]>([0,0]);
  const [changeCanvasColor, setChangeCanvasColor] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const { canvas } = JSON.parse(savedTheme);
      return canvas || "#ffffff"; // fallback
    } 
    return ""; // default
  });

  const [isResizing, setIsResizing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const activeHandleRef = useRef<string | null>(null);
  const [roomId, setRoomId] = useState("");
  const [deleteShape, setdeleteShape] = useState(0)
  const [shapeCreated, setShapeCreated] = useState(0)
  const [lock, setlock] = useState("Unlock")
  // const isPopulatingRef = useRef(false);
  



  // keep ref updated
useEffect(() => {
    selectedShapeIdRef.current = selectedShapeId;
  }, [selectedShapeId]);


//  keep canvas storage synced with React shapes
useEffect(() => {
  if (!canvasInstanceRef.current) return;

  canvasInstanceRef.current.storage.shapes = shapes;
  canvasInstanceRef.current.draw(selectedShapeId);
}, [shapes, selectedShapeId]);
  
  const pushSnapshot = useCallback((snapshotFromCanvas?: ShapeInterface[]) => {
  if (!historyManagerRef.current || !canvasInstanceRef.current) return;

  const snapshot = (snapshotFromCanvas ?? canvasInstanceRef.current.storage.shapes).map(s => ({ ...s }));

  // optional: don't push if identical to last snapshot
  const hist = historyManagerRef.current.getHistory();
  const last = hist.length ? hist[hist.length - 1] : null;
  try {
    if (last && JSON.stringify(last) === JSON.stringify(snapshot)) {
      return; // nothing changed
    }
  } catch (err) {
    // stringify can fail for circular references; ignore in that case
  }

  historyManagerRef.current.add(snapshot);
  const current = historyManagerRef.current.getShapes().map(s=> ({ ...s }));
  canvasInstanceRef.current.storage.shapes = current;
  setShapes(current);
}, []);

  // sync history to canvas
const syncFromHistory = useCallback(() => {
    if (!historyManagerRef.current || !canvasInstanceRef.current) return;
    const newShapes = historyManagerRef.current.getShapes().map(s => ({ ...s }));
    const saveLocal = new ShapesStorage()
    saveLocal.shapes = newShapes
    saveLocal.saveToLocal(); // fetching shapes from history and adding in canvas shapes
    canvasInstanceRef.current.storage.shapes = newShapes;
    setShapes(newShapes);
    canvasInstanceRef.current.draw(selectedShapeIdRef.current); // use ref
}, []);

  // undo / redo
const undo = useCallback(() => {
    if (!historyManagerRef.current || !canvasInstanceRef.current) return;
    historyManagerRef.current.undo();
    syncFromHistory();
}, [syncFromHistory]);


const redo = useCallback(() => {
    if (!historyManagerRef.current || !canvasInstanceRef.current) return;
    
    historyManagerRef.current.redo();
    syncFromHistory();
}, [syncFromHistory]);


useEffect(() => {
  if (!canvasInstanceRef.current || !selectedShapeId) return;

  const handleDblClick = (e: MouseEvent) => {
    const canvas = canvasInstanceRef.current!.canvas;
    const rect = canvas.getBoundingClientRect();
    const x =
      (e.clientX - rect.left) / canvasInstanceRef.current!.camera.scale -
      canvasInstanceRef.current!.camera.x;
    const y =
      (e.clientY - rect.top) / canvasInstanceRef.current!.camera.scale -
      canvasInstanceRef.current!.camera.y;

    const clicked = canvasInstanceRef.current!.findShapeAt(x, y);
    if (clicked && clicked.type === "text") {
      const userText = prompt("Enter text:", clicked.shape.text);
      
      if (userText !== null) {
        // 1. Update the shape
        if (clicked.shape instanceof Text) {
  (clicked.shape as EditableText).editText(userText);
}

        canvasInstanceRef.current!.draw();

        // 2. Update local state (replace shape by id)
        setShapes(prev =>
          prev.map(s => (s.id === clicked.id ? { ...clicked } : s))
        );
        canvasInstanceRef.current!.storage.shapes = [
          ...canvasInstanceRef.current!.storage.shapes.map(s =>
            s.id === clicked.id ? { ...clicked } : s
          ),
        ];
        canvasInstanceRef.current!.storage.saveToLocal();

        // 3. Emit over socket
        if (socket.connected && roomId) {
          socket.emit("drawing", Helper.serializeShape(clicked));
        } 
      }
    }
  };

  const canvas = canvasInstanceRef.current.canvas;
  canvas.addEventListener("dblclick", handleDblClick);

  return () => {
    canvas.removeEventListener("dblclick", handleDblClick);
  };
}, [selectedShapeId, roomId, setShapes]);

  // mouse events
useEffect(() => {
    if (!canvasRef.current) return;

    const down = (e: MouseEvent) =>
      handleMouseDown(
        e, canvasRef, startPosRef, setIsDragging, buttonTool,
        canvasInstanceRef.current!, setSelectedShapeId,
        setIsResizing, setIsMoving, activeHandleRef,
        setdeleteShape, socket, roomId, changeColor, changeStroke
      );

    const move = (e: MouseEvent) =>
      handleMouseMove(
        e, canvasRef, buttonTool, startPosRef, isDragging,
        canvasInstanceRef.current!, changeColor, changeStroke,
        changeColorFill, changeStrokeStyle, selectedShapeId,
        isResizing, isMoving, activeHandleRef,
        deleteShape,  socket, roomId
      );

     
   const up = (e: MouseEvent) => {
  // If there was no prior mousedown on the canvas and we're not dragging,
  // ignore this mouseup (prevents UI buttons from triggering snapshots).
  if (!startPosRef.current && !isDragging) {
    return;
  }

  // call existing logic to finish drawing / resizing / moving
  handleMouseUp(
    e, buttonTool, startPosRef, isDragging, setIsDragging,
    canvasInstanceRef.current!, changeColor, changeStroke,
    changeColorFill, changeStrokeStyle, selectedShapeId,
    isResizing, 
  );


  if (lock === "Unlock" && isDragging) {
    // console.log('a')
      setButtonTool("Select")
    } else  {
    // console.log('t')

        setButtonTool(buttonTool)
    }

      // update state and push to history
      const newShapes = [...canvasInstanceRef.current!.storage.shapes];
      setShapes(newShapes);
      pushSnapshot();

     if (socket.connected && roomId) {
  // const currentShapes = shapes;
  if (newShapes.length > 0) {
    const latestShape = newShapes[newShapes.length - 1];
    
    socket.emit("drawing", Helper.serializeShape(latestShape));
  }
    // console.log(isDragging)
  

   


  startPosRef.current = null;
}



    };

    const c = canvasRef.current;
    c.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      c.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [
    buttonTool, 
    isDragging, 
    changeColor, 
    changeStroke, 
    changeColorFill, 
    changeStrokeStyle, 
    selectedShapeId, 
    isMoving, 
    isResizing,
    roomId,
    shapes,
    pushSnapshot,
    deleteShape,
    lock
]);

useEffect(() => {
  if (!socket.connected || !roomId) return;
  if (shapes.length === 0) return;

  const latest = shapes[shapes.length - 1];
  socket.emit("drawing", Helper.serializeShape(latest));
  // console.log(shapeCreated)
}, [shapeCreated, roomId]);



  useShapeEditing(
    canvasInstanceRef, 
    shapes, setShapes, 
    selectedShapeId, 
    socket, 
    roomId, 
    changeColor, 
    setChangeColor, 
    changeColorFill,
    setChangeColorFill, 
    changeStroke, 
    setChangeStroke, 
    changeStrokeStyle, 
    setChangeStrokeStyle
  );
  useCanvasInit(canvasRef, canvasInstanceRef, historyManagerRef, setShapes, pushSnapshot);
  useCanvasResize(canvasRef, canvasInstanceRef);
  useHistoryShortcuts(undo, redo);
  useCursor(buttonTool, canvasRef);


  return (
     <UI
      buttonTool={buttonTool}
      setButtonTool={setButtonTool}
      lock={lock}
      setlock={setlock}
      setShapeCreated={setShapeCreated}
      changeColor={changeColor}
      setChangeColor={setChangeColor}
      changeStroke={changeStroke}
      setChangeStroke={setChangeStroke}
      changeColorFill={changeColorFill}
      setChangeColorFill={setChangeColorFill}
      changeStrokeStyle={changeStrokeStyle}
      setChangeStrokeStyle={setChangeStrokeStyle}
      changeCanvasColor={changeCanvasColor}
      setChangeCanvasColor={setChangeCanvasColor}
      roomId={roomId}
      setRoomId={setRoomId}
      shapes={shapes}
      setShapes={setShapes}
      socket={socket}
      canvasInstance={canvasInstanceRef.current}
      undo={undo}
      redo={redo}
      canvasRef={canvasRef}
    />
  );
};

export default MainCanvas;
