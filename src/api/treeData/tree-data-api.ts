import axios from "../axiosHelper";
import {DataTreeResponseType, TreeCollectionType} from "./type";
import {ObjectId, WithId} from 'mongodb'


export const treeDataAPI = {

    async getTreeData() {
        return await axios.get<DataTreeResponseType[]>(`/tree`)
    },
    async addPerson(person:TreeCollectionType){
        return await axios.post<DataTreeResponseType>(`/tree`,person)
    },
    async getPerson(id: ObjectId) {
        return await axios.get<DataTreeResponseType>(`/tree/${id}`)
    },
    async updatePerson(id: ObjectId, data:TreeCollectionType) {
        return await axios.put<DataTreeResponseType>(`/tree/${id}`,data)
    },
    async deletePerson(id: ObjectId) {
        return await axios.delete(`/tree/${id}`)
    }
}

