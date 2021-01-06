import http from "@/axios/axios";
import { MapItem } from "../model/MapItem";
import { AxiosResponse } from "axios";
import { Incident } from "../model/Incident";
import { Barrack } from "../model/Barrack";

class BarracksDataService {
  getAll(): Promise<AxiosResponse<Barrack[]>> {
    return http.get<Barrack[]>("/barracks");
  }
}

export default new BarracksDataService();
