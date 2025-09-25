// UI.tsx
import React from "react";
import ToolBar from "../components/ToolBar";
import SideEditing from "../components/SideEditing";
import Zoom from "../components/zoom";
import Share from "../components/Share";
import Undo from "../components/Undo";
import type { ShapeInterface } from "../type/shapes";
import { Canvas } from "../classes/drawing/canvas";
import { Socket } from "socket.io-client";

interface UIProps {
  buttonTool: string;
  setButtonTool: (tool: string) => void;
  lock: string;
  setlock: (val: string) => void;

  setShapeCreated: React.Dispatch<React.SetStateAction<number>>;
  changeColor: string;
  setChangeColor: React.Dispatch<React.SetStateAction<string>>;
  changeStroke: number;
  setChangeStroke: React.Dispatch<React.SetStateAction<number>>;
  changeColorFill: string;
  setChangeColorFill: React.Dispatch<React.SetStateAction<string>>;
  changeStrokeStyle: number[];
  setChangeStrokeStyle: React.Dispatch<React.SetStateAction<number[]>>;
  changeCanvasColor: string;
  setChangeCanvasColor: React.Dispatch<React.SetStateAction<string>>;

  roomId: string;
  setRoomId: (val: string) => void;
  shapes: ShapeInterface[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeInterface[]>>;
  socket: Socket;
  canvasInstance: Canvas | null;

  undo: () => void;
  redo: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement  | null>;
}

const UI: React.FC<UIProps> = ({
  buttonTool,
  setButtonTool,
  lock,
  setlock,
  setShapeCreated,
  changeColor,
  setChangeColor,
  changeStroke,
  setChangeStroke,
  changeColorFill,
  setChangeColorFill,
  setChangeStrokeStyle,
  changeCanvasColor,
  setChangeCanvasColor,
  roomId,
  setRoomId,
  shapes,
  setShapes,
  socket,
  canvasInstance,
  undo,
  redo,
  canvasRef,
}) => {
  return (
    <div className="workspace">
      <header className="toolbar">
        <ToolBar
          setShapeCreated={setShapeCreated}
          canvasInstance={canvasInstance}
          setButtonTool={setButtonTool}
          setlock={setlock}
          lock={lock}
        />
      </header>

      <div className="left-content">
        {/* Side Editing */}
        <div style={{ position: "fixed", top: "15%", left: "2%" }}>
          {buttonTool !== "Hand" && (
            <SideEditing
              setChangeColor={setChangeColor}
              setChangeStroke={setChangeStroke}
              setChangeColorFill={setChangeColorFill}
              setChangeStrokeStyle={setChangeStrokeStyle}
              setChangeCanvasColor={setChangeCanvasColor}
              roomId={roomId}
              socket={socket}
              canvasInstance={canvasInstance}
              setShapes={setShapes}
              changeColor={changeColor}
              changeColorFill={changeColorFill}
              changeStroke={changeStroke}
              changeCanvasColor={changeCanvasColor}
            />
          )}
        </div>

        {/* Zoom + Undo */}
        <div
          className="bottom-left"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            position: "fixed",
            bottom: "3%",
            left: "2%",
          }}
        >
          <Zoom canvasInstance={canvasInstance} />
          <Undo undo={undo} redo={redo} />
        </div>

        {/* Share */}
        <div
          className="right-content"
          style={{ position: "fixed", top: "4%", right: "2%" }}
        >
          <Share
            roomId={roomId}
            setRoomId={setRoomId}
            setShapes={setShapes}
            shapes={shapes}
            socket={socket}
            canvasInstance={canvasInstance}
          />
        </div>

        {/* Canvas */}
        <main className="canvas-area">
          <canvas
            style={{ display: "block", background: changeCanvasColor }}
            id="drawingCanvas"
            ref={canvasRef}
          />
        </main>
      </div>
    </div>
  );
};

export default UI;
