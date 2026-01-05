import { APP_CONFIG } from "@/shared/model";
import axios from "axios";

export const api = axios.create({baseURL: APP_CONFIG.baseURL})

