import http from "@/axios/axios";
import { MapItem } from "../model/MapItem";
import { AxiosResponse } from "axios";

class MapItemsDataService {
  getAll(): Promise<AxiosResponse<MapItem[]>> {
    return http.get<MapItem[]>("/mapItems");
  }
}

export default new MapItemsDataService();
