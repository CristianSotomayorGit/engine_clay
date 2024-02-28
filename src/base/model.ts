import * as THREE from "three";
import * as WEBIFC from "web-ifc";

export class Model {
  material = new THREE.MeshLambertMaterial();

  materialT = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0.2,
  });

  ifcAPI = new WEBIFC.IfcAPI();

  private _context?: WEBIFC.IFC4X3.IfcRepresentationContext;

  private _modelID?: number;

  get modelID() {
    if (this._modelID === undefined) {
      throw new Error("Model not initialized! Call the init() method.");
    }
    return this._modelID;
  }

  get context() {
    if (this._context === undefined) {
      throw new Error("Model not initialized! Call the init() method.");
    }
    return this._context;
  }

  async init() {
    await this.ifcAPI.Init();
    this._modelID = this.ifcAPI.CreateModel({ schema: WEBIFC.Schemas.IFC4X3 });
    this._context = new WEBIFC.IFC4X3.IfcRepresentationContext(
      new WEBIFC.IFC4X3.IfcLabel("Default"),
      new WEBIFC.IFC4X3.IfcLabel("Model")
    );
  }

  set(item: WEBIFC.IfcLineObject) {
    this.ifcAPI.WriteLine(this.modelID, item);
  }

  delete(item: WEBIFC.IfcLineObject) {
    this.ifcAPI.DeleteLine(this.modelID, item.expressID);
  }

  get<T extends WEBIFC.IfcLineObject>(item: WEBIFC.Handle<T> | T | null) {
    if (item === null) {
      throw new Error("Item not found!");
    }
    if (item instanceof WEBIFC.Handle) {
      return this.ifcAPI.GetLine(this.modelID, item.value) as T;
    }
    return item;
  }
}