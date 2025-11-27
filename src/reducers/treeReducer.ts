import {Dispatch} from "redux";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../app/app-reducer";
import {DataTreeResponseType, TreeCollectionType, WithChildrenType} from "../api/treeData/type";
import {convertPlainArrToNested} from "../utils/convertPlainArrToNested";

// LocalStorage key
const LOCAL_STORAGE_KEY = 'family-tree-data';

// Helper to generate unique IDs
const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36);
};

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

// Helper to build tree and filter out duplicate spouse roots
const buildTree = (data: DataTreeResponseType[]): WithChildrenType<DataTreeResponseType>[] => {
    const roots = convertPlainArrToNested(data, "_id", "parentId", null);
    
    return roots.filter((node: any) => {
        // If no spouse, keep it
        if (!node.spouseId) return true;
        
        const spouse = data.find(p => p._id === node.spouseId);
        // If spouse not found in data, keep node
        if (!spouse) return true;
        
        // If spouse has a parent, they are (presumably) in the tree as a child
        // So we hide this node from roots (it will appear next to spouse)
        if (spouse.parentId) return false;
        
        // If spouse is also a root (no parent), use ID to pick one representative
        // to avoid showing the couple twice as two separate roots
        if (!spouse.parentId) {
            return node._id < spouse._id;
        }
        
        return true;
    });
};

