import { askGemini } from "../services/gemini";
import { Canvas } from "../classes/drawing/canvas";
// import { addShape } from "../helper/addShapes";
import type { ShapeInterface } from "../type/shapes";
import { useState } from "react";
import { Helper } from "../classes/Helper/helper";
import '../style/ai.css'

interface AIHelperProps {
    canvasInstance: Canvas | null;
     setShapeCreated:  React.Dispatch<React.SetStateAction<number>>;
      bgColor: string;


}


function AIHelper({canvasInstance, setShapeCreated, bgColor}: AIHelperProps) {
  const [loading, setLoading] = useState(false)
  const [textBox, setTextBox] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState("")
  const [AIactive, setAIactive] = useState(false)
  const handleAI = async () => {

    // const input = prompt("Ask AI (e.g. 'draw a circle and a rectangle connected by a line'):");
    if (!prompt) return setError("Kindly give some prompt");
setLoading(true)
setError("")
const response = await askGemini(`
  You are an AI that generates structured **UML Class Diagrams** only.
    Your job is to output ONLY JSON describing shapes and their positions.

  ====================
  ⚠️ Instructions for Analysis
  ====================
  Before generating any JSON, carefully analyze the user's request to identify all key components for the UML diagram.
  - **Identify Classes:** Extract all main entities that can be represented as classes.
  - **Identify Attributes:** For each class, list its properties or data members. Prefix private attributes with '+' and public attributes with '+'.
  - **Identify Methods:** For each class, list its behaviors or functions. Prefix private methods with '-' and public methods with '+'.
  -  **Identify Relationships:** Determine if there are inheritance or association relationships between the classes.

====================
📌 General Rules
====================
1. Use only these shapes: ["rectangle", "line", "text"].
2. Shapes must NEVER overlap. Keep at least 120px spacing horizontally and vertically.
3. Always center diagrams around (400,300).
4. Do not generate random positions — arrange neatly in rows/columns depending on hierarchy.
5. Output must be a JSON array ONLY — no free text, no explanations.
6. For attributes and methods and class name. create in individial text object instead pushing everything in one object.

====================
📌 UML-Specific Rules
====================
- UML Class Diagrams:
  * Classes must be represented as **rectangles**.
  * Each rectangle MUST include:
    - First line = Class name (centered, bold).
    - A separator line below the class name.
    - Attributes listed line by line (prefixed with "-" for private, "+" for public).
    - A separator line between attributes and methods.
    - Methods listed line by line (with parentheses).
  * Example text format inside rectangle:
    "Car\\n----------------\\n- brand: string\\n- speed: int\\n----------------\\n+ drive()\\n+ brake()"
  * Parent classes must be placed **above** child classes.
  * Connect parent → child with straight vertical **lines**.
  * Associations between classes are **lines** with optional labels (text objects).
  * DO NOT use circles or diamonds (only rectangles + lines).

====================
📌 Supported Shape Schemas
====================
1. Rectangle:
{ "type": "rectangle", "x": <number>, "y": <number>, "width": <number>, "height": <number>, "stroke": "<color>", "fill": "<color>"}

2. Line:
{ "type": "line", "x1": <number>, "y1": <number>, "x2": <number>, "y2": <number>, "stroke": "<color>" }

3. Text:
{ "type": "text", "text": "<string>", "x": <number>, "y": <number>, "width": <number>, "height": <number>, "textColor": "<color>" }

====================
⚠️ Final Output
====================
- Must be ONLY a valid JSON array.
- Must strictly follow UML class diagram rules.
- Must format text INSIDE rectangles so class name, attributes, and methods are clearly separated by lines.
- Do NOT mix with flowcharts, organizational charts, or system diagrams.

User: ${prompt}`);

setLoading(false)





  // setLoading(true) 
    try {
      const jsonMatch = response.match(/\[.*?\]/s);

      if (jsonMatch && jsonMatch[0]) {
        const shapes = JSON.parse(jsonMatch[0]);

        const supported = ["circle", "rectangle", "line", "diamond", "text"];
        shapes
          .filter((s: ShapeInterface) => supported.includes(s.type))
          .forEach((s: ShapeInterface) => Helper.addShape(s, canvasInstance, setShapeCreated));
          // console.log(shapes)
      } else {
        throw new Error("No valid JSON array found in the response.");
      }

    } catch (e) {
      console.error("AI parsing error:", e, "Raw response:", response);
      setError("Failed to parse AI response. Try again.");
    } 
  };

  return (
 <>
  <div className="ai-container">
    {/* Toggle AI Input */}
    <button style={{backgroundColor: AIactive  ? bgColor: undefined}} onClick={() => {setTextBox(prev => !prev); setError(""); setAIactive(!AIactive)}} className="ai-button">
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="17" height="17" viewBox="0 0 48 48">
<path fill="#2196f3" d="M23.426,31.911l-1.719,3.936c-0.661,1.513-2.754,1.513-3.415,0l-1.719-3.936	c-1.529-3.503-4.282-6.291-7.716-7.815l-4.73-2.1c-1.504-0.668-1.504-2.855,0-3.523l4.583-2.034	c3.522-1.563,6.324-4.455,7.827-8.077l1.741-4.195c0.646-1.557,2.797-1.557,3.443,0l1.741,4.195	c1.503,3.622,4.305,6.514,7.827,8.077l4.583,2.034c1.504,0.668,1.504,2.855,0,3.523l-4.73,2.1	C27.708,25.62,24.955,28.409,23.426,31.911z"></path><path fill="#7e57c2" d="M38.423,43.248l-0.493,1.131c-0.361,0.828-1.507,0.828-1.868,0l-0.493-1.131	c-0.879-2.016-2.464-3.621-4.44-4.5l-1.52-0.675c-0.822-0.365-0.822-1.56,0-1.925l1.435-0.638c2.027-0.901,3.64-2.565,4.504-4.65	l0.507-1.222c0.353-0.852,1.531-0.852,1.884,0l0.507,1.222c0.864,2.085,2.477,3.749,4.504,4.65l1.435,0.638	c0.822,0.365,0.822,1.56,0,1.925l-1.52,0.675C40.887,39.627,39.303,41.232,38.423,43.248z"></path>
</svg>
    </button>

    {/* Input Popup */} 
    {textBox && (
      <div className="ai-popup">
        <input
          type="text"
          placeholder="Type your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={handleAI} className="generate-btn">
          Generate
        </button>
      </div>
    )}

    {/* Loading Text */}
    {loading && (
      <span className="loading-text">Generating... Please wait</span>
    )}
    {error && <span className="error-text">{error}</span>}
  </div>
</>


);

}

// tweakcn
// motion-primitives

export default AIHelper;
