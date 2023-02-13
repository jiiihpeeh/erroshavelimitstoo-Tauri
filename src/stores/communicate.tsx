
import { create } from 'zustand'
import { Command } from '../type.d'

const emptyMessage : Message = { 
  parseEquation: null, 
  processTable : null,  
  fetchSvg: null, 
  fetchPdf: null
}

type Communicate = {
    message : Message,
    setValue : (key: Command , value: string|ProcessTable|null) => void
}

const useCommunicate = create<Communicate>((set) => ({
    message: emptyMessage,
    setValue:(key: Command , value: string|ProcessTable|null) =>  {
        set(
            state => (
                {
                    message: {...state.message, [key]: value }
                }
            )
        )
    }
}))

export default useCommunicate;

