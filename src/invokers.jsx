import { invoke } from '@tauri-apps/api';
import { base64StringToBlob, blobToDataURL } from 'blob-util';

/* 
Call = enum 
runLatex = 0
hasLatex = 1
write = 2
init = 3
parse = 4
calculate = 5
saveSvgAsPng = 6
getPngFromSvg = 7

CallObject = object 
case call : Call
of runLatex, saveSVGasPNG, write:
    content,target: string
of hasLatex:
    discard
of init:
    folder: string
of parse, calculate:
    argument: string
of getPngFromSvg:
    svgString: string 
*/


const enums = {
    runLatex: 0,
    hasLatex: 1,
    write : 2,
    init: 3,
    parse: 4,
    calculate:  5,
    saveSvgAsPng : 6,
    getPngFromSvg : 7
}


export const hasLatex = async() =>{
    let name = JSON.stringify({call: enums["hasLatex"]})
    return JSON.parse(await invoke("nim_caller", {name}));
}

export const runLatex = async(content, savePath) => {
    let name = JSON.stringify({call: enums["runLatex"], content: content, target: savePath});
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
    let name = JSON.stringify({call: enums["init"], folder: directory});
    console.log(name);
    const resp = await invoke("nim_caller", {name});
    return JSON.parse(resp);
}

export const runSympy = async (data) =>{
    console.log(data.mode)
    const name = JSON.stringify({call: enums[data.mode], argument: data.input_str});
    console.log(name)
    let resp = await invoke("nim_caller", {name});
    return JSON.parse(resp);
}

export const fileWriter = async(path, content)=> {
    const name = JSON.stringify({call: enums["write"], content: content, target: path});
    let resp = await invoke("nim_caller", {name});
    return JSON.parse(resp);
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
    const name = JSON.stringify({call: enums["getPngFromSvg"], svgString: content});
    let respParsed = JSON.parse(await invoke("nim_caller", {name}));
    let blob = null;
    if (respParsed.result){
        blob = base64StringToBlob(respParsed.base64, "image/png");
    }
    return blob;
}
