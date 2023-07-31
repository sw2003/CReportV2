import express, { Router, Express, Request, Response } from "express";
import compute from "../controllers/compute";
import multer, { StorageEngine, Multer } from "multer"
import { v4 as uuidv4 } from "uuid"

const router:Router = express.Router(); 


// unique id middleware
router.use((req: Request, _: Response, next)=>{
    req.id = uuidv4(); 

    next(); 
})

// form middleware setup
const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, res: Express.Multer.File, cb) =>{
        cb(null, 'uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, `${req.id}-${file.originalname}`);
    }
})

const upload: Multer = multer({ storage });

router.post('/compute', upload.fields([{'name': 'raw', maxCount: 1},{'name': 'report', maxCount: 1}]), compute); 

export default router; 