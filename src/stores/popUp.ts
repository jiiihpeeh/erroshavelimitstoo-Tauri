import { create } from 'zustand'

type UsePopUps = {
    showSettings : boolean,
    closeSettings: () => void,
    openSettings: () => void,
}

const usePopUps = create<UsePopUps>((set) => ({
    showSettings : false,
    closeSettings: () =>  set(
        { 
            showSettings : false 
        }
    ),
    openSettings: () => set(
        {
             showSettings : true 
        }
    )
}))



export default usePopUps;