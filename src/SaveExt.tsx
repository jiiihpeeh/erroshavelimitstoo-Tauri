import { save, confirm } from '@tauri-apps/api/dialog';
import { hasLatex, runLatex, fileExists, saveSvgAsPng } from './invokers';
import { notification, Status } from './notification';
import { useRemoteTeX } from './stores';

export const runLaTeXCommand = async(content:string|null) => {
    const remoteTeX = useRemoteTeX.getState().remoteFetch
    if(!content){
        return
    }
    const extension = "pdf"
    const latex = await hasLatex()
    
    if ((!latex.exists) && (!remoteTeX)){
        const resp = await confirm("Can not find local LaTeX installation. Do you want to render PDF remotely?");
        if(!resp){
            return;
        }
    }
    let savePath = await save({
        filters: [{
          name: 'PDF',
          extensions: [extension]
        }]
    });
    if(!savePath){
        return;
    }

    const savePathCheck = (savePath.endsWith(`.${extension}`))? savePath : `${savePath}.${extension}`;
    if((savePathCheck !== savePath) && (await fileExists(savePathCheck))){
        const resp = await confirm("Do you want to overwrite the file?");
        if (!resp){
            return;
        }
        savePath = savePathCheck;
    }
    let laTexResp = await runLatex(content,savePath);
    if(laTexResp){
        notification("Saved",`Successfully saved PDF: ${savePath}`)
    }else{
        notification("Failed",`Failed to save PDF`, Status.Error)
    }
    return laTexResp
}

export const saveEquationPng = async(content: string) => {
    const extension = "png"

    let savePath = await save({
        filters: [{
          name: 'PNG',
          extensions: [extension]
        }]
    });
    if(!savePath){
        return;
    }

    const savePathCheck = (savePath.endsWith(`.${extension}`))? savePath : `${savePath}.${extension}`;
    if((savePathCheck !== savePath) && (await fileExists(savePathCheck))){
        const resp = await confirm("Do you want to overwrite the file?");
        if (!resp){
            return;
        }
        savePath = savePathCheck;
    }
    return await saveSvgAsPng(savePath,content);
}

