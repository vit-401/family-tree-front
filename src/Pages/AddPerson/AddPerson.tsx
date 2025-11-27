import React, {useEffect} from 'react';
import {MenuApp} from "../../components/Menu/Menu";
import {Button, DatePicker, Form, Input, Select, Space} from "antd";
import style from "./AddPerson.module.css";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {TreeCollectionType, DataTreeResponseType} from "../../api/treeData/type";
import {
    getPersonAC,
    getPersonTC,
    getTreeTC,
    InitialStateTreeType,
    postPersonTC,
    updatePersonTC
} from "../../reducers/treeReducer";
import {useAppDispatch} from "../../hooks/reducer";
import {useParams, useSearchParams, useNavigate} from "react-router-dom";
import moment from 'moment';

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
    const navigate = useNavigate();
    
    const {dataState, personFind} = useSelector<AppRootStateType, InitialStateTreeType>(state => state.tree)
    
    let {id} = useParams();
    const [searchParams] = useSearchParams();
    const queryParentId = searchParams.get("parentId");
    const queryChildId = searchParams.get("childId");

    const handleRelationshipChange = (value: string) => {
        switch(value) {
            case 'father':
                form.setFieldsValue({ sex: 'male', parentType: 'biological' });
                break;
            case 'mother':
                form.setFieldsValue({ sex: 'female', parentType: 'biological' });
                break;
            case 'stepfather':
                form.setFieldsValue({ sex: 'male', parentType: 'step' });
                break;
            case 'stepmother':
                form.setFieldsValue({ sex: 'female', parentType: 'step' });
                break;
        }
    };


    const onFinish = async (values: any) => {
        console.log(values);
        const {firstName, lastName, parentId, dateOfBirth, address, phoneNumber, sex, parentType} = values
        
        // Check if we are adding a parent to a child who already has a parent
        let initialSpouseId = null;
        let childToUpdate: DataTreeResponseType | undefined;

        if (queryChildId && !id) { // Only for new person
            childToUpdate = dataState.find(p => p._id === queryChildId);
            if (childToUpdate && childToUpdate.parentId) {
                // Child has a parent, so this new person is the spouse of that parent
                initialSpouseId = childToUpdate.parentId;
            }
        }

        const perosn: TreeCollectionType = {
            childrenId: null,
            dateOfBirth: dateOfBirth ? dateOfBirth.format('YYYY-MM-DD') : null,
            firstName,
            lastName,
            parentId: parentId || null,
            sex: sex || null,
            spouseId: initialSpouseId,
            address: address || null,
            phoneNumber: phoneNumber || null,
            parentType: parentType || 'biological'
        }
        if (id) {
            const res = await dispatch(updatePersonTC(id, perosn))
            if (res) {
                console.log(res)
                navigate('/');
            }
        } else {
            const res = await dispatch(postPersonTC(perosn))
            if (res) {
                // If we are creating a parent for an existing child (queryChildId is present)
                if (queryChildId && res && childToUpdate) {
                    if (childToUpdate.parentId) {
                         // Case: Child has parent. We added a Spouse.
                         // We already set spouseId on the new person (res).
                         // Now update the existing parent to point back to the new person.
                         const existingParent = dataState.find(p => p._id === childToUpdate!.parentId);
                         if (existingParent) {
                             const parentUpdate: TreeCollectionType = {
                                firstName: existingParent.firstName,
                                lastName: existingParent.lastName,
                                parentId: existingParent.parentId,
                                childrenId: existingParent.childrenId,
                                sex: existingParent.sex,
                                dateOfBirth: existingParent.dateOfBirth,
                                spouseId: res._id, // Link to new person
                                address: existingParent.address,
                                phoneNumber: existingParent.phoneNumber
                             };
                             await dispatch(updatePersonTC(existingParent._id, parentUpdate));
                         }
                    } else {
                         // Case: Child has NO parent. We added the first parent.
                         // Update child to point to this new person as parent.
                         const childUpdateData: TreeCollectionType = {
                            firstName: childToUpdate.firstName,
                            lastName: childToUpdate.lastName,
                            parentId: res._id, // Set the new person as parent
                            childrenId: childToUpdate.childrenId,
                            sex: childToUpdate.sex,
                            dateOfBirth: childToUpdate.dateOfBirth,
                            spouseId: childToUpdate.spouseId,
                            address: childToUpdate.address,
                            phoneNumber: childToUpdate.phoneNumber
                         };
                         await dispatch(updatePersonTC(queryChildId, childUpdateData));
                    }
                }
                console.log(res)
                navigate('/');
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
            // Pre-select parentId if provided in query params
            if (queryParentId) {
                form.setFieldsValue({ parentId: queryParentId });
            }
        }
        return () => {
            dispatch(getPersonAC(null))
        }
    }, [id, queryParentId, dispatch, form]) // Added dependencies

    useEffect(() => {
        if (personFind) {
            const {firstName, lastName, parentId, dateOfBirth, address, phoneNumber, sex, parentType} = personFind
            form.setFieldsValue({
                firstName, 
                lastName, 
                parentId,
                dateOfBirth: dateOfBirth ? moment(dateOfBirth) : null,
                address,
                phoneNumber,
                sex,
                parentType
            })
        }
    }, [personFind, form]) // Added dependencies

    return <>
        <MenuApp/>
        <div className={style.formWrap}>
            <div className={style.container}>
                <h1 className={style.formTitle}>{id ? 'Edit Person' : 'Add New Person'}</h1>
                <Form form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} layout="vertical">
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{required: true, message: "First Name is required"}]}
                    >
                        <Input size={"large"} placeholder="Enter first name"/>
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{required: true, message: "Last Name is required"}]}
                    >
                        <Input size={"large"} placeholder="Enter last name"/>
                    </Form.Item>

                    {queryChildId ? (
                        <Form.Item
                            name="relationshipRole"
                            label="Relationship to Child"
                            rules={[{required: true, message: "Please select relationship"}]}
                        >
                            <Select 
                                size="large" 
                                placeholder="Select relationship"
                                onChange={handleRelationshipChange}
                            >
                                <Option value="father">Father (Biological)</Option>
                                <Option value="mother">Mother (Biological)</Option>
                                <Option value="stepfather">Stepfather (Otchim)</Option>
                                <Option value="stepmother">Stepmother (Machikha)</Option>
                            </Select>
                        </Form.Item>
                    ) : (
                         <Form.Item
                            name="sex"
                            label="Sex"
                            rules={[{required: true, message: "Sex is required"}]}
                        >
                            <Select size="large" placeholder="Select sex">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                            </Select>
                        </Form.Item>
                    )}

                    {/* Hidden fields to store derived values */}
                    <Form.Item name="sex" hidden><Input /></Form.Item>
                    <Form.Item name="parentType" hidden><Input /></Form.Item>

                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth (Optional)"
                    >
                        <DatePicker 
                            size={"large"} 
                            placeholder="Select date of birth"
                            style={{width: '100%'}}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number (Optional)"
                    >
                        <Input size={"large"} placeholder="Enter phone number"/>
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Address (Optional)"
                    >
                        <Input.TextArea 
                            size={"large"} 
                            placeholder="Enter address"
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item
                        name="parentId"
                        label="Parent (Optional)"
                    >
                        <Select
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                return (option!.children as unknown as string[]).join("").toLowerCase().includes(input.toLowerCase())
                            }}
                            placeholder="Select a parent"
                            size={"large"}
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
                    <Form.Item style={{marginTop: 32, marginBottom: 0}}>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            size="large"
                            block
                        >
                            {id ? 'Update Person' : 'Add Person'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>

    </>
}

export default AddPerson;

