import { Barrack } from "./Barrack";
import { MapItem } from "./MapItem";

export class Truck {
  id?: number;
  availability?: boolean;
  matricule?: number;
  mapItem?: MapItem;
  barrack?: Barrack;
}