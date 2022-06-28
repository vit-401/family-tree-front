import {Dispatch} from "redux";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {DataTreeResponseType, TreeCollectionType, WithChildrenType} from "../api/treeData/type";
import {convertPlainArrToNested} from "../utils/convertPlainArrToNested";
import {treeDataAPI} from "../api/treeData/tree-data-api";

export type InitialStateTreeType = {
    tree: WithChildrenType<DataTreeResponseType>[]
    dataState: DataTreeResponseType[]
    personFind: null | DataTreeResponseType
}

const initialState: InitialStateTreeType = {
    tree: [],
    dataState: [],
    personFind: null
}

export const treeReducer = (state: InitialStateTreeType = initialState, action: ActionsType): InitialStateTreeType => {
    switch (action.type) {
        case 'GET-TREE': {
            const treeData = convertPlainArrToNested(action.tree, "_id", "parentId", null)
            return {...state, tree: treeData, dataState: action.tree}
        }
        case 'UPDATE-PERSON': {
            const updatedState: DataTreeResponseType[] = state.dataState.map(node => node._id === action.id ? {...node, ...action.data} : node)
            const treeData = convertPlainArrToNested(updatedState, "_id", "parentId", null)

            return {...state, dataState: updatedState, tree: treeData}
        }
        case 'POST-PERSON': {
            const updatedState: DataTreeResponseType[] = [...state.dataState, action.data]
            const treeData = convertPlainArrToNested(updatedState, "_id", "parentId", null)

            return {...state, dataState: updatedState, tree: treeData}
        }
        case 'GET-PERSON': {
            return {...state, personFind: action.person}
        }
        case 'DELETE-PERSON': {
            const updatedState: DataTreeResponseType[] = state.dataState
                .filter(node => node._id !== action.id)
                .map(node=>node.parentId ===action.id ? {...node, parentId: null}: node)

            const treeData = convertPlainArrToNested(updatedState, "_id", "parentId", null)

            return {...state, dataState: updatedState, tree: treeData}

        }
        default:
            return state
    }
}


export const updatePersonAC = (id: string, data: TreeCollectionType) => ({
    type: 'UPDATE-PERSON',
    data,
    id
} as const)
export const postPersonAC = (data: DataTreeResponseType) => ({type: 'POST-PERSON', data} as const)
export const getPersonAC = (person: DataTreeResponseType|null) => ({type: 'GET-PERSON', person} as const)
export const deletePersonAC = (id: string) => ({type: 'DELETE-PERSON', id} as const)

export const getTreeAC = (tree: DataTreeResponseType[]) => ({type: 'GET-TREE', tree} as const)


export const getTreeTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    return treeDataAPI.getTreeData()
        .then((res) => {
            if (res.status === 200) {
                dispatch(getTreeAC(res.data));
                dispatch(setAppStatusAC('idle'))
                return true
            } else {
                handleServerAppError(res.data, dispatch)
                return false
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch);
            return false
        })
}

export const postPersonTC = (person: TreeCollectionType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    return treeDataAPI.addPerson(person)
        .then((res) => {
            if (res.status === 201) {
                dispatch(postPersonAC(res.data));
                dispatch(setAppStatusAC('succeeded'))
                return true
            } else {
                handleServerAppError(res.data, dispatch)
                return false
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch);
            return false
        })
}

export const updatePersonTC = (id: string, data: TreeCollectionType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    return treeDataAPI.updatePerson(id, data)
        .then((res) => {
            if (res.status === 204) {
                dispatch(updatePersonAC(id, data));
                dispatch(setAppStatusAC('succeeded'))
                return true
            } else {
                handleServerAppError(res.data, dispatch)
                return false
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch);
            return false
        })
}
export const getPersonTC = (id: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    return treeDataAPI.getPerson(id)
        .then((res) => {
            if (res.status === 200) {
                dispatch(getPersonAC(res.data));
                dispatch(setAppStatusAC('idle'))
                return true
            } else {
                handleServerAppError(res.data, dispatch)
                return false
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch);
            return false
        })
}
export const deletePersonTC = (id: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    return treeDataAPI.deletePerson(id)
        .then((res) => {
            if (res.status === 204) {
                dispatch(deletePersonAC(id));
                dispatch(setAppStatusAC('succeeded'))
                return true
            } else {
                handleServerAppError(res.data, dispatch)
                return false
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch);
            return false
        })
}


export type GetTreeActionType = ReturnType<typeof getTreeAC>
export type UpdatePersonActionType = ReturnType<typeof updatePersonAC>
export type PostPersonActionType = ReturnType<typeof postPersonAC>
export type GetPersonActionType = ReturnType<typeof getPersonAC>
export type DeletePersonActionType = ReturnType<typeof deletePersonAC>
export type GetTreeThunkType = ReturnType<typeof getTreeTC>


type ActionsType = GetTreeActionType
    | UpdatePersonActionType
    | DeletePersonActionType
    | GetPersonActionType
    | PostPersonActionType
    | SetAppErrorActionType
    | SetAppStatusActionType
