import type { Drawable } from "../../type/drawable";
import type { ShapeInterface } from "../../type/shapes";

const STORAGE_KEY = "canvas_shapes";

export class ShapesStorage {
  shapes: ShapeInterface[] = [];
private static instance: ShapesStorage;

  
  static getInstance() {
    if (!ShapesStorage.instance) {
      ShapesStorage.instance = new ShapesStorage();
    }
    return ShapesStorage.instance;
  }

  add(shape: ShapeInterface) {
    this.shapes.push(shape);
    this.saveToLocal(); 
  }

  remove(id: number) {
    this.shapes = this.shapes.filter(s => s.id !== id);
    this.saveToLocal();
  }

  updateShape(id: number, newShape: Drawable) {
    const index = this.shapes.findIndex(s => s.id === id);
    if (index !== -1) {
      this.shapes[index].shape = newShape; 
      this.saveToLocal();
    }
  }
 
  getShape(id: number) {
    return this.shapes.find(s => s.id === id) || null;
  }

  getAllShapes() {
    return [...this.shapes]; // return copy
  }

  clear() {
    this.shapes = [];
    this.saveToLocal();
  }

  /** 🔹 Save to localStorage */
  saveToLocal() {
    // shapes must be serialized (plain objects, no class methods)
    const plain = this.shapes.map(s => ({
      id: s.id,
      type: s.type,
      shape: { ...s.shape }, // shape properties only
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  }

  /** 🔹 Load from localStorage */
  loadFromLocal(factoryMap: Record<string, (data: any) => Drawable>) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      this.shapes = parsed.map((s: ShapeInterface) => ({
        id: s.id,
        type: s.type,
        shape: factoryMap[s.type](s.shape), // rebuild class instance
      }));
        // console.log(this.shapes)

    } catch (e) {
      console.error("Failed to load shapes from storage", e);
    }
  }
}
