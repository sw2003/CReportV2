"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const path_1 = __importDefault(require("path"));
describe("GET /api/compute", () => {
    test("Basic endpoint test", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reportPath = path_1.default.join(__dirname, 'recap.xlsx');
            const dataPath = path_1.default.join(__dirname, 'data.xlsx');
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/compute')
                .attach('file1', reportPath)
                .attach('file2', dataPath);
            expect(response.statusCode).toBe(200);
        }
        catch (err) {
            console.log(err);
        }
    }));
    test("Concurrent second test", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reportPath = path_1.default.join(__dirname, 'recap.xlsx');
            const dataPath = path_1.default.join(__dirname, 'data.xlsx');
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/compute')
                .attach('file1', reportPath)
                .attach('file2', dataPath);
            expect(response.statusCode).toBe(200);
        }
        catch (err) {
            console.log(err);
        }
    }));
});
/*
describe("GET /api/compute mainLoop()", ()=>{
    test("mainLoop() returns success string on correct inputs", async ()=>{
        // file1 = Report
        // file2 = Data

        const file1Path: string = path.join(process.cwd(), `/uploads/recap.xlsx`);
        const file2Path: string = path.join(process.cwd(), `/uploads/data.xlsx`);

        const promise: Uint8Array = await mainLoop(file1Path, file2Path) as Uint8Array;
        expect(promise).toEqual("It works");
    })
    test("mainLoop() fails on wrong inputs", async ()=>{
        await expect(mainLoop('fa', 'foo'))
            .rejects
            .toThrow('Error in main loop')
    })
})

describe("getSubstring()", ()=>{
    test("getSubstring successfully returns an array containing string[] and number", ()=>{
        expect(getSubstring('CSCL BOHAI SEA 056')).toBeDefined();
    })
})

describe("getCurrentLine()", ()=>{
    test("Input: 'OPNW' ", ()=>{
        expect(getCurrentLine("OPNW", "CPNW")).toBe("OPNW");
    })
    test("Input: 'Not a shipping line' ", ()=>{
        expect(getCurrentLine("Not a shipping line", "CPNW")).toBe("CPNW");
    })
})

describe("nameCheck(arr: substringArray, length: number, name: string)", ()=>{
    test("Input: CSCL BOHAI SEA 056 -> true", ()=>{
        const name = 'CSCL BOHAI SEA 056';
        const [nameSubstringArr, substringArrLength] = getSubstring(name);
        expect(nameCheck(nameSubstringArr, substringArrLength, name)).toBe(true);
    })

    test("Input: CMA CGM CHRISTOPHE COLOMB 229 -> true", ()=>{
        const name = 'CMA CGM CHRISTOPHE COLOMB 229';
        const [nameSubstringArr, substringArrLength] = getSubstring(name);
        expect(nameCheck(nameSubstringArr, substringArrLength, name)).toBe(true);
    })

    test("Input: OOCL ST LAWERENCE 033 E -> true", ()=>{
        const name = 'OOCL ST LAWERENCE 033 E';
        const [nameSubstringArr, substringArrLength] = getSubstring(name);
        expect(nameCheck(nameSubstringArr, substringArrLength, name)).toBe(true);
    })

    test("Input: Blahhhh -> false", ()=>{
        const name = 'Blahhhh';
        const [nameSubstringArr, substringArrLength] = getSubstring(name);
        expect(nameCheck(nameSubstringArr, substringArrLength, name)).toBe(false);
    })
})

*/ 
