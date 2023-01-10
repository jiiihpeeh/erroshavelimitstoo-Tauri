import { invoke } from '@tauri-apps/api';
import { base64StringToBlob, blobToDataURL } from 'blob-util';


export const hasLatex = async() =>{
    let name = JSON.stringify({call:"hasLatex"})
    return JSON.parse(await invoke("nim_caller", {name}));
}

export const runLatex = async(content, savePath) => {
    let argument = JSON.stringify({content: content, target: savePath})
    let name = JSON.stringify({call:"runLatex", argument: argument});
    let resp = await invoke("nim_caller", {name});
    switch(resp){
        case 'true':
            return true;
        case 'false':
            return true;
        default:
            return false;
    }
}

export const systemPython = async(directory) => {
    let name = JSON.stringify({call:"init", argument: directory});
    const resp = await invoke("nim_caller", {name});
    console.log(resp)
    switch(resp){
        case "true":
            return true;
        default:
            return false;
    }
}

export const runSympy = async (data) =>{
    const name = JSON.stringify({call: data.mode, argument: data.input_str});
    let resp = await invoke("nim_caller", {name});
    return JSON.parse(resp);
}

export const fileWriter = async(path, content)=> {
    let argument = JSON.stringify({content: content, target: path});
    const name = JSON.stringify({call: "write", argument: argument});
    let resp = await invoke("nim_caller", {name});
    switch(resp){
        case 'true':
            return true;
        default:
            return false;
    }
}
export const fileExists = async(name) => {
    return await invoke("file_exists", {name});
}

export const getEnv = async(name) => {
    return await invoke("get_env", {name});
}

export const getPath = async() =>{
    return (await getEnv("PATH")).split(':');
}

export const getPngFromSvg = async(content) => {
    let argument = JSON.stringify({content: content, target: ""});
    const name = JSON.stringify({call: "getPngFromSvg", argument: argument});
    let resp = await invoke("nim_caller", {name});
    //console.log(resp)
    switch(resp){
        case 'false':
            return null;
        default:
            let blob = base64StringToBlob(resp, "image/png");
            return blob //await  blobToDataURL(blob);
    }
}

