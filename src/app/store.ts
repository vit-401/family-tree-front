import thunkMiddleware from 'redux-thunk'
import {appReducer} from "./app-reducer";
import {applyMiddleware, combineReducers, createStore, Store} from "redux";
import {treeReducer} from "../reducers/treeReducer";
// import {userReducer} from "../reducers/userReducer";


const rootReducer = combineReducers({
    app: appReducer,
    tree: treeReducer
})



export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));


export type AppRootStateType = ReturnType<typeof rootReducer>
// @ts-ignore
export type AppStoreType = ReturnType<typeof store>
export type AppDispatchType = AppStoreType['dispatch']

// this so that you can access the store in the browser console at any time
// @ts-ignore
window.store = store;
