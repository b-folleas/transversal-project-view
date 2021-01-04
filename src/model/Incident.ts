import { Barrack } from "./Barrack";
import { EIncidentType } from "./EIncidentType";
import { MapItem } from "./MapItem";

export class Incident {
  id?: number;
  intensity?: number;
  mapItem?: MapItem;
  incidentType?: EIncidentType;
}