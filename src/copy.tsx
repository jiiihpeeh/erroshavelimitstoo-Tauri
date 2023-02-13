import {  notification, Status } from './notification'
import { writeText } from '@tauri-apps/api/clipboard';


export const copyToClipboard = async (content: string| null) => {
    try{
        if(content){
            await writeText(content);
        }
        
    }catch(err){
        console.log(err);
        notification("Failed to copy", "Couldn't copy text to your clipboard", Status.Error,5000);
    }
}

export const copyBlobToClipboard = async (blob: Blob| null)=> {
    try{
        if(blob){
            const data = [new ClipboardItem({ [blob.type]: blob })];
            await navigator.clipboard.write(data);
        }
    }catch(err){
        notification("Failed to copy", "No support for image to clipboard functionality. On linux install wl-clipboard or xclip depending on your display session", Status.Error,5000);
    }
}
