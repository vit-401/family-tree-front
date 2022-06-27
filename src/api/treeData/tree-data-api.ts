import axios from "../axiosHelper";
import {DataTreeResponseType} from "./type";

export const tokenHanler = {

}


export const treeDataAPI = {

   async getTreeData() {
        const data =  await axios.get<DataTreeResponseType[]>(`/tree`)
       return data
    },

}

