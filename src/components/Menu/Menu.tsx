import {Menu, MenuProps} from "antd";
import React, {useEffect, useState} from "react";
import {AppstoreOutlined, TableOutlined, UserAddOutlined} from "@ant-design/icons/lib";
import {NavLink, useLocation} from "react-router-dom";
import styles from './Menu.module.css';


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
        // If viewing a specific person's tree, highlight Home menu item
        if (location.pathname.startsWith('/tree/')) {
            setCurrent('/');
        } else {
            setCurrent(location.pathname);
        }
    }, [location.pathname])

    return <>
        <div className={styles.menuContainer}>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
        </div>
        <div style={{height: 64}} /> {/* Spacer for fixed menu */}
    </>
}