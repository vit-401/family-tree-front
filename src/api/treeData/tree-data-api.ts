import axios from "../axiosHelper";
import {DataTreeResponseType, TreeCollectionType} from "./type";


export const treeDataAPI = {

    async getTreeData() {
        return await axios.get<DataTreeResponseType[]>(`/tree`)
    },
    async addPerson(person:TreeCollectionType){
        return await axios.post<DataTreeResponseType>(`/tree`,person)
    },
    async getPerson(id: string) {
        return await axios.get<DataTreeResponseType>(`/tree/${id}`)
    },
    async updatePerson(id: string, data:TreeCollectionType) {
        return await axios.put<DataTreeResponseType>(`/tree/${id}`,data)
    },
    async deletePerson(id: string) {
        return await axios.delete(`/tree/${id}`)
    }
}

