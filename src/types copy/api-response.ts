export interface Pagination {
    size: number
    page: number
    total: number
    lastPage: number
}

export interface ApiResponse<T> {
    size: number
    code: number
    status: string
    data: T,
    pagination?: Pagination,
    headers?:any
}