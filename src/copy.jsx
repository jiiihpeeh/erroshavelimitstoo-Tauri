import {  notification } from './notification'
import { writeText, readText } from '@tauri-apps/api/clipboard';


export const copyToClipboard = async (content) => {
    try{
        console.log("COPY ")
        //await navigator.clipboard.writeText(content);
        await writeText(content);
    }catch(err){
        console.log(err);
        notification("Failed to copy", "Couldn't copy text to your clipboard", "error",5000);
    }
}

export const copyBlobToClipboard = async (blob)=> {
    console.log(blob);
    try{
        const data = [new ClipboardItem({ [blob.type]: blob })];
        await navigator.clipboard.write(data);
    }catch(err){
        console.log(err);
        notification("Failed to copy", "No support for image to clipboard functionality", "error",5000);
    }
}
