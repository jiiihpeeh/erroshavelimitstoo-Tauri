
import { save, confirm } from '@tauri-apps/api/dialog';
import { hasLatex, runLatex, fileExists } from './invokers';

export const runLaTeXCommand = async(content) => {
    const extension = "pdf"
    const latex = await hasLatex()
    console.log(latex)
    if (!latex.exists){
        return;
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
    return await runLatex(content,savePath);
}

export const saveEquationPng = async(content) => {
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
    return await saveSVGasPNG(savePath,content);
}

