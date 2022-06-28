import {ObjectId, WithId} from 'mongodb'
// type ResponseDataType = {
//     data:
//         status:
//     statusText:
// }
export type WithChildrenType<T = {}> = T & { children: WithChildrenType<DataTreeResponseType>[] }

export type TreeCollectionType = {
    firstName: string,
    lastName: string,
    parentId: ObjectId | null,
    childrenId: ObjectId | null
    sex:null| string
    dateOfBirth:null| string
    spouse:null| DataTreeResponseType

}

export type DataTreeResponseType = WithId<{
    firstName: string,
    lastName: string,
    parentId: ObjectId | null,
    childrenId: ObjectId | null
    sex:null| string
    dateOfBirth:null| string
    spouse:null| DataTreeResponseType
    isOpen: boolean
}>

