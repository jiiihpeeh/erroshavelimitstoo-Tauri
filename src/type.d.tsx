export enum IncludeResult {
    None = "none",
    Result = "result",
    ResultError = "result_error"
}
export enum IncludeEquation {
    None = "none",
    Equation = "equation",
    EquationSimplified = "equation_simplified"
}

export enum ErrorEquation {
    Simplified = "simplified", 
    Basic = "basic", 
    Construction = "construction", 
    Parts = "parts"
}

export type ErrorEquations = {
    simplified: boolean, 
    basic: boolean, 
    construction: boolean, 
    parts: boolean
}

export enum IncludeValues {
    ValuesError = "values_error"
}

export enum SymPyCall {
    Parse = "parse",
    Calculate = "calculate"
}
export enum Command {
    Parse = "parseEquation",
    Calculate = "processTable",
    Svg = "fetchSvg",
    Pdf = "fetchPdf"
}
  
export enum Python {
    Wasm = "wasm",
    System = "system",
    None = "none"
} 

