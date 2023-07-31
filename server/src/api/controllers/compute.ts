import express, { Request, Response } from "express"
import xlsxpopulate, { Workbook, Sheet } from "xlsx-populate"
import path from "path"
import xlsx from "xlsx"
import { start } from "repl"
import fs from "fs"


// Types / Interfaces
type substringArray = [string[], number];
type nameType = string | number | boolean | Date;

interface shipData {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
    F: string | undefined;
    G: number;
    H: number;
    I: number;
    J: number;
    K: number;
    L: number;
}

// Globals
const shippingKeywords: string[] = ['CPNW', 'CEN', 'MPNW', 'OPNW', 'MPNW', 'EPNW', 'AWE5', 'GEX1', 'GEX2']

// Returns finished report
export default async function compute(req: Request, res: Response) {
    const files: {
        [fieldname: string]: Express.Multer.File[];
    } | Express.Multer.File[] | undefined = req.files

    // Aserting files contains fields 'file1' and file2
    // file1 = Data
    // file2 = Report

    const file1Data: Express.Multer.File = (files as { [fieldname: string]: Express.Multer.File[] })['raw'][0];
    const file2Data: Express.Multer.File = (files as { [fieldname: string]: Express.Multer.File[] })['report'][0];

    const file1Path: string = path.join(process.cwd(), `/uploads/${file1Data.filename}`);
    const file2Path: string = path.join(process.cwd(), `/uploads/${file2Data.filename}`);


    try {
        const report = await mainLoop(file1Path, file2Path);

        /*
        const bufferData = Buffer.from(report);
        const filePath = './output.xlsx';
        fs.writeFileSync(filePath, bufferData);
        */ 

        res.attachment('output.xlsx');
        res.send(report); 
        res.status(200); 
    } catch (error) {
        console.log(error);
        res.status(404);
    }
}

// Iterates through both sheets collecting and aggregating data 
export async function mainLoop(file1Path: string, file2Path: string){
    try {
        // xlsx variables
        var workbook: xlsx.WorkBook = xlsx.readFile(file1Path);
        var sheet: xlsx.Sheet = workbook.Sheets['Data'];
        var arr: shipData[] = xlsx.utils.sheet_to_json(sheet, { header: 'A' });

        // xlsxpopulate variables
        const workbook_p: Workbook = await xlsxpopulate.fromFileAsync(file2Path);
        const sheet_p: Sheet = workbook_p.activeSheet();

        let startingIndex: number = 6;
        let currentLine: string = 'CPNW'

        let name: nameType | undefined = ''

        do {
            name = sheet_p.cell(`A${startingIndex}`).value();

            if (typeof name === "string" && name?.replace(/\s/g, "") === 'SUBTOTAL') {
                break;
            }

            if (name !== undefined && typeof name === "string" && filterNames(name)) {
                currentLine = getCurrentLine(name, currentLine);

                const fullName: string = getFullName(name, startingIndex, sheet_p, currentLine);
                innerLoop(arr, fullName, startingIndex, sheet_p); 
            }

            startingIndex++;
        } while (startingIndex < 120)

        fs.unlink(file1Path, (error)=>{});
        fs.unlink(file2Path, (error)=>{});   

        const report = workbook_p.outputAsync()  
        return report
    } catch (error) {
        throw new Error('Error in main loop')
    }
}

