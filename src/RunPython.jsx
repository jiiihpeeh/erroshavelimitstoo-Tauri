//import { pyRun } from './pyWorker/pyWorkerAPI'
import pyScript from './runparser.py?raw'
import { runSympy } from './invokers';


var wasmLoaded = false;
var pyRun = undefined;

const RunPython = async(data, setter,python) =>{
  console.log(data)
  if(python === "wasm"){
    if (!wasmLoaded){
      let pyRunModule  =  await import('./pyWorker/pyWorkerAPI');
      pyRun = pyRunModule.default
      //console.log(pyRun)
      wasmLoaded =  true;
    }
    try {
      //console.log(data)
      const { results, error } =  await pyRun(pyScript, data);
      if (results) {
        setter(JSON.parse(results))
        console.log(results)
      } else if (error) {
        console.log("pyodideWorker error: ", error);
        //await RunPython(data, setter)
        window.location.reload();
      }
    } catch (e) {
        console.log(
          `Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`
      );
       window.location.reload();
    }
  }else{
    let resp = await runSympy(data)
    setter(resp)
  } 
} 

export default RunPython;
