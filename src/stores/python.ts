import { create } from 'zustand'
import { appDataDir } from '@tauri-apps/api/path';
import { notification, Status } from "../notification";
import { systemPython, setAppDir } from "../invokers";
import { Python } from '../type.d'


type UsePython = {
    mode : Python,
    ready: boolean,
    scriptDirectory: string,
    system: boolean,
    init: () => void,
    setMode : (newState: Python) => void,
    setReady: (arg:any) => void
    togglePython: () => void
}


const setDir = async() =>{
    const dataDir =  await appDataDir();
    const appDirSet  = await setAppDir(dataDir)
    return {directory: dataDir, appDirSet: appDirSet}
}

var notificationOnce = false;
const initPython = async(dirSet: boolean): Promise<Python> =>{
    let py = localStorage["python"] as Python
    if((!py || py === Python.System) && dirSet){
        let sysSupport = await systemPython()
        if(sysSupport){
            return Python.System
        }
    }
    if(!notificationOnce){
        notification(
                    "Python Support", 
                    "By installing Python and SymPy into your system this app should load faster and use less memory. Switching to WASM. This might take few seconds...",
                    Status.Info, 
                    7000
        )
        notificationOnce = true
    }
    return Python.Wasm
}


const toggleMode =  (status: Python, state: boolean, system: boolean) => {
    if(state && status !== Python.None){
        switch(status){
            case Python.Wasm:
                if(system){
                    return Python.System;
                }
                return Python.Wasm
            case Python.System:
                notification("WASM", "Loading WASM", Status.Info)
                return Python.Wasm;
            default:
                return Python.None;
        }
    }else{
        if(!state && status === Python.Wasm){
            return Python.System
        }
        return status
    }
}

const setPythonLocalStorage = (m: Python, arg:any): boolean => { 
    if(arg){
        localStorage.setItem("python", m)
        notification("Ready", "Python initialized")
        return true
    }
    return false
} 

const usePython = create<UsePython>((set) => ({
    mode: Python.None,
    ready: false,
    scriptDirectory: "",
    system: false,
    init: async () => {
        let scriptDir = await setDir();
        set(
            {
                mode: await initPython(scriptDir.appDirSet),
                scriptDirectory: scriptDir.directory
            }
        )
    },
    setMode: (newState) =>  
        set(
            {
                mode : newState
            }
        ) ,
    setReady: (arg) => set(
        state => (
            {
                ready: setPythonLocalStorage(state.mode, arg)
            }
        )
    ),
    togglePython: async () => {
        let system = await systemPython();
        set( 
            state => (
                        {
                            ready: false, 
                            mode:  toggleMode(state.mode, state.ready, system),
                            system: system,
                        }
                )
            )
        },
    }
))


export default usePython 