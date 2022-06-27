import React, {useEffect, useState} from 'react';
import './App.css';
import {treeDataAPI} from "./api/treeData/tree-data-api";
import {DataTreeResponseType} from "./api/treeData/type";

type WithChildrenType<T = {}> = T & { children: WithChildrenType<DataTreeResponseType>[] }

const dumbUserURI = "data:image/png;base64,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"
const father = "data:image/jpeg;base64,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"
type NodeComponentPropsType = {
    children?: React.ReactNode
    node?: WithChildrenType<DataTreeResponseType>[]
}

function NewNode(props?: NodeComponentPropsType): JSX.Element {

    return <> {
        props?.node?.map(node => {
            return <li key={node._id + ""}>
                <a>
                    <div className="member-view-box">
                        <div className="member-image">
                            <img src={dumbUserURI}
                                 alt="Member"/>
                            <div className="member-details">
                                <h3>{node.firstName} {node.lastName}</h3>
                            </div>
                        </div>
                    </div>
                </a>
                {node.children.length ? (<ul><NewNode node={node.children}/></ul>) : null}

            </li>
        })
    }
    </>
}


function App() {
    const [state, setState] = useState<DataTreeResponseType[]>([])
    const [dataTree, setDataTree] = useState<WithChildrenType<DataTreeResponseType>[]>([])
    const getData = async () => {
        const data = await treeDataAPI.getTreeData()
        return data.data
    }

    const convertPlainArrToNested = (arr: any[], idField: "_id", parentField: "parentId", rootParent: number | null) => {
        // @ts-ignore
        const tree = {[rootParent]: {children: []}};

        // @ts-ignore
        arr.forEach(n => tree[n[idField]] = {...n, children: []});
        // @ts-ignore
        arr.forEach(n => tree[n[parentField]].children.push(tree[n[idField]]));

        // @ts-ignore
        return tree[rootParent].children;
    }

    useEffect(() => {
        (async () => {
            const data = await getData()
            setState(data)
        })()
    }, [])

    useEffect(() => {
        if (state.length) {
            const treeData = convertPlainArrToNested(state, "_id", "parentId", null)
            setDataTree(treeData)
        }
    }, [state])
    return <>

        <div className="body genealogy-body genealogy-scroll">
            <div className="genealogy-tree">
                <ul>

                    <NewNode node={dataTree}/>


                </ul>
            </div>
        </div>

    </>
}

export default App;

