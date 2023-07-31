import * as XLSX from "xlsx";
import { SetStateAction } from 'react';


interface RawData {
    Origin:             string;
    "Vessel code":      string;
    POL:                string;
    "Booking Office":   string;
    "Bkg TEU":          number;
    Reefer:             number;
    "Booking (20' GP)": number;
    "Booking (40' GP)": number;
    "Booking (40' HQ)": number;
    "Booking (45')":    number;
}

interface BookingData {
    A:  string;
    B:  string;
    C:  number;
    D:  number;
    E:  number;
    F:  number;
    G:  number;
    H:  number;
    I:  number;
    J:  number;
    K:  string;
    L:  number;
    N:  number;
    P:  number;
    Q:  number;
    R:  number;
    S:  number;
    T:  number;
    U:  number;
    V:  number;
    W:  number;
    X:  number;
    Y:  number;
    Z:  number;
    AA: number;
    AB: number;
    AC: number;
    AD: number;
}


interface formInfo {
    filename: string, 
    file: File 
}

interface fileType{
    raw: Boolean 
    report: Boolean
}


export default async function checkFile(formData1: formInfo, formData2: formInfo, setError: React.Dispatch<SetStateAction<{ isError: boolean; message: string;}>> ){
    const data1 = await formData1.file.arrayBuffer();
    const data2 = await formData2.file.arrayBuffer();

    const workbook1 = XLSX.read(data1); 
    const workbook2 = XLSX.read(data2); 

    const ws1 = workbook1.Sheets[workbook1.SheetNames[0]];
    const ws2 = workbook2.Sheets[workbook2.SheetNames[0]];

    const jsonForm1: BookingData[] = XLSX.utils.sheet_to_json<BookingData>(ws1, {header: 'A'});
    const jsonForm2: BookingData[] = XLSX.utils.sheet_to_json<BookingData>(ws2, {header: 'A'});
    
    if (jsonForm1[0].A === 'Booking Office Code' && jsonForm2[0].A.replace(/\s/g, "") === 'CURRENTBOOKINGRECAP'){
        return {raw: 'file1'};
    }
    else if (jsonForm1[0].A.replace(/\s/g, "") === 'CURRENTBOOKINGRECAP' && jsonForm2[0].A === 'Booking Office Code'){
        return {raw: 'file2'}; 
    }
    else{
        setError({isError: true, message: 'xlsx files inputted do not have correct contents'});
        return {raw: 'none'}; 
    }   
}


