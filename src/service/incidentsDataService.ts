import http from "@/axios/axios";
import { MapItem } from "../model/MapItem";
import { AxiosResponse } from "axios";
import { Incident } from "../model/Incident";

class IncidentsDataService {
  getAll(): Promise<AxiosResponse<Incident[]>> {
    return http.get<Incident[]>("/incidents");
  }
}

export default new IncidentsDataService();
