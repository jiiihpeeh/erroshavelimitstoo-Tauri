export const  pyWorkerModule = async (pyScript : string, data : Data): Promise<CalcResult|Parsed>  =>{
    //@ts-ignore
    const pyWorker = await import("./pyWorkerAPI");
    //@ts-ignore
    const { results, error } = await pyWorker.default(pyScript, data);
    if(error){
        window.location.reload();
    }
    return JSON.parse(results) as CalcResult|Parsed
}