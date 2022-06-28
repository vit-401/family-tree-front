const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false,
    value: false
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status, value: action.value || false}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/APP-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return {...state}
    }
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // is there any interaction with the server now
    status: RequestStatusType
    // if a global error occurs, we will write the error text here
    error: string | null
    isInitialized: boolean
    value: boolean
}

export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppStatusAC = (status: RequestStatusType, value?: boolean) => ({
    type: 'APP/SET-STATUS',
    status,
    value
} as const)
export const setIsInitializedAC = (isInitialized: boolean) => ({
    type: 'APP/APP-INITIALIZED',
    isInitialized
} as const)


export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type setIsInitializedACType = ReturnType<typeof setIsInitializedAC>


type ActionsType =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | setIsInitializedACType
