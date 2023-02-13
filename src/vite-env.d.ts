/// <reference types="vite/client" />
declare type CalcResult = {
    result: string,
    error: string
}

declare type Parsed = {
    original_equation: string
    tex: string
    tex_eval: string
    tex_prefix: string
    diff_parts_tex: string[]
    error_term_tex: string
    error_term_simplified_tex: string
    error_equation: string
    error_str: string
    used_symbols: Symbols | null
}
declare type Symbols = {
    [key: string]: Array<string>;
}
declare type SetParsed = (newEquation: Parsed) => void
declare type SetResult = (newResult: CalcResult) => void
declare type Equation = {
    content : Parsed,
    display :  string,
    displayResult: string,
    setContent : SetParsed,
    values: CalcArrays
    setValues : (newArray :CalcArrays) => void,
    result: CalcResult,
    setResult: SetResult
    reset: () => void
}

declare type CalcArrays = { 
    [key: string]: Array<number>;
  }
declare  type ProcessTable = {
    original_equation : string
    original_error: string
    values: CalcArrays
    used_symbols: Symbols
}


declare type Message = {
    parseEquation: string |  null
    processTable : string | null
    fetchSvg :  string | null
    fetchPdf :  string | null
}

declare type Result = {
    entry: Array<string>,
    evaluated : string 
  }
declare type Parts = {
    parts: Array<string>,
    base : string 
}
declare type TeXEquation = {
        parsed_equation: string;
        error_equations: string;
        error_equations_parts: Parts;
        result: Result;
}
declare type Data = {
    mode: string;
    input_str: string;
}

declare type SymbolValues = {
          [key: string]: number;
}

declare type SymbolObject = {
    [key:string] : string
}

declare type  ValueSetter = (key: string, value: string) => void
declare type OnChangeEvent = React.ChangeEvent<HTMLInputElement>
