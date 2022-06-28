// type ResponseDataType = {
//     data:
//         status:
//     statusText:
// }
export type WithChildrenType<T = {}> = T & { children: WithChildrenType<DataTreeResponseType>[] }

export type TreeCollectionType = {
    firstName: string,
    lastName: string,
    parentId: string | null,
    childrenId: string | null
    sex:null| string
    dateOfBirth:null| string
    spouse:null| DataTreeResponseType

}
export type WithId<T> = T & {_id: string}
export type DataTreeResponseType = WithId<{
    firstName: string,
    lastName: string,
    parentId: string | null,
    childrenId: string | null
    sex:null| string
    dateOfBirth:null| string
    spouse:null| DataTreeResponseType
    isOpen: boolean
}>

