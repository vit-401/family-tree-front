import React, {useEffect, useLayoutEffect} from 'react';
import {useSelector} from "react-redux";
import style from "./Home.module.css";
import {useAppDispatch} from "../../hooks/reducer";
import {NewNode} from "../../components/NewNode/NewNode";
import {DataTreeResponseType, WithChildrenType} from "../../api/treeData/type";
import {AppRootStateType} from "../../app/store";
import {getTreeTC} from "../../reducers/treeReducer";
import {MenuApp} from "../../components/Menu/Menu";


function Home() {


    const dataTree = useSelector<AppRootStateType, WithChildrenType<DataTreeResponseType>[]>(state => state.tree.tree)
    const dispatch = useAppDispatch()


    useEffect(() => {
        dispatch(getTreeTC())
    }, [])
    useLayoutEffect(() => {
        const elem = document.getElementById("body")
        // elem && elem.scrollBy({left: 0, top: 0})
        // elem && elem.scrollBy({left: (elem.offsetWidth / (Math.sqrt(elem.offsetWidth / 2) / 2)), top: 0})
    }, [dataTree])
    return <>
        <MenuApp/>
        <div id={"body"} className="body genealogy-body genealogy-scroll">
            <div className={style["genealogy-tree"]}>
                <ul>

                    <NewNode node={dataTree}/>


                </ul>
            </div>
        </div>

    </>
}

export default Home;

