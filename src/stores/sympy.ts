import { create } from 'zustand'

type Sympy = {
    content : string,
    setContent : (input:string) => void
}

const useSympy = create<Sympy>((set) => ({
    content: "",
    setContent : (input:string) => set(
        {
            content: input
        }
    )
}))

export default useSympy