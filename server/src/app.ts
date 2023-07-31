import express, { Express } from "express"
import cors from "cors"

import compute from "./api/routes/compute"

export const app:Express = express()

app.use(cors()); 
app.use("/api", compute); 

export default app; 
