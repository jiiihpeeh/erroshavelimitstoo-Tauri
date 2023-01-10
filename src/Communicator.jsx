import { useEffect, useContext, useRef } from 'react';
import { CommunicatorContext } from './CommunicatorContext';
import { EquationContext } from './EquationContext';
import RunPython from './RunPython';
import sleep  from 'es7-sleep'

const Communicator = () => {
  //Public API that will echo messages sent to it back to the client
  const { python, communicate, setCommunicate, setIsReady, isReady } = useContext(CommunicatorContext);
  const {  setEquation, setEvaluated } = useContext(EquationContext);

  const getMsg = useRef(false);

  const getPython = useRef(false);
  const getPythonChecker = useRef(0);

  useEffect (() => {
  
    if(communicate.parseEquation !== null){
      setCommunicate({...communicate, parseEquation : null});
      let dataIn = {mode: "parse", input_str: communicate.parseEquation} 
      RunPython(dataIn, setEquation, python)
      getMsg.current = true;
    }
    if(communicate.processTable !== null) {
        //sendJsonMessage({query: 'calculate', calculate: communicate.processTable});
        
        let dataIn = {mode: "calculate", input_str: JSON.stringify(communicate.processTable)} 
        setCommunicate({...communicate, processTable : null});
        RunPython(dataIn, setEvaluated, python)
        
        getMsg.current = true;
    }

  },[communicate, python])

  // useEffect(() => {
  //   if (lastJsonMessage !== null &&  (getMsg.current || getSvg.current || getPdf.current) ) {
  //     //console.log(lastJsonMessage)
  //     switch(lastJsonMessage.message){
  //       case 'parsed':
  //         console.log(lastJsonMessage.equation);
  //         setEquation({...lastJsonMessage.equation});
  //         getMsg.current = false;
  //         break;
  //       case 'calculated':
  //         setEvaluated(lastJsonMessage.result);
  //         getMsg.current = false;
  //         break;
  //       case 'svg':
  //         setSvg(lastJsonMessage.svg);
  //         getSvg.current = false;
  //         break;
  //       case 'pdf':
  //         let pdfBlob = base64StringToBlob(lastJsonMessage.pdf, 'application/pdf')
  //         console.log(pdfBlob)
  //         download(pdfBlob, 'report.pdf', 'application/pdf')
  //         getPdf.current = false;
  //         break;
  //       default:
  //         break;

  //     }
  //   }
  // }, [lastJsonMessage, setEquation, setEvaluated, setSvg]);
  useEffect(()=>{

    const checker = async() =>{
      let dataIn = {input_str: "a=b/j+l**p", mode: "parse"}
      let counter = 0
      while(true){
        RunPython(dataIn, setIsReady, python)
        await sleep(1000)
        //console.log(getPython.current)
        if(getPython.current === true){
          break;
        }
        if(counter > 100){
          window.location.reload()
        }
        counter ++
      }
    }
    
    
    if((getPython.current === false) && (getPythonChecker.current === 0) && (python)){
      checker()
      getPythonChecker.current ++
    }

  },[python])
  useEffect(()=>{
    if(isReady !== false){
      getPython.current = true;
    }
  },[isReady])
};
export default Communicator;