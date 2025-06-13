import React, { createContext, useContext, useState } from 'react'

const SharedContext = createContext()

export function SharedProvider({ children }) {
  const [sharedValue, setSharedValue] = useState(false)
  return (
    <SharedContext.Provider value={{ sharedValue, setSharedValue }}>
      {children}
    </SharedContext.Provider>
  )
}

export function useSharedContext() {
  return useContext(SharedContext)
}
