import {Menu, MenuProps} from "antd";
import React, {useState} from "react";
import {items} from "./items";

export const MenuApp = () => {
    const [current, setCurrent] = useState('mail');

    const onClick: MenuProps['onClick'] = e => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return <>
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>

    </>
}