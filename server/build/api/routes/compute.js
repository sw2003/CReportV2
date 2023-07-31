"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compute_1 = __importDefault(require("../controllers/compute"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
// unique id middleware
router.use((req, _, next) => {
    req.id = (0, uuid_1.v4)();
    next();
});
// form middleware setup
const storage = multer_1.default.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.id}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({ storage });
router.post('/compute', upload.fields([{ 'name': 'raw', maxCount: 1 }, { 'name': 'report', maxCount: 1 }]), compute_1.default);
exports.default = router;
