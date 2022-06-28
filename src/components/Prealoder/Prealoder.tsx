import React from "react";
import {Space, Spin} from 'antd';


export const Preloader = () => {

    return <Space style={{
        zIndex: 1000,
        position: 'absolute',
        top: '50%',
        left: '50%'
    }} size="middle">
        <Spin  size="large"/>
    </Space>
}