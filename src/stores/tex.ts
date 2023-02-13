import { create } from 'zustand';

export const emptyResult: Result = {entry: [], evaluated: ''}
export const emptyParts: Parts = { parts: [], base: ''}

export const emptyTex : TeXEquation = {
                        parsed_equation: '',
                        error_equations: '',
                        error_equations_parts: emptyParts,
                        result:emptyResult
                    }

type TeX = {
  equations : TeXEquation,
  setEquations : (newTeX: TeXEquation) => void,
}

const useTeX = create<TeX>((set) => ({
  equations: emptyTex,
  setEquations: (arg:TeXEquation) => 
    set(
        { 
          equations : arg 
        }
    ),
}))

export default useTeX
