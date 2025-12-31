import type { Canvas } from '../classes/drawing/canvas';
import '../style/toolbar.css';
import AIHelper from './Ai';
import { useState } from 'react';


interface ToolBarProps {
  setButtonTool: (tool: string) => void;
  canvasInstance: Canvas | null;
  setShapeCreated: React.Dispatch<React.SetStateAction<number>>;
  setlock: (lock: string) => void;
  lock: string;
  buttonTool: string;
}   

const ToolBar= ({setButtonTool, canvasInstance, setShapeCreated, setlock, lock, buttonTool}: ToolBarProps) => {
  // console.log(canvasInstance)
  const [bgColor, setBgColor] = useState('');
  const [active, setActive] = useState(false)


  const changeBackgroundColor = () => {
    // setActive(false)
    if (lock === "Unlock" || lock === "Lock") {
    if (active === false && buttonTool === 'Select') {
      setActive(true)
      setBgColor('gray')
    } else if (active === false && buttonTool === 'Hand') {
      setActive(false)
      // setBgColor('gray')
    }
    }
  }

  return (
    <div className="toolbar">

      { lock === "Unlock" ? (
        <div>
      <button onClick={() => {setlock('Lock'); changeBackgroundColor();}} className="toolbar-button lock">
         <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-lock-open"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M8 11v-5a4 4 0 0 1 8 0" /></svg>
        </button>
        </div>
      ):(
        <div>
          <button  style={{backgroundColor: active ? bgColor: undefined}} onClick={() => {setlock('Unlock'); setActive(false); }} className="toolbar-button lock">
        

         <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="20"  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-lock"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3v-3a5 5 0 0 1 5 -5m0 12a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m0 -10a3 3 0 0 0 -3 3v3h6v-3a3 3 0 0 0 -3 -3" /></svg>
        </button>
        </div>
      )}
      
      <button style={{backgroundColor: active && buttonTool ==='Select' ? bgColor: undefined}} onClick={() => {setButtonTool('Select'); changeBackgroundColor();}} className="toolbar-button select">
         <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"    strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-pointer"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7.904 17.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l4.907 4.907a1.067 1.067 0 0 0 1.509 0l1.047 -1.047a1.067 1.067 0 0 0 0 -1.509l-4.907 -4.907l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563z" /></svg>
        </button>
         <button  style={{backgroundColor: active && buttonTool ==='Hand' ? bgColor: undefined}}  onClick={() => {setButtonTool('Hand'); changeBackgroundColor();}} className="toolbar-button">
          <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-hand-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5" /><path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5" /><path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5" /><path d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" /></svg>
        </button>
        <button style={{backgroundColor: active && buttonTool ==='Rectangle' ? bgColor: undefined}} onClick={() => {setButtonTool('Rectangle'); changeBackgroundColor();}} className="toolbar-button">
          <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-rectangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /></svg>
        </button>
        <button style={{backgroundColor: active && buttonTool ==='Circle' ? bgColor: undefined}} onClick={() => {setButtonTool('Circle'); changeBackgroundColor();}} className="toolbar-button">
          <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /></svg>
        </button>
        <button style={{backgroundColor: active && buttonTool ==='Diamond' ? bgColor: undefined}} onClick={() => {setButtonTool('Diamond'); changeBackgroundColor();}} className="toolbar-button">
          <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-diamonds"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.831 20.413l-5.375 -6.91c-.608 -.783 -.608 -2.223 0 -3l5.375 -6.911a1.457 1.457 0 0 1 2.338 0l5.375 6.91c.608 .783 .608 2.223 0 3l-5.375 6.911a1.457 1.457 0 0 1 -2.338 0z" /></svg>
        </button>
        <button style={{backgroundColor: active && buttonTool ==='Line' ? bgColor: undefined}} onClick={() => {setButtonTool('Line'); changeBackgroundColor();}} className="toolbar-button">
          <svg height="20" width="15" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" />
          </svg>

          
        </button>
         <button style={{backgroundColor: active && buttonTool ==='Draw' ? bgColor: undefined}} onClick={() => {setButtonTool('Draw'); changeBackgroundColor();}} className="toolbar-button">
          <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
        </button>
        <button style={{backgroundColor: active && buttonTool ==='Text' ? bgColor: undefined, fontSize:"15px"}}  onClick={() => {setButtonTool('Text'); changeBackgroundColor();}} className="toolbar-button">
         <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-letter-case"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17.5 15.5m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" /><path d="M3 19v-10.5a3.5 3.5 0 0 1 7 0v10.5" /><path d="M3 13h7" /><path d="M21 12v7" /></svg>
        </button>
        <button style={{backgroundColor: active && buttonTool ==='Eraser' ? bgColor: undefined}} onClick={() => {setButtonTool('Eraser'); changeBackgroundColor();}} className="toolbar-button">
          <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="1.5"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-eraser"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" /><path d="M18 13.3l-6.3 -6.3" /></svg>
        </button>

        <AIHelper setShapeCreated={setShapeCreated} canvasInstance={canvasInstance} bgColor={bgColor} />
    </div>
  )
}

export default  ToolBar
