import { create } from 'zustand'
type Example = {
    content : string,
    examples : Array<string>
    show: boolean,
    setShow: ()=>void
    setContent : (newEquation :string) => void,
}

const examples = [
                    "y=x**2+l_mu",
                    "E_rel=sqrt((m_0 *c**2)**2+(p*c)**2)",
                    "nu=beta/(m_alpha -r)", 
                    "s=(sqrt(k_lambda) +exp(-p)+log(6))/(pi) + 8.09e32"
                ]

const useExample= create<Example>((set) => ({
    content: "",
    examples: examples,
    show: false,
    setShow:() =>  {
        set((state) => (
                {
                    show: !state.show
                }
            )
        )
    },
    setContent: (newEquation :string) =>  
        set(
            {
                content : newEquation
            }
        ),
}))

export default useExample;
