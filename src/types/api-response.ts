export interface Pagination {
    size: number
    page: number
    total: number
    lastPage: number
}

export interface ApiResponseType<T> {
    code: number
    status: string
    data: T,
    pagination?: Pagination,
    size: number
    headers?:any
}