export const treeReducer = (state: InitialStateTreeType = initialState, action: ActionsType): InitialStateTreeType => {
    switch (action.type) {
        case 'GET-TREE': {
            const treeData = buildTree(action.tree)
            return {...state, tree: treeData, dataState: action.tree}
        }
        case 'UPDATE-PERSON': {
            const updatedState: DataTreeResponseType[] = state.dataState.map(node => node._id === action.id ? {...node, ...action.data} : node)
            const treeData = buildTree(updatedState)

            return {...state, dataState: updatedState, tree: treeData}
        }
        case 'POST-PERSON': {
            // Add new person and ensure parent is open if child was added
            let updatedState: DataTreeResponseType[] = [...state.dataState, action.data];
            
            // If this person has a parent, ensure the parent is open to show the new child
            if (action.data.parentId) {
                updatedState = updatedState.map(p => 
                    p._id === action.data.parentId ? { ...p, isOpen: true } : p
                );
            }
            
            const treeData = buildTree(updatedState)

            return {...state, dataState: updatedState, tree: treeData}
        }
        case 'GET-PERSON': {
            return {...state, personFind: action.person}
        }
        case 'DELETE-PERSON': {
            const updatedState: DataTreeResponseType[] = state.dataState
                .filter(node => node._id !== action.id)
                .map(node=>node.parentId ===action.id ? {...node, parentId: null}: node)

            const treeData = buildTree(updatedState)

            return {...state, dataState: updatedState, tree: treeData}

        }
        case 'TOGGLE-NODE': {
            const updatedState = state.dataState.map(node => 
                node._id === action.id ? {...node, isOpen: !node.isOpen} : node
            );
            const treeData = buildTree(updatedState);
            return {...state, dataState: updatedState, tree: treeData};
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
export const toggleNodeAC = (id: string) => ({type: 'TOGGLE-NODE', id} as const)

export const getTreeAC = (tree: DataTreeResponseType[]) => ({type: 'GET-TREE', tree} as const)


export const getTreeTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    
    // Simulate async operation with setTimeout
    return new Promise<boolean>((resolve) => {
        setTimeout(() => {
            try {
                // Load from localStorage or start with empty array
                const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
                const data = storedData ? JSON.parse(storedData) : [];
                
                dispatch(getTreeAC(data));
                dispatch(setAppStatusAC('idle'));
                resolve(true);
            } catch (error) {
                console.error('Error loading data:', error);
                dispatch(setAppStatusAC('failed'));
                resolve(false);
            }
        }, 300);
    });
}

export const postPersonTC = (person: TreeCollectionType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    
    return new Promise<DataTreeResponseType | null>((resolve) => {
        setTimeout(() => {
            try {
                // Create new person with generated ID
                const newPerson: DataTreeResponseType = {
                    ...person,
                    _id: generateId(),
                    isOpen: true
                };
                
                // Load current data from localStorage
                const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
                const currentData: DataTreeResponseType[] = storedData ? JSON.parse(storedData) : [];
                
                // Add new person and open parent node if adding a child
                let updatedData = [...currentData, newPerson];
                
                // If this person has a parent, ensure the parent is open to show the new child
                if (person.parentId) {
                    updatedData = updatedData.map(p => 
                        p._id === person.parentId ? { ...p, isOpen: true } : p
                    );
                }
                
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
                
                dispatch(postPersonAC(newPerson));
                dispatch(setAppStatusAC('succeeded'));
                resolve(newPerson);
            } catch (error) {
                console.error('Error adding person:', error);
                dispatch(setAppStatusAC('failed'));
                resolve(null);
            }
        }, 300);
    });
}

export const updatePersonTC = (id: string, data: TreeCollectionType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    
    return new Promise<boolean>((resolve) => {
        setTimeout(() => {
            try {
                // Load current data from localStorage
                const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
                const currentData: DataTreeResponseType[] = storedData ? JSON.parse(storedData) : [];
                
                // Update person
                const updatedData = currentData.map(person => 
                    person._id === id ? { ...person, ...data } : person
                );
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
                
                dispatch(updatePersonAC(id, data));
                dispatch(setAppStatusAC('succeeded'));
                resolve(true);
            } catch (error) {
                console.error('Error updating person:', error);
                dispatch(setAppStatusAC('failed'));
                resolve(false);
            }
        }, 300);
    });
}
export const getPersonTC = (id: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    
    return new Promise<boolean>((resolve) => {
        setTimeout(() => {
            try {
                // Load current data from localStorage
                const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
                const currentData: DataTreeResponseType[] = storedData ? JSON.parse(storedData) : [];
                
                // Find person by ID
                const person = currentData.find(p => p._id === id) || null;
                
                dispatch(getPersonAC(person));
                dispatch(setAppStatusAC('idle'));
                resolve(true);
            } catch (error) {
                console.error('Error getting person:', error);
                dispatch(setAppStatusAC('failed'));
                resolve(false);
            }
        }, 300);
    });
}
export const deletePersonTC = (id: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    
    return new Promise<boolean>((resolve) => {
        setTimeout(() => {
            try {
                // Load current data from localStorage
                const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
                const currentData: DataTreeResponseType[] = storedData ? JSON.parse(storedData) : [];
                
                // Delete person and update children's parentId
                const updatedData = currentData
                    .filter(person => person._id !== id)
                    .map(person => person.parentId === id ? { ...person, parentId: null } : person);
                
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
                
                dispatch(deletePersonAC(id));
                dispatch(setAppStatusAC('succeeded'));
                resolve(true);
            } catch (error) {
                console.error('Error deleting person:', error);
                dispatch(setAppStatusAC('failed'));
                resolve(false);
            }
        }, 300);
    });
}


export type GetTreeActionType = ReturnType<typeof getTreeAC>
export type UpdatePersonActionType = ReturnType<typeof updatePersonAC>
export type PostPersonActionType = ReturnType<typeof postPersonAC>
export type GetPersonActionType = ReturnType<typeof getPersonAC>
export type DeletePersonActionType = ReturnType<typeof deletePersonAC>
export type ToggleNodeActionType = ReturnType<typeof toggleNodeAC>
export type GetTreeThunkType = ReturnType<typeof getTreeTC>


type ActionsType = GetTreeActionType
    | UpdatePersonActionType
    | DeletePersonActionType
    | GetPersonActionType
    | PostPersonActionType
    | SetAppErrorActionType
    | SetAppStatusActionType
    | ToggleNodeActionType
