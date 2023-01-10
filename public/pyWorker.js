
const loadPy = async() => {
  try{
    let resp = await fetch('/pyodide.text-js') 
    let text = await resp.text()
    const pyodideBlob = new Blob([text], {type: 'text/javascript'});
    const pyodideURL = URL.createObjectURL(pyodideBlob);
    console.log(pyodideURL)
    importScripts(pyodideURL);
  }catch(err){
    await loadPy()
  }
}




const  load_python = async () => {
  try{
    await loadPy()
    self.pyodide = await loadPyodide({
        indexURL: "/",
    });
    await self.pyodide.loadPackage(
          ["/mpmath-1.2.1-py3-none-any.whl",
          "/sympy-1.11.1-py3-none-any.whl",
          "/parse_equation-1.0-py2.py3-none-any.whl" ]
    );
  }
  catch(err){
    await load_python()
  }
}


let pyodideReadyPromise = load_python()


self.onmessage = async (event) => {
    // make sure loading is done
    await pyodideReadyPromise;
    // Don't bother yet with this line, suppose our API is built in such a way:
    const { id, python, ...context } = event.data;
    // The worker copies the context in its own "memory" (an object mapping name to values)
    for (const key of Object.keys(context)) {
      self[key] = context[key];
    }
    // Now is the easy part, the one that is similar to working in the main thread:
    try {
      await self.pyodide.loadPackagesFromImports(python);
      let results = await self.pyodide.runPythonAsync(python);
      self.postMessage({ results, id });
    } catch (error) {
      self.postMessage({ error: error.message, id });
    }
  };