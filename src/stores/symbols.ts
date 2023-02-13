import { create } from 'zustand'

type UseSymbol = {
    values : SymbolObject
    setValue: (key: string, value: string) => void
    setValues: (s: SymbolObject) => void
}
export const useSymbol = create<UseSymbol>((set) => ({
    values: {},
    setValue:(key, value) =>  {
        set(
            (state) => (
                {
                    values: {...state.values, [key]: value }
                }
            )
        )
    },
    setValues: (s) => {
        set( 
            {
                values: s
            }
            )
        }
}))

export const useErrorSymbol = create<UseSymbol>((set) => ({
    values: {},
    setValue:(key, value) =>  {
        set(
            state => (
                {
                    values: {...state.values, [key]: value }
                }
            )
        )
    },
    setValues: (s) => {
        set( 
            { 
                values: s
            } 
        )
    }
}))