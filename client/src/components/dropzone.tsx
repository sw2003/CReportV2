import * as React from 'react';
import { useState, useRef } from 'react';

import { AiOutlineFileExcel } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri"

import { SetStateAction } from 'react';


interface formInfo {
    filename: string, 
    file: File 
}

type propType = {
    name: string
    checkFiles(e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>): Boolean
    setFormData1: React.Dispatch<SetStateAction<formInfo | {}>>;
    setFormData2: React.Dispatch<SetStateAction<formInfo | {}>>;
}

function Dropzone(props: propType) {
    const [isHover, setIsHover] = useState(false); 
    const [fileName, setFileName] = useState({filename: '', isEmpty: true});
    const [delMouseEnter, setDelMouseEnter] = useState(false); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileNameText = useRef<HTMLParagraphElement>(null);


    function dragEnter(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        e.stopPropagation();

        setIsHover(true); 
    }

    function dragLeave(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        e.stopPropagation();

        setIsHover(false); 
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        e.stopPropagation();

        setIsHover(false); 

        const fileInvalid: Boolean = props.checkFiles(e); 
        if (fileInvalid === true) return; 

        const fileList:FileList | null = e.dataTransfer.files; 
        const file = fileList?.[0];
        const fileName: string | undefined = file?.name; 

        if (typeof fileName === 'string') setFileName({filename: fileName, isEmpty: false});

        if (fileName !== undefined && file !== undefined){
            let formObj: formInfo = {filename: fileName, file: file}
            if (props.name === 'Drag & Drop ws1'){
                props.setFormData1(formObj); 
            }
            else if (props.name === 'Drag & Drop ws2'){
                props.setFormData2(formObj);
            }
        }
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault()
        e.stopPropagation();

        setIsHover(true); 
    }

    function handleClick(){
        fileInputRef.current?.click()      
    }

    function handleInputChange(e:React.ChangeEvent<HTMLInputElement>){
        e.stopPropagation();

        const fileInvalid: Boolean = props.checkFiles(e); 
        if (fileInvalid === true) return; 

        const fileList:FileList | null = e.target.files; 

        const file = fileList?.[0];

        const fileName: string | undefined = file?.name; 

        if (typeof fileName === 'string') setFileName({filename: fileName, isEmpty: false})

        if (fileName !== undefined && file !== undefined){
            let formObj: formInfo = {filename: fileName, file: file}
            if (props.name === 'Drag & Drop ws1'){
                props.setFormData1(formObj); 
            }
            else if (props.name === 'Drag & Drop ws2'){
                props.setFormData2(formObj);
            }
        }

        e.target.value = '';
    }

    function delBtnMouseEnter(){
        setDelMouseEnter(true);
    }

    function delBtnMouseLeave(){
        setDelMouseEnter(false); 
    } 

    function delBtnOnClick(){
        setIsHover(false); 
        setFileName({filename: '', isEmpty: true});
        setDelMouseEnter(false);

        if (props.name === 'Drag & Drop ws1'){
            props.setFormData1({}); 
        }
        else if (props.name === 'Drag & Drop ws2'){
            props.setFormData2({});
        }
    }

    return (
        <div onDragEnter={(e)=>dragEnter(e)} onDragLeave={(e)=>dragLeave(e)} onDragOver={handleDragOver} onDrop={(e)=>handleDrop(e)} className={`w-2/5 py-40 flex justify-center items-center rounded ${isHover? 'border-solid shadow-2xl':'border-dashed'} border-2 border-blue-500 bg-slate-100`}>
            <div className='flex flex-col justify-center items-center'>
                <AiOutlineFileExcel size={40}></AiOutlineFileExcel>
                <p className='mr-2 mt-2'>{props.name}</p>
                <p onClick={()=>handleClick()} className='mt-2 cursor-pointer text-sky-800'>Browse on your computer</p>
                <input onChange={(e)=>handleInputChange(e)} type="file" className='hidden' ref={fileInputRef}></input>
                {
                    !fileName.isEmpty && 
                    <div>
                        <p className={`mt-2 inline-block ease-out duration-500 transition-colors ${delMouseEnter ? 'line-through text-red-500': 'text-emerald-800'}`} ref={fileNameText}>{`${fileName.filename}`}</p>   
                        <RiDeleteBinLine className='inline-block mb-1 ml-1 cursor-pointer' onMouseEnter={()=>delBtnMouseEnter()} onMouseLeave={()=>delBtnMouseLeave()} onClick={()=>delBtnOnClick()} size={25}></RiDeleteBinLine>
                    </div>
                }
            </div>
        </div>
    )
}

export default Dropzone; 



