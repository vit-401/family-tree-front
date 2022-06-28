import {Menu, MenuProps} from "antd";
import React, {useEffect, useState} from "react";
import {AppstoreOutlined, TableOutlined, UserAddOutlined} from "@ant-design/icons/lib";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {getPersonAC} from "../../reducers/treeReducer";
import {useAppDispatch} from "../../hooks/reducer";


export const MenuApp = () => {
    let location = useLocation();


    const items: MenuProps['items'] = [
        {
            label: (
                <NavLink to={"/"}>
                    Home
                </NavLink>
            ),
            key: '/',
            icon: <AppstoreOutlined/>,

        },
        {
            label: (
                <NavLink to={"/table"}>
                    Table
                </NavLink>
            ),
            icon: <TableOutlined />,
            key: '/table',
        },
        {
            label: (
                <NavLink to={"/add-person"}>
                    Add Person
                </NavLink>
            ),
            icon: <UserAddOutlined/>,
            key: '/add-person',
        },


    ];


    const [current, setCurrent] = useState('home');

    const onClick: MenuProps['onClick'] = e => {
        setCurrent(e.key);
    };

    useEffect(() => {
        setCurrent(location.pathname)
    }, [location.pathname])

    return <>
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>

    </>
}