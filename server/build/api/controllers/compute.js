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
exports.fillData = exports.getFullName = exports.nameCheck = exports.getCurrentLine = exports.getSubstring = exports.filterNames = exports.innerLoop = exports.mainLoop = void 0;
const xlsx_populate_1 = __importDefault(require("xlsx-populate"));
const path_1 = __importDefault(require("path"));
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
// Globals
const shippingKeywords = ['CPNW', 'CEN', 'MPNW', 'OPNW', 'MPNW', 'EPNW', 'AWE5', 'GEX1', 'GEX2'];
// Returns finished report
function compute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = req.files;
        // Aserting files contains fields 'file1' and file2
        // file1 = Data
        // file2 = Report
        const file1Data = files['raw'][0];
        const file2Data = files['report'][0];
        const file1Path = path_1.default.join(process.cwd(), `/uploads/${file1Data.filename}`);
        const file2Path = path_1.default.join(process.cwd(), `/uploads/${file2Data.filename}`);
        try {
            const report = yield mainLoop(file1Path, file2Path);
            res.status(200).send(report);
            res.status(200);
        }
        catch (error) {
            console.log(error);
            fs_1.default.unlink(file1Path, (error) => { });
            fs_1.default.unlink(file2Path, (error) => { });
            res.status(500).json({ errorMessage: 'Bruh Chain' });
        }
    });
}
exports.default = compute;
// Iterates through both sheets collecting and aggregating data 
function mainLoop(file1Path, file2Path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // xlsx variables
            var workbook = xlsx_1.default.readFile(file1Path);
            var sheet = workbook.Sheets['Data'];
            var arr = xlsx_1.default.utils.sheet_to_json(sheet, { header: 'A' });
            // xlsxpopulate variables
            const workbook_p = yield xlsx_populate_1.default.fromFileAsync(file2Path);
            const sheet_p = workbook_p.activeSheet();
            let startingIndex = 6;
            let currentLine = 'CPNW';
            let name = '';
            let counter = 0;
            do {
                counter++;
                name = sheet_p.cell(`A${startingIndex}`).value();
                if (typeof name === "string" && (name === null || name === void 0 ? void 0 : name.replace(/\s/g, "")) === 'SUBTOTAL') {
                    break;
                }
                if (name !== undefined && typeof name === "string" && filterNames(name)) {
                    currentLine = getCurrentLine(name, currentLine);
                    const fullName = getFullName(name, startingIndex, sheet_p, currentLine);
                    innerLoop(arr, fullName, startingIndex, sheet_p);
                }
                startingIndex++;
            } while (startingIndex < 120);
            fs_1.default.unlink(file1Path, (error) => { });
            fs_1.default.unlink(file2Path, (error) => { });
            const report = workbook_p.outputAsync();
            return report;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.mainLoop = mainLoop;
function innerLoop(arr, fullName, startingIndex, sheet) {
    const columns = new Array(12).fill(0);
    for (let i = 1; i < arr.length; i++) {
        const data = arr[i];
        const bookingOfficeCode = data.B;
        const dataFileFullName = data.A.split(' ')[0];
        const pol = data.C;
        //const eMedia: string = data?.F as string;
        const eMedia = data === null || data === void 0 ? void 0 : data.D;
        if (fullName === dataFileFullName) {
            if (bookingOfficeCode === 'VAN') {
                if (!eMedia && pol === 'VAN') {
                    columns[1] += data.E;
                    columns[2] += data.F;
                }
                if (eMedia && pol === 'VAN') {
                    columns[10] += data.E;
                    columns[11] += data.F;
                }
                if (!eMedia && pol === 'PRR') {
                    columns[0] += data.E;
                    columns[2] += data.F;
                }
                if (eMedia && pol === 'PRR') {
                    columns[9] += data.E;
                    columns[11] += data.F;
                }
                if (!eMedia && pol === 'MTR') {
                    columns[1] += data.E;
                    columns[2] += data.F;
                }
                if (eMedia && pol === 'MTR') {
                    columns[10] += data.E;
                    columns[11] += data.F;
                }
                if (!eMedia && pol === 'HAL') {
                    columns[1] += data.E;
                    columns[2] += data.F;
                }
                if (eMedia && pol === 'HAL') {
                    columns[10] += data.E;
                    columns[11] += data.F;
                }
            }
            else if (bookingOfficeCode === 'MTR') {
                if (!eMedia && pol === 'VAN') {
                    columns[4] += data.E;
                    columns[5] += data.F;
                }
                if (eMedia && pol === 'VAN') {
                    columns[10] += data.E;
                    columns[11] += data.F;
                }
                if (!eMedia && pol === 'PRR') {
                    columns[3] += data.E;
                    columns[5] += data.F;
                }
                if (eMedia && pol === 'PRR') {
                    columns[9] += data.E;
                    columns[11] += data.F;
                }
                if (!eMedia && pol === 'MTR') {
                    columns[4] += data.E;
                    columns[5] += data.F;
                }
                if (eMedia && pol === 'MTR') {
                    columns[10] += data.E;
                    columns[11] += data.F;
                }
                if (!eMedia && pol === 'HAL') {
                    columns[4] += data.E;
                    columns[5] += data.F;
                }
                if (eMedia && pol === 'HAL') {
                    columns[10] += data.E;
                    columns[11] += data.F;
                }
            }
            else if (bookingOfficeCode === 'TOR') {
                if (!eMedia && pol === 'VAN') {
                    columns[7] += data.E;
                    columns[8] += data.F;
                }
                if (eMedia && pol === 'VAN') {
                    columns[10] += data.E;
                    columns[11] += data.F;
                }
                if (!eMedia && pol === 'PRR') {
                    columns[6] += data.E;
                    columns[8] += data.F;
                }
                if (eMedia && pol === 'PRR') {
                    columns[9] += data.E;
                    columns[11] += data.F;
                }
                if (!eMedia && pol === 'MTR') {
                    columns[7] += data.E;
                    columns[8] += data.F;
                }
                if (eMedia && pol === 'MTR') {
                    columns[10] += data.E;
                    columns[11] += data.F;
                }
                if (!eMedia && pol === 'HAL') {
                    columns[7] += data.E;
                    columns[8] += data.F;
                }
                if (eMedia && pol === 'HAL') {
                    columns[10] += data.E;
                    columns[11] += data.F;
                }
            }
        }
    }
    fillData(fullName, sheet, startingIndex, columns);
}
exports.innerLoop = innerLoop;
// Filters / Error checks 
function filterNames(name) {
    const [nameSubstringArr, substringArrLength] = getSubstring(name);
    if (nameCheck(nameSubstringArr, substringArrLength, name)) {
        return true;
    }
    return false;
}
exports.filterNames = filterNames;
// gets a string returns a substring array and the length 
function getSubstring(name) {
    const nameSubstringArr = name.split(' ');
    const substringArrLength = nameSubstringArr.length;
    return [nameSubstringArr, substringArrLength];
}
exports.getSubstring = getSubstring;
//Updates the iterator on what shipping line its on. 
//For example opnw, epnw etc 
function getCurrentLine(name, previousLine) {
    if (typeof name === "string" && shippingKeywords.includes(name.replace(/\s/g, ""))) {
        return name;
    }
    return previousLine;
}
exports.getCurrentLine = getCurrentLine;
function nameCheck(arr, length, name) {
    return (Number(arr[length - 1]) || arr[length - 1] === 'E' || shippingKeywords.includes(name.replace(/\s/g, ""))) ? true : false;
}
exports.nameCheck = nameCheck;
function getFullName(name, startingIndex, sheet, currentLine) {
    let num;
    const [nameSubstringArr, substringArrLength] = getSubstring(name);
    if (nameSubstringArr[substringArrLength - 1] === 'E') {
        num = nameSubstringArr[substringArrLength - 2];
    }
    else {
        num = nameSubstringArr[substringArrLength - 1];
    }
    const vesselCode = sheet.cell(`B${startingIndex}`).value();
    let fullname = `${currentLine}-${vesselCode}-${num}`;
    fullname = fullname.replace(/\s/g, "");
    return fullname;
}
exports.getFullName = getFullName;
function fillData(fullName, sheet, startingIndex, columns) {
    if (fullName.length > 12) {
        return;
    }
    const letterArr = ['L', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];
    try {
        for (let i = 0; i < letterArr.length; i++) {
            const cellStyle = sheet.cell(`${letterArr[i]}${startingIndex}`).style('fill');
            if (cellStyle && Number(cellStyle.color.tint) < -0.05 && columns[i] === 0) {
                columns[i] = null;
            }
            sheet.cell(`${letterArr[i]}${startingIndex}`).value(columns[i]);
        }
    }
    catch (error) {
    }
}
exports.fillData = fillData;
