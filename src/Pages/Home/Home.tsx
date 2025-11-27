import React, {useEffect, useLayoutEffect, useMemo} from 'react';
import {useSelector} from "react-redux";
import style from "./Home.module.css";
import {useAppDispatch} from "../../hooks/reducer";
import {NewNode} from "../../components/NewNode/NewNode";
import {DataTreeResponseType, WithChildrenType} from "../../api/treeData/type";
import {AppRootStateType} from "../../app/store";
import {getTreeTC} from "../../reducers/treeReducer";
import {MenuApp} from "../../components/Menu/Menu";
import {useParams, useNavigate} from "react-router-dom";
import {convertPlainArrToNested} from "../../utils/convertPlainArrToNested";
import {Button} from "antd";
import {ArrowLeftOutlined, HomeOutlined} from "@ant-design/icons";


function Home() {
    const {personId} = useParams<{personId: string}>();
    const navigate = useNavigate();
    const dataState = useSelector<AppRootStateType, DataTreeResponseType[]>(state => state.tree.dataState)
    const mainTree = useSelector<AppRootStateType, WithChildrenType<DataTreeResponseType>[]>(state => state.tree.tree)
    const dispatch = useAppDispatch()

    // Build tree starting from specific person or use main tree
    const displayTree = useMemo(() => {
        if (personId) {
            const person = dataState.find(p => p._id === personId);
            if (!person) return [];

            // Build children tree for this specific person
            const childrenTree = convertPlainArrToNested(dataState, "_id", "parentId", personId);
            
            // Return person as root with their children
            return [{...person, children: childrenTree}];
        }
        return mainTree;
    }, [personId, dataState, mainTree]);

    // Get current person info for breadcrumb
    const currentPerson = useMemo(() => {
        if (personId) {
            return dataState.find(p => p._id === personId);
        }
        return null;
    }, [personId, dataState]);

    useEffect(() => {
        dispatch(getTreeTC())
    }, [])
    
    useLayoutEffect(() => {
        const elem = document.getElementById("body")
        // elem && elem.scrollBy({left: 0, top: 0})
        // elem && elem.scrollBy({left: (elem.offsetWidth / (Math.sqrt(elem.offsetWidth / 2) / 2)), top: 0})
    }, [displayTree])
    
    return <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
        <MenuApp/>
        {personId && (
            <div style={{
                padding: '16px 24px',
                background: '#f5f5f5',
                borderBottom: '1px solid #d9d9d9',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'sticky',
                top: 64,
                zIndex: 99
            }}>
                <Button 
                    icon={<HomeOutlined />} 
                    onClick={() => navigate('/')}
                    type="default"
                >
                    Main Tree
                </Button>
                {currentPerson && (
                    <span style={{fontSize: '16px', fontWeight: 500}}>
                        Viewing tree of: {currentPerson.firstName} {currentPerson.lastName}
                    </span>
                )}
            </div>
        )}
        <div id={"body"} className="body genealogy-body genealogy-scroll" style={{flex: 1, overflow: 'auto'}}>
            <div className={style["genealogy-tree"]}>
                <ul>
                    <NewNode node={displayTree}/>
                </ul>
            </div>
        </div>

    </div>
}

export default Home;

