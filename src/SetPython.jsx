import { useContext, useRef, useEffect} from "react";
import { appLocalDataDir } from '@tauri-apps/api/path';
import { notification } from "./notification";
import { CommunicatorContext } from "./CommunicatorContext";
import { systemPython } from "./invokers";

const SetPython = () => {
    const { python, setPython} = useContext(CommunicatorContext);
    const pythonChecker = useRef(false);
    useEffect(() => {
      const loadPython = async()=>{
        const dataDir = await appLocalDataDir();
        const resp = await systemPython(dataDir);
        console.log('path ', dataDir)
        if(resp){
            setPython('system');
        }else{
            setPython('wasm');
            notification("Python Support", "By installing Python and SymPy into your system this app should load faster and use less memory. Switching to WASM. This might take few seconds...","info",7000)
        }
      }
      if(!pythonChecker.current){
            loadPython();
            pythonChecker.current = true;
      }
    },[])
}

export default SetPython;