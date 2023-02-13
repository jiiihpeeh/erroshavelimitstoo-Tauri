import React, { useEffect } from 'react';
import RunPython from './RunPython';
import { usePython, useCommunicate, useEquation } from './stores'
import { Command,  SymPyCall, Python } from "./type.d";

const Communicator = () => {
  const message = useCommunicate((state) => state.message);
  const setMessageValue = useCommunicate((state) => state.setValue)
  const equationSetResult = useEquation((state)=> state.setResult)
  const equationSetContent = useEquation((state)=> state.setContent)
  const initPython = usePython((state)=>state.init)
  const pythonMode = usePython((state)=> state.mode)
  const pythonSetReady = usePython((state)=> state.setReady)
  const pythonReady = usePython((state)=> state.ready)

  useEffect (() => {
    if(message.parseEquation !== null){
      setMessageValue(Command.Parse, null);
      let dataIn = {mode: SymPyCall.Parse, input_str: message.parseEquation} 
      RunPython(dataIn, equationSetContent, pythonMode)
    }
    if(message.processTable !== null) {
        let dataIn = {mode: SymPyCall.Calculate, input_str: JSON.stringify(message.processTable)} 
        setMessageValue(Command.Calculate, null);
        RunPython(dataIn, equationSetResult, pythonMode)
      }
  },[message, pythonReady])

  useEffect(()=>{
    const checker = async() =>{
      let dataIn = {input_str: "a=b/j+l**p", mode:  SymPyCall.Parse }
      RunPython(dataIn, pythonSetReady, pythonMode)
    }
    
    if( !pythonReady && pythonMode !== Python.None ){
      checker()
    }else if( !pythonReady && pythonMode === Python.None ){
      initPython()
    }
    
  },[pythonMode, pythonReady])

  return (<></>)
};
export default Communicator;