import http from "@/axios/axios";
import { Truck } from "@/model/Truck";
import { AxiosResponse } from "axios";

class TruckDataService {
  getAll(): Promise<AxiosResponse<Truck[]>> {
    return http.get<Truck[]>("/trucks");
  }
}

export default new TruckDataService();
