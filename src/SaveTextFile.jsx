import { save, confirm } from '@tauri-apps/api/dialog';
import { fileWriter, fileExists } from './invokers';

const SaveTextFile = async (fileInfo, extensions, name) => {
    let savePath = await save({
        filters: [{
          name: name,
          extensions: extensions
        }]
    });
    if(!savePath){
        return
    }
    const savePathCheck = (savePath.endsWith(`.${extensions}`))? savePath : `${savePath}.${extensions}`;
    if((savePathCheck !== savePath) && (await fileExists(savePathCheck))){
        const resp = await confirm("Do you want to overwrite the file?");
        if (!resp){
            return;
        }
        savePath = savePathCheck;
    }
    let resp = await fileWriter(savePath, fileInfo)
    return resp;
}

export default SaveTextFile;