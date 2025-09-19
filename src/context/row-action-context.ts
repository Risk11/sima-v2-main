import { createContext, Dispatch, SetStateAction } from 'react'

interface RowActionContext {
  isDropdownOpen: boolean,
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>
}

export const RowActionContext =  createContext<RowActionContext>({} as RowActionContext)