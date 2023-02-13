import { save, confirm } from '@tauri-apps/api/dialog';
import { fileWriter, fileExists } from './invokers';

const SaveTextFile = async (fileInfo:string|null, extensions: Array<string>, name: string): Promise<boolean> => {
    if(!fileInfo){
        return false
    }
    let savePath = await save({
        filters: [{
          name: name,
          extensions: extensions
        }]
    });
    if(!savePath){
        return false
    }
    let  useExtension =  extensions[0]
    const savePathCheck = (savePath.endsWith(`.${useExtension}`))? savePath : `${savePath}.${useExtension}`;
    if((savePathCheck !== savePath) && (await fileExists(savePathCheck))){
        const resp = await confirm("Do you want to overwrite the file?");
        if (!resp){
            return false
        }
        savePath = savePathCheck;
    }
    return await fileWriter(savePath, fileInfo)
}

export default SaveTextFile;