export function innerLoop(arr: shipData[], fullName: string, startingIndex: number, sheet: Sheet) {
    const columns: any[] = new Array(12).fill(0);


    for (let i = 1; i < arr.length; i++) {
        const data: shipData = arr[i];
        const bookingOfficeCode: string = data.A;
        const dataFileFullName: string = data.D.split(' ')[0];
        const pol: string = data.C;
        const eMedia: string = data?.F as string;


        if (fullName === dataFileFullName) {
            if (bookingOfficeCode === 'VAN') {
                if (!eMedia && pol === 'VAN') {
                    columns[1] += data.G
                    columns[2] += data.L
                }
                if (eMedia && pol === 'VAN') {
                    columns[10] += data.G
                    columns[11] += data.L
                }

                if (!eMedia && pol === 'PRR') {
                    columns[0] += data.G
                    columns[2] += data.L
                }
                if (eMedia && pol === 'PRR') {
                    columns[9] += data.G
                    columns[11] += data.L
                }

                if (!eMedia && pol === 'MTR') {
                    columns[1] += data.G
                    columns[2] += data.L
                }
                if (eMedia && pol === 'MTR') {
                    columns[10] += data.G
                    columns[11] += data.L
                }

                if (!eMedia && pol === 'HAL') {
                    columns[1] += data.G
                    columns[2] += data.L
                }
                if (eMedia && pol === 'HAL') {
                    columns[10] += data.G
                    columns[11] += data.L
                }

            }
            else if (bookingOfficeCode === 'MTR') {
                if (!eMedia && pol === 'VAN') {
                    columns[4] += data.G
                    columns[5] += data.L
                }

                if (eMedia && pol === 'VAN') {
                    columns[10] += data.G
                    columns[11] += data.L
                }

                if (!eMedia && pol === 'PRR') {
                    columns[3] += data.G
                    columns[5] += data.L
                }
                if (eMedia && pol === 'PRR') {
                    columns[9] += data.G
                    columns[11] += data.L
                }

                if (!eMedia && pol === 'MTR') {
                    columns[4] += data.G
                    columns[5] += data.L
                }

                if (eMedia && pol === 'MTR') {
                    columns[10] += data.G
                    columns[11] += data.L
                }

                if (!eMedia && pol === 'HAL') {
                    columns[4] += data.G
                    columns[5] += data.L
                }

                if (eMedia && pol === 'HAL') {
                    columns[10] += data.G
                    columns[11] += data.L
                }
            }
            else if (bookingOfficeCode === 'TOR') {
                if (!eMedia && pol === 'VAN') {
                    columns[7] += data.G
                    columns[8] += data.L
                }
                if (eMedia && pol === 'VAN') {
                    columns[10] += data.G
                    columns[11] += data.L
                }

                if (!eMedia && pol === 'PRR') {
                    columns[6] += data.G
                    columns[8] += data.L
                }
                if (eMedia && pol === 'PRR') {
                    columns[9] += data.G
                    columns[11] += data.L
                }

                if (!eMedia && pol === 'MTR') {
                    columns[7] += data.G
                    columns[8] += data.L
                }
                if (eMedia && pol === 'MTR') {
                    columns[10] += data.G
                    columns[11] += data.L
                }

                if (!eMedia && pol === 'HAL') {
                    columns[7] += data.G
                    columns[8] += data.L
                }
                if (eMedia && pol === 'HAL') {
                    columns[10] += data.G
                    columns[11] += data.L
                }
            }
        }
    }

    fillData(fullName, sheet, startingIndex, columns); 
}

// Filters / Error checks 
export function filterNames(name: string): Boolean {
    const [nameSubstringArr, substringArrLength] = getSubstring(name);

    if (nameCheck(nameSubstringArr, substringArrLength, name)) {
        return true;
    }
    return false;
}

// gets a string returns a substring array and the length 
export function getSubstring(name: string): substringArray {

    const nameSubstringArr: string[] = name.split(' ');
    const substringArrLength: number = nameSubstringArr.length;

    return [nameSubstringArr, substringArrLength];
}

//Updates the iterator on what shipping line its on. 
//For example opnw, epnw etc 
export function getCurrentLine(name: nameType, previousLine: string): string {
    if (typeof name === "string" && shippingKeywords.includes(name.replace(/\s/g, ""))) {
        return name;
    }

    return previousLine;
}

export function nameCheck(arr: string[], length: number, name: string): Boolean {
    return (Number(arr[length - 1]) || arr[length - 1] === 'E' || shippingKeywords.includes(name.replace(/\s/g, ""))) ? true : false;
}

export function getFullName(name: string, startingIndex: number, sheet: Sheet, currentLine: string): string {
    let num: string;

    const [nameSubstringArr, substringArrLength] = getSubstring(name);

    if (nameSubstringArr[substringArrLength - 1] === 'E') {
        num = nameSubstringArr[substringArrLength - 2];
    }
    else {
        num = nameSubstringArr[substringArrLength - 1];
    }

    const vesselCode: string = sheet.cell(`B${startingIndex}`).value() as string;
    let fullname: string = `${currentLine}-${vesselCode}-${num}`;
    fullname = fullname.replace(/\s/g, ""); 


    return fullname;
}

export function fillData(fullName: string, sheet: Sheet, startingIndex: number, columns: any[]){
    if (fullName.length > 12){
        return; 
    }

    const letterArr: string[] = ['L', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];

    for (let i = 0; i<letterArr.length; i++){
        const cellStyle = sheet.cell(`${letterArr[i]}${startingIndex}`).style('fill'); 
        if (cellStyle && Number(cellStyle.color.tint) < -0.05 && columns[i] === 0){
            columns[i] = null; 
        }
        sheet.cell(`${letterArr[i]}${startingIndex}`).value(columns[i])
    }
}
