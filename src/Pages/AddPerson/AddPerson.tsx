import React, {useEffect} from 'react';
import {MenuApp} from "../../components/Menu/Menu";
import {Button, Form, Input, Select, Space} from "antd";
import style from "./AddPerson.module.css";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {TreeCollectionType} from "../../api/treeData/type";
import {
    getPersonAC,
    getPersonTC,
    getTreeTC,
    InitialStateTreeType,
    postPersonTC,
    updatePersonTC
} from "../../reducers/treeReducer";
import {useAppDispatch} from "../../hooks/reducer";
import {useParams} from "react-router-dom";

const {Option} = Select
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

function AddPerson() {
    const dispatch = useAppDispatch()
    const [form] = Form.useForm();

    const {dataState, personFind} = useSelector<AppRootStateType, InitialStateTreeType>(state => state.tree)

    let {id} = useParams();


    const onFinish = async (values: any) => {
        console.log(values);
        const {firstName, lastName, parentId} = values
        const perosn: TreeCollectionType = {
            childrenId: null,
            dateOfBirth: null,
            firstName,
            lastName,
            parentId: parentId || null,
            sex: null,
            spouse: null

        }
        if (id) {
            const res = await dispatch(updatePersonTC(id, perosn))
            if (res) {
                console.log(res)
            }
        } else {
            const res = await dispatch(postPersonTC(perosn))
            if (res) {
                console.log(res)
            }
        }


    };

    useEffect(() => {
        dispatch(getTreeTC())
        console.log(id)
        if (id) {
            dispatch(getPersonTC(id))
        } else {
            form.resetFields()
        }
        return () => {
            dispatch(getPersonAC(null))
        }
    }, [id])
    useEffect(() => {
        if (personFind) {
            const {firstName, lastName, parentId} = personFind
            form.setFieldsValue({firstName, lastName, parentId})
        }
    }, [personFind])

    return <>
        <MenuApp/>
        <div className={style.formWrap}>
            <Form form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                <div className={style.container}>
                    <Form.Item
                        style={{fontWeight: 600}}

                        name="firstName"
                        label="First Name"
                        rules={[{required: true, message: "First Name is required"}]}
                    >
                        <Input size={"large"} /*prefix={<UserOutlined/>}*/ placeholder="input First Name"/>
                    </Form.Item>
                    <Form.Item
                        style={{fontWeight: 600}}

                        name="lastName"
                        label="Last Name"
                        rules={[{required: true, message: "Last Name is required"}]}
                    >
                        <Input size={"large"} placeholder="input Last Name"/>
                    </Form.Item>

                    <Form.Item
                        style={{fontWeight: 600}}
                        name="parentId"
                        label="Parent"
                    >
                        <Select
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                return (option!.children as unknown as string[]).join("").toLowerCase().includes(input.toLowerCase())
                            }}

                            className={"parentId"}
                            size={"large"}
                            style={{
                                fontWeight: 300
                            }}
                        >
                            {
                                dataState.sort((a, b) => {
                                    return a.firstName.localeCompare(b.firstName)
                                })
                                    .filter(node=>node._id !== id)
                                    .map(node => {
                                       return <Option key={node._id} value={node._id}>
                                            {node.firstName} {node.lastName}
                                        </Option>
                                    })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item style={{
                        marginLeft: "72%"
                    }}>
                        <Space>
                            <Button style={{
                                padding: "0px 53px"
                            }} type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Space>
                    </Form.Item>
                </div>

            </Form>
        </div>

    </>
}

export default AddPerson;

