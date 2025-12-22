import '../style/undo.css'
type UndoProps = {
  undo: () => void;
  redo: () => void;
};

const Undo = ({ undo, redo }: UndoProps) => {
  return (
    <div className="bg">
      <button className="undo" onClick={() => undo()}>&larr;</button>
      <button className="undo" onClick={() => redo()}>&rarr;</button>
    </div>
  );
};

export default Undo;
