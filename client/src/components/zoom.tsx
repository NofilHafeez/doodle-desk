    // import { zoomIn, zoomOut } from "../hooks/useZoom";
    import { useState } from "react";
    import { Canvas } from "../classes/drawing/canvas";

    interface ZoomProps {
      canvasInstance:  Canvas | null;
    }

    const Zoom = ({canvasInstance} : ZoomProps) => {
    //   const [zoom, setZoom] = useState<number>(1); 
    const [scale, setScale] = useState(1);
    // single zoom state

    function minmax(value: number, interval: [number, number]) {
    return Math.max(Math.min(value, interval[1]), interval[0]);
    }

    const onZoom = (delta: number | string) => {
  let newScale = scale;
  if (delta === "default") {
    newScale = 1;
  } else if (typeof delta === "number") {
    newScale = minmax(scale + delta, [0.1, 20]);
  }

  setScale(newScale);

  if (canvasInstance) {
    canvasInstance.camera.scale = newScale;
    canvasInstance.draw()
  }
};


     return (
    <>
      <style>{`
        .zoomOptions {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-color);
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          overflow: hidden;
          width: fit-content;
          margin: 10px auto;
        }
        .zoomBtn {
          border: none;
          background: var(--bg-color);
          color: var(--text-color);
          padding: 9px 14px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s ease;
          border: 1px solid var(--text-color);
        }
        .zoomBtn:hover {
          background: gray;
        }
        .zoomText {
          background: var(--bg-color);
          padding: 9.5px 14px;
          font-weight: bold;
          font-size: 15px;
          font-family: sans-serif;
          border-left: 1px solid var(--text-color);
          border-right: 1px solid var(--text-color);
          cursor: pointer;
          user-select: none;
          border-top: 1px solid var(--text-color);
          border-bottom: 1px solid var(--text-color);


        }
      `}</style>

      <section className="zoomOptions">
        <button className="zoomBtn" onClick={() => onZoom(-0.1)}>
          –
        </button>
        <span
          className="zoomText"
          onClick={() => onZoom("default")}
          title="Reset zoom"
        >
          {new Intl.NumberFormat("fr-CA", { style: "percent" }).format(scale)}
        </span>
        <button className="zoomBtn" onClick={() => onZoom(0.1)}>
          +
        </button>
      </section>
    </>
  );
    };

    export default Zoom;
