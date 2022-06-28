import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../app/app-reducer";
import {Dispatch} from 'redux'

export const handleServerAppError = (data: any, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    if (data.message) {
        dispatch(setAppErrorAC(data.message))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: any, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    let data = error.response?.data
    if (data && data.message) {
        dispatch(setAppErrorAC(data.message))
        dispatch(setAppStatusAC('failed'))
    } else {
        dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
        dispatch(setAppStatusAC('failed'))

    }
}

