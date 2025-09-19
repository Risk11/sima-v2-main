import { ParamState } from "@/types/data-table"
import { useSearchParams } from "react-router-dom"


export function useParams<TParams extends Record<string, string>>() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries()) as TParams
  
  const setParams = async (partialParams: Record<string, ParamState>) => {
    const newParams: Record<string, string> = {}
  
    Object.entries({ ...params, ...partialParams }).forEach(([key, value]) => {
      if (value != null) {
        newParams[key] = String(value)
      }
    })

    setSearchParams(newParams)  
  }  

  const resetParams = async () => {
    setSearchParams({})
  }
  
  return { params, setParams, resetParams }
}
