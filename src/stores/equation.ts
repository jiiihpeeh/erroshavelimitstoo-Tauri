import { create } from 'zustand'

export const emptyEquation : Parsed = {   
    original_equation: '',
    tex: '',
    tex_eval: '',
    tex_prefix: '',
    diff_parts_tex: [],
    error_term_tex: '',
    error_term_simplified_tex: '',
    error_equation: '',
    error_str: '',
    used_symbols: null
}

export const noResult = {result: '', error: ''}

const constructDisplay = (eq: Parsed):string =>  {
    let eqStr = ''
    if(eq.tex === eq.tex_eval){
        eqStr = eq.tex
    }else{
        eqStr = `${eq.tex} = ${eq.tex_eval}`
    }
    if(eq.tex_prefix !== ''){
        eqStr = `${eq.tex_prefix} = ${eqStr}`
    }
    return  eqStr;
}

const useEquation= create<Equation>((set) => ({
    content: emptyEquation,
    display: '',
    displayResult: '',
    setContent: (newEquation :Parsed) =>  set(
        {
            display : constructDisplay(newEquation),
            content : newEquation
        }
    ) ,
    values: {},
    setValues: (newArray: CalcArrays) => set(
        {
            values : newArray
        }
    ),
    result: noResult,
    setResult: (newResult: CalcResult) => set(
        (state) => (
                {
                    result : newResult,
                    displayResult: `${state.content.tex_prefix} \\pm \\delta ${state.content.tex_prefix} = ${newResult.result} \\pm ${newResult.error}`
                }
            )
    ),
    reset: () =>  set(
                        {
                            result : noResult, 
                            content: emptyEquation, 
                            values: {},
                            display : '',
                            displayResult:''
                        }
    ),
}))

export default useEquation;


