import { create } from 'zustand'
import { IncludeEquation,ErrorEquations,ErrorEquation, IncludeValues,IncludeResult} from '../type.d'


const defaultErrors: ErrorEquations = {
    simplified : true, 
    basic: true, 
    construction: true, 
    parts: false
}

type TeXSelection = {
    parsedEquation : IncludeEquation,
    setParsedEquation: (eq: IncludeEquation)=> void,
    errorEquations : ErrorEquations,
    setErrorEquations: (eq: ErrorEquation, b : boolean) => void,
    values: IncludeValues,
    setValues: (value: IncludeValues, ) => void,
    results: IncludeResult,
    setResults: (res: IncludeResult) => void,
} 

const useTeXSelection= create<TeXSelection>((set) => ({
    parsedEquation: IncludeEquation.EquationSimplified,
    setParsedEquation: (eq: IncludeEquation) => set({parsedEquation: eq}),
    errorEquations: defaultErrors,
    setErrorEquations:(eq, b ) =>  {
         set((state) => (
            {
                errorEquations: {...state.errorEquations, [eq]: b } 
            }    
        ))},
    values: IncludeValues.ValuesError,
    setValues: (value: IncludeValues)=> set({values: value}),
    results: IncludeResult.ResultError,
    setResults: (res: IncludeResult) => set({results: res}),
}))

export default useTeXSelection;
