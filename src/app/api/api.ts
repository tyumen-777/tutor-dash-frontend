import { APP_CONFIG } from "@/shared/model/app-config";
import axios from "axios";

export const api = axios.create({baseURL: APP_CONFIG.baseURL})

