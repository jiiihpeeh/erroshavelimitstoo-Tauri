import { invoke } from '@tauri-apps/api';
import { base64StringToBlob, blobToDataURL } from 'blob-util';

/* 
Call = enum 
    RunLatex = 0
    HasLatex = 1
    Write = 2
    Init = 3
    Parse = 4
    Calculate = 5
    SaveSvgAsPng = 6
    GetPngFromSvg = 7
    CopyPngToClipboard = 8
    ClipboardSupport = 9

CallObject = object 
    case call : Call
    of RunLatex, SaveSVGasPNG, Write:
        content,target: string
    of HasLatex, ClipboardSupport:
        discard
    of Init:
        folder: string
    of Parse,Calculate:
        argument : string
    of GetPngFromSvg,CopyPngToClipboard:
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
    getPngFromSvg : 7,
    copyPngToClipboard : 8,
    clipboardSupport :9
}

export const hasLatex = async() =>{
    let name = JSON.stringify({call: enums["hasLatex"]})
    return JSON.parse(await invoke("nim_caller", {name}));
}

export const runLatex = async(content, savePath) => {
    let name = JSON.stringify({call: enums["runLatex"], content: content, target: savePath});
    let resp = await invoke("nim_caller", {name});
    return JSON.parse(resp);
}

export const systemPython = async(directory) => {
    let appDirectory = directory;
    let name = JSON.stringify({call: enums["init"], folder: appDirectory});
    console.log(name)
    const resp = await invoke("nim_caller", {name});
    return JSON.parse(resp)
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
    return JSON.parse(resp)
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

export const copyPngToClipboard = async(content) => {
    const name = JSON.stringify({call: enums["copyPngToClipboard"], svgString: content});
    let resp = JSON.parse(await invoke("nim_caller", {name}));
    return resp;
}

export const clipboardPNGSupport = async() => {
    const name = JSON.stringify({call: enums["clipboardSupport"]});
    let resp = JSON.parse(await invoke("nim_caller", {name}));
    return resp;
}
