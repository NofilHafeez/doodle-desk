import '../style/sideEditing.css'
import { ShapesStorage } from '../classes/shapeStorage/storage';
import type { Socket } from 'socket.io-client';
import { Canvas } from '../classes/drawing/canvas';
import type { ShapeInterface } from '../type/shapes';
// import { Canvas } from '../classes/drawing/canvas';
import '../style/theme.css'
import { useTheme } from '../hooks/useTheme';

interface SideEditingProps {
  setChangeColor: (tool: string) => void;
  setChangeStroke: (tool: number) => void;
  setChangeColorFill: (tool: string) => void;
  setChangeStrokeStyle: (tool: number[]) => void;
  setChangeCanvasColor: (tool: string) => void;
  roomId: string;
  socket: Socket;
  canvasInstance: Canvas | null;
  setShapes: (shapes: ShapeInterface[]) => void;
  changeColor: string;
  changeColorFill: string;
  changeStroke: number;
  changeCanvasColor: string;
}

const SideEditing = ({
  setChangeColor,
  setChangeStroke,
  setChangeColorFill,
  setChangeStrokeStyle,
  setChangeCanvasColor,
  roomId,
  socket,
  canvasInstance,
  setShapes,
  changeColor,
  changeColorFill,
  changeStroke,
  changeCanvasColor,

}: SideEditingProps) => {
  const {theme, toggleTheme} = useTheme(setChangeCanvasColor, changeCanvasColor);

 const clearCanvas = () => {
  ShapesStorage.getInstance().clear();
  setShapes([]);

  if (socket.connected && roomId) {
    socket.emit("clear-canvas", roomId);
  }

  if (canvasInstance) {
    canvasInstance.draw(); // show empty
  }
};


const handleCanvasColor = () => {
  toggleTheme()
  if (theme === "light") {
    setChangeCanvasColor('#121212')
    setChangeColor("white")
    setChangeColorFill("transparent")
  } else {
    setChangeCanvasColor('white')
    setChangeColor("black")
    setChangeColorFill("")

  } 
}

  return (
    <div  className="sideEditing">

      {/* Stroke */}
      <div>
        <h2 className="section-title">Stroke</h2>
        <div className='color-btn-stroke'>
          <button onClick={() => setChangeColor("#1971c2")} className="color-btn st1" aria-label="Blue Stroke"/>  
          <button onClick={() => setChangeColor("#e03131")} className="color-btn st2" aria-label="Red Stroke"/>
          <button onClick={() => setChangeColor("#f08c00")} className="color-btn st3" aria-label="Orange Stroke"/>
            <div className='relative-p'>
          - <input  type='color' className="color-btn picker" aria-label="picker Stroke" value={changeColor} style={{backgroundColor: changeColor}}  onChange={(e) => setChangeColor(e.target.value)}/>
            </div>
          
        </div>
      </div>

      {/* Fill */}
      <div>
        <h2 className="section-title">Fill</h2>
        <div className='color-btn-fill'> 
        <button onClick={() => setChangeColorFill("#1971c2")} className="color-btn blue fill" aria-label="Blue Fill"/>
        <button onClick={() => setChangeColorFill("#e03131")} className="color-btn red fill" aria-label="Red Fill"/>
        <button onClick={() => setChangeColorFill("#f08c00")} className="color-btn orange fill" aria-label="Orange Fill"/>
        <button onClick={() => setChangeColorFill("transparent")} className="color-btn transparent fill" aria-label="transparent Fill"/>

          <div className='relative-p'>
        - <input  type='color' className="color-btn picker" aria-label="picker Stroke" value={changeColorFill} style={{backgroundColor: changeColorFill}}  onChange={(e) => setChangeColorFill(e.target.value)}/> 
          </div>
         
        </div>
      </div>

      {/* Stroke Width */}
     <div>
  <h2 className="section-title">Stroke Width</h2>

  <input 
    type="range"
    min="1"
    max="10"
    value={changeStroke}
    onChange={(e) => setChangeStroke(Number(e.target.value))}
    className="horizontal-slider"
  />
</div>


      {/* Stroke Style */}
      <div>
        <h2 className="section-title">Stroke Style</h2>
        <div className="stroke-box">
          <button onClick={() => setChangeStrokeStyle([5, 5])} className="stroke-btn dashed" aria-label="Dashed"/>
        </div>
        <div className="stroke-box">
          <button onClick={() => setChangeStrokeStyle([1, 3])} className="stroke-btn dotted" aria-label="Dotted"/>
        </div>
      </div>

    <div>
  <h2 className="section-title">Modes</h2>
  <div className="mode-switcher">
    <button 
      className={`mode-btn ${theme === "light" ? "active" : ""}`} 
      onClick={handleCanvasColor}
    >
      Light
    </button>
    <button 
      className={`mode-btn ${theme === "dark" ? "active" : ""}`} 
      onClick={handleCanvasColor}
    >
      Dark
    </button>
  </div>
</div>


      {/* Canvas Color */}
      <div >
        <h2 className="section-title">Canvas Color</h2>
        {theme === "light" ? 
        <div
        className='canvas'>
        <button onClick={() => setChangeCanvasColor("white")} className="stroke-btn bg5" aria-label="Canvas Dark"/>
        <button onClick={() => setChangeCanvasColor("#f7fec6")} className="stroke-btn bg6" aria-label="Canvas Gray"/>
        <button onClick={() => setChangeCanvasColor("#fce2e2")} className="stroke-btn bg7" aria-label="Canvas Dark Gray"/>
        <button onClick={() => setChangeCanvasColor("#e2ffe5")} className="stroke-btn bg8" aria-label="Canvas Green"/>
          -<input  type='color' className="color-btn picker" aria-label="picker Stroke" value={changeCanvasColor} style={{backgroundColor: changeCanvasColor}}  onChange={(e) => setChangeCanvasColor(e.target.value)}/>
          {/* </div> */}
        </div> : 
        <div className='canvas'>
          <button onClick={() => setChangeCanvasColor("#121212")} className="stroke-btn bg1" aria-label="Canvas Dark"/>
        <button onClick={() => setChangeCanvasColor("#222")} className="stroke-btn bg2" aria-label="Canvas Gray"/>
        <button onClick={() => setChangeCanvasColor("#2e2e2e")} className="stroke-btn bg3" aria-label="Canvas Dark Gray"/>
        <button onClick={() => setChangeCanvasColor("#000b01")} className="stroke-btn bg4" aria-label="Canvas Green"/>
          -   <input  type='color' className="color-btn picker" aria-label="picker Stroke" value={changeCanvasColor} style={{backgroundColor: changeCanvasColor}}  onChange={(e) => setChangeCanvasColor(e.target.value)}/>

          </div>
          }
        
        
      </div>

      {/* Clear Canvas */}
      <div>
        <h2 className="section-title">Clear Canvas</h2>
        <button
        className='clear'
  onClick={() => clearCanvas() }
>
  Clear
</button>
      </div>
    </div>
  );
};

export default SideEditing;
