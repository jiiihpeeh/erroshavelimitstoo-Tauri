//import { pyRun } from './pyWorker/pyWorkerAPI'
import pyScript  from './runparser.py?raw'
import { runSympy } from './invokers';
import { Python } from './type.d';
import { pyWorkerModule } from './pyWorker/runPyWorker'


function isParsed(resp: Parsed | CalcResult | any): resp is Parsed {
  return (resp as Parsed).tex !== undefined;
}

const isCalcResult = (resp: Parsed | CalcResult| any): resp is CalcResult =>{
  return (resp as CalcResult).error !== undefined;
}

const isSetParsed = (resp: SetResult | SetParsed): resp is SetParsed =>{
  return (resp as SetParsed) !== undefined;
}

const isSetResult = (resp: SetResult | SetParsed): resp is SetResult =>{
  return (resp as SetResult) !== undefined;
}

const setResponse = ( resp: Parsed | CalcResult, setter: SetParsed | SetResult) => {
  if(isParsed(resp) && isSetParsed(setter) ){
    setter(resp)
  }else if (isCalcResult(resp) && isSetResult(setter)) {
    setter(resp)
  }
}

const RunPython = async(data : Data, setter: SetParsed | SetResult, pythonState: Python) =>{
  switch(pythonState){
  case Python.Wasm:
    let response =  await pyWorkerModule(pyScript, data) 
    setResponse(response, setter)
    break;
  case Python.System:
    let resp = await runSympy(data)
    setResponse(resp, setter)
    break;
  default:
    break;
  }
} 

export default RunPython;
