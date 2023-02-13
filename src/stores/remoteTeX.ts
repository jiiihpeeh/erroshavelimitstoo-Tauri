

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface RemoteTex {
  remoteFetch: boolean
  setFetch: (s: boolean) => void
}

export const useRemoteTeX = create<RemoteTex>()(
  persist(
    (set) => (
        {
            remoteFetch: false,
            setFetch: (s) => set(
                { 
                    remoteFetch: s 
                }
            ),
        }
    ),
    {
        name: 'remoteTeX', 
        storage: createJSONStorage(() => localStorage), 
        partialize: (state) => (
            { 
                remoteFetch: state.remoteFetch 
            }
        ),
    }
  )
)