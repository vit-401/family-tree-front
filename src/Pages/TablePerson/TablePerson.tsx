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
import style from "./TablePerson.module.css";


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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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
            title: <div style={{fontWeight: "bold"}}>Date of Birth</div>,
            width: 150,
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            sorter: (a: any, b: any) => {
                if (!a.dateOfBirth && !b.dateOfBirth) return 0;
                if (!a.dateOfBirth) return 1;
                if (!b.dateOfBirth) return -1;
                return a.dateOfBirth.localeCompare(b.dateOfBirth);
            },
            render: (text: any) => text || '-',
        },
        {
            title: <div style={{fontWeight: "bold"}}>Phone Number</div>,
            width: 180,
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (text: any) => text || '-',
        },
        {
            title: <div style={{fontWeight: "bold"}}>Address</div>,
            width: 250,
            dataIndex: 'address',
            key: 'address',
            render: (text: any) => text || '-',
        },

        {
            title: '',
            fixed: 'right',
            width: 100,
            dataIndex: 'action',
            key: 'action',
            render: (text: any, record: any) => {
                return <Space size="middle" align={"end"}>

                    <NavLink to={`/edit-person/${record._id}`} className={style.actionLink}>
                        Edit
                    </NavLink>

                    <Popconfirm
                        placement="topRight"
                        title="Are you sure you want to delete this person?"
                        onConfirm={() => deleteUser(record._id)}
                        onCancel={handleCancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <span className={`${style.actionLink} ${style.deleteAction}`}>
                            Delete
                        </span>
                    </Popconfirm>

                </Space>
            },
        },
    ];


    return <>
        <MenuApp/>
        <div className={style.tableContainer}>
            <div className={style.searchContainer}>
                <Input.Search
                    placeholder="Search by first name..."
                    onChange={(e) => setFilterText(e.target.value)}
                    size="large"
                    allowClear
                />
            </div>
            <div className={style.tableWrapper}>
                <Table  
                    columns={columns}
                    dataSource={filteredList}
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20", "50", "100"],
                        defaultPageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} people`,
                    }}
                />
            </div>
        </div>
    </>
}

export default TablePerson;

