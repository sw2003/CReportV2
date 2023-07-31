import request, { Response } from "supertest" 
import app from "../app";
import fs from "fs"
import path from "path"
import { mainLoop, getSubstring, getCurrentLine, nameCheck } from "../api/controllers/compute"; 


describe("GET /api/compute", ()=>{
    test("Basic endpoint test", async () => {
        try {
            const reportPath: string = path.join(__dirname, 'recap.xlsx');
            const dataPath: string = path.join(__dirname, 'data.xlsx');

            const response: Response = await request(app)
                .post('/api/compute')
                .attach('file1', reportPath)
                .attach('file2', dataPath)

            expect(response.statusCode).toBe(200);   
          } catch (err) {
            console.log(err);
        }
    });

    test("Concurrent second test", async () => {
        try {
            const reportPath: string = path.join(__dirname, 'recap.xlsx');
            const dataPath: string = path.join(__dirname, 'data.xlsx');

            const response: Response = await request(app)
                .post('/api/compute')
                .attach('file1', reportPath)
                .attach('file2', dataPath)

            expect(response.statusCode).toBe(200);   
          } catch (err) {
            console.log(err);
        }
    });
})

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