// storage.ts
import type { ShapeInterface } from '../../type/shapes';

export class HistoryManager {
  private history: ShapeInterface[][] = [];
  private redoStack: ShapeInterface[][] = [];
  shapes: ShapeInterface[] = [];

  constructor(initialShapes: ShapeInterface[] = []) {
    // clone to be safe
    this.shapes = this.clone(initialShapes);
    this.history.push(this.clone(this.shapes)); // initial snapshot
  }

  private clone(arr: ShapeInterface[]) {
    return arr.map(s => ({ ...s }));
  }

  getHistory() {
    return this.history;
  }

  getRedoStack() {
    return this.redoStack;
  }

  getShapes() {
    return this.clone(this.shapes);
  }

  add(shapes: ShapeInterface[]) {
    const snapshot = this.clone(shapes);
    this.history.push(snapshot);
    this.redoStack = [];
    this.shapes = snapshot;
  }

  undo(): void {
    if (this.history.length <= 1) return; // keep at least initial state
    const lastState = this.history.pop()!;
    this.redoStack.push(this.clone(lastState));
    const prevState = this.history[this.history.length - 1];
    this.shapes = this.clone(prevState);
    console.log("press")
  }

  redo(): void {
    if (this.redoStack.length === 0) return;
    const state = this.redoStack.pop()!;
    this.history.push(this.clone(state));
    this.shapes = this.clone(state);
    console.log("press")

  }
}
