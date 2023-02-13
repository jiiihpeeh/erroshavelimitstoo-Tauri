import { invoke } from '@tauri-apps/api';
import { base64StringToBlob } from 'blob-util';

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
        SetAppDir = 10
        NotValid = 11

    CallObject = object 
        case call : Call
        of RunLatex, SaveSVGasPNG, Write, NotValid:
            content,target: string
        of HasLatex, ClipboardSupport, Init:
            discard
        of Parse,Calculate:
            argument : string
        of GetPngFromSvg,CopyPngToClipboard:
            svgString: string
        of SetAppDir:
            directory: string
*/

enum CallObject  {
    RunLatex=0,
    HasLatex,
    Write,
    Init,
    Parse,
    Calculate,
    SaveSvgAsPng ,
    GetPngFromSvg,
    CopyPngToClipboard,
    ClipboardSupport,
    SetAppDir
}


type RunPython = {
    mode: string,
    input_str : string
}

type LaTeXPath = {
    exists: boolean,
    path : string,
} 

export const hasLatex = async() : Promise<LaTeXPath> => {
    let name = JSON.stringify({call: CallObject.HasLatex})
    return JSON.parse(await invoke("nim_caller", {name})) as LaTeXPath;
}

export const runLatex = async(content:string, savePath:string): Promise<boolean> => {
    let name = JSON.stringify({call: CallObject.RunLatex, content: content, target: savePath});
    return JSON.parse(await invoke("nim_caller", {name}))  as boolean;
}

export const systemPython = async(): Promise<boolean> => {
    let name = JSON.stringify({ call: CallObject.Init });
    return JSON.parse(await invoke("nim_caller", {name})) as boolean
}

export const runSympy = async (data: RunPython ): Promise<Parsed|CalcResult> =>{
    let call : CallObject.Parse| CallObject.Calculate
    switch (data.mode){
        case "parse":
            call = CallObject.Parse
            break;
        default:
            call = CallObject.Calculate
            break;
    }
    const name = JSON.stringify({call: call, argument: data.input_str});
    let resp : string = await invoke("nim_caller", {name});
    return JSON.parse(resp) as Parsed|CalcResult;
}

export const fileWriter = async(path: string, content:string): Promise<boolean>=> {
    const name = JSON.stringify({call: CallObject.Write, content: content, target: path});
    return JSON.parse( await invoke("nim_caller", {name})) as boolean
}

export const fileExists = async(name : string): Promise<boolean> => {
    return await invoke("file_exists", {name});
}

export const getEnv = async(name : string): Promise<string> => {
    return await invoke("get_env", {name});
}

export const getPath = async(): Promise<Array<string>> =>{
    return (await getEnv("PATH")).split(':');
}

export const getPngFromSvg = async(content:string): Promise<Blob|null> => {
    const name = JSON.stringify({call: CallObject.GetPngFromSvg, svgString: content});
    let respParsed = JSON.parse(await invoke("nim_caller", {name}));
    let blob : Blob|null = null;
    if (respParsed.result){
        blob = base64StringToBlob(respParsed.base64, "image/png");
    }
    return blob;
}

export const copyPngToClipboard = async(content: string): Promise<boolean> => {
    const name = JSON.stringify({call: CallObject.CopyPngToClipboard, svgString: content});
    return JSON.parse(await invoke("nim_caller", {name})) as boolean;
}

export const clipboardPNGSupport = async(): Promise<boolean> => {
    const name = JSON.stringify({call: CallObject.ClipboardSupport});
    return JSON.parse(await invoke("nim_caller", {name})) as boolean;
}

export const saveSvgAsPng = async (content: string, target: string): Promise<boolean> => {
    const name = JSON.stringify({call: CallObject.SaveSvgAsPng, content: content, target: target});
    return JSON.parse(await invoke("nim_caller", {name})) as boolean;
}

export const setAppDir = async (directory: string): Promise<boolean> => {
    const name = JSON.stringify({call: CallObject.SetAppDir , directory: directory});
    return JSON.parse(await invoke("nim_caller", {name})) as boolean;
}