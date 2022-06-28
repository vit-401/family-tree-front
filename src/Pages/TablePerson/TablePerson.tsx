import React, {useEffect, useMemo, useState} from 'react';
import {MenuApp} from "../../components/Menu/Menu";
import {Input, Popconfirm, Space, Table} from "antd";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {deletePersonTC, getTreeTC, InitialStateTreeType} from "../../reducers/treeReducer";
import {DataTreeResponseType} from "../../api/treeData/type";
import {useAppDispatch} from "../../hooks/reducer";
import {ColumnsType} from "antd/lib/table/interface";


function TablePerson() {


    const dispatch = useAppDispatch()


    let {dataState} = useSelector<AppRootStateType, InitialStateTreeType>(state => state.tree)
    dataState = dataState.map( (node,index)=>({...node,index:index +1 }))
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filterText, setFilterText] = useState("");

    const handleOk = () => {

        setIsModalVisible(true);
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const deleteUser = (userId: string) => {
        dispatch(deletePersonTC(userId))
    }

    useEffect(() => {
        dispatch(getTreeTC())

    }, [dispatch])
    let filteredList = useMemo(() => {
        let filtered: DataTreeResponseType[] = [...dataState];
        filtered = filterText && filterText.length ? filtered.filter(item => item.firstName.toLowerCase().includes(filterText.toLowerCase())) : filtered;
        return filtered
    }, [dataState, filterText])


    const columns:ColumnsType<any> = [
        {
            title: <div style={{fontWeight: "bold"}}>id</div>,
            width: 60,
            dataIndex: 'index',
            key: 'index',
            fixed: 'left',
            defaultSortOrder: 'ascend',
            sorter: (a: any, b: any) => {
                return a -b
            },
            render: (text: any, record: any) => {
                return text
            },
        },

        {
            title: <div style={{fontWeight: "bold"}}>First name</div>,
            width: 200,
            dataIndex: 'firstName',
            key: 'firstName',
            defaultSortOrder: 'ascend',
            sorter: (a: any, b: any) => {
                return a.firstName && b.firstName && a.firstName.localeCompare(b.firstName)
            },
        },
        {
            title: <div style={{fontWeight: "bold"}}>Last name</div>,
            width: 200,
            dataIndex: 'lastName',
            key: 'lastName',
            defaultSortOrder: 'ascend',
            sorter: (a: any, b: any) => {
                return a.lastName && b.lastName && a.lastName.localeCompare(b.lastName)
            },
        },

        {
            title: '',
            fixed: 'right',
            width: 100,
            dataIndex: 'action',
            key: 'action',
            render: (text: any, record: any) => {
                return <Space size="middle" align={"end"}>

                    <NavLink to={`/edit-person/${record._id}`}>
                        <div style={{color: '#F05A2E', cursor: 'pointer'}}>
                            Edit
                        </div>
                    </NavLink>

                    <Popconfirm
                        placement="topRight"
                        title="Are you sure you want to delete this user?"
                        onConfirm={() => deleteUser(record._id)}
                        onCancel={handleCancel}
                    >
                        <div style={{color: '#F05A2E', cursor: 'pointer'}}>
                            Delete
                        </div>
                    </Popconfirm>

                </Space>
            },
        },
    ];


    return <>
        <div >
            <MenuApp/>

            <div>
                <Input.Search
                    placeholder="Search"
                    onChange={(e) => setFilterText(e.target.value)}
                    style={{width: 200, marginRight: "15px"}}
                />

            </div>
            <Table  columns={columns}
                    dataSource={filteredList}
                    pagination={{
                        showSizeChanger:true,
                        pageSizeOptions: ["5", "10", "20", "50", "100"],
                        defaultPageSize: 5,
                    }}

            />
        </div>
    </>
}

export default TablePerson;

