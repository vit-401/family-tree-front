import React, {useState} from 'react';
import {Modal, Form, Input, Select, DatePicker, Button} from 'antd';
import {DataTreeResponseType, TreeCollectionType} from '../../api/treeData/type';
import {useAppDispatch} from '../../hooks/reducer';
import {postPersonTC, updatePersonTC} from '../../reducers/treeReducer';
import {useSelector} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {InitialStateTreeType} from '../../reducers/treeReducer';

const {Option} = Select;

interface AddParentModalProps {
    visible: boolean;
    childNode: DataTreeResponseType | null;
    onClose: () => void;
}

export const AddParentModal: React.FC<AddParentModalProps> = ({visible, childNode, onClose}) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const {dataState} = useSelector<AppRootStateType, InitialStateTreeType>(state => state.tree);

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

    const handleSubmit = async (values: any) => {
        if (!childNode) return;

        const {firstName, lastName, dateOfBirth, address, phoneNumber, sex, parentType} = values;
        
        // Check if child already has a parent
        let initialSpouseId = null;
        if (childNode.parentId) {
            // Child has a parent, so this new person is the spouse of that parent
            initialSpouseId = childNode.parentId;
        }

        const newPerson: TreeCollectionType = {
            childrenId: childNode ? childNode._id : null,
            dateOfBirth: dateOfBirth ? dateOfBirth.format('YYYY-MM-DD') : null,
            firstName,
            lastName,
            parentId: null,
            sex: sex || null,
            spouseId: initialSpouseId,
            address: address || null,
            phoneNumber: phoneNumber || null,
            parentType: parentType || 'biological'
        };

        const result = await dispatch(postPersonTC(newPerson));
        if (result) {
            // If child has an existing parent, update them to link to new spouse
            if (childNode.parentId) {
                const existingParent = dataState.find(p => p._id === childNode.parentId);
                if (existingParent) {
                    const parentUpdate: TreeCollectionType = {
                        firstName: existingParent.firstName,
                        lastName: existingParent.lastName,
                        parentId: existingParent.parentId,
                        childrenId: existingParent.childrenId,
                        sex: existingParent.sex,
                        dateOfBirth: existingParent.dateOfBirth,
                        spouseId: result._id,
                        address: existingParent.address,
                        phoneNumber: existingParent.phoneNumber,
                        parentType: existingParent.parentType
                    };
                    await dispatch(updatePersonTC(existingParent._id, parentUpdate));
                }
            } else {
                // Child has no parent, set this as the first parent
                const childUpdate: TreeCollectionType = {
                    firstName: childNode.firstName,
                    lastName: childNode.lastName,
                    parentId: result._id,
                    childrenId: childNode.childrenId,
                    sex: childNode.sex,
                    dateOfBirth: childNode.dateOfBirth,
                    spouseId: childNode.spouseId,
                    address: childNode.address,
                    phoneNumber: childNode.phoneNumber,
                    parentType: childNode.parentType
                };
                await dispatch(updatePersonTC(childNode._id, childUpdate));
            }

            form.resetFields();
            onClose();
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={`Add Parent to ${childNode?.firstName} ${childNode?.lastName}`}
            visible={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnClose
        >
            <Form 
                form={form} 
                onFinish={handleSubmit}
                layout="vertical"
                style={{ marginTop: 24 }}
            >
                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{required: true, message: "First Name is required"}]}
                >
                    <Input size="large" placeholder="Enter first name"/>
                </Form.Item>
                
                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{required: true, message: "Last Name is required"}]}
                >
                    <Input size="large" placeholder="Enter last name"/>
                </Form.Item>

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

                {/* Hidden fields to store derived values */}
                <Form.Item name="sex" hidden><Input /></Form.Item>
                <Form.Item name="parentType" hidden><Input /></Form.Item>

                <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth (Optional)"
                >
                    <DatePicker 
                        size="large" 
                        placeholder="Select date of birth"
                        style={{width: '100%'}}
                        format="YYYY-MM-DD"
                    />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Phone Number (Optional)"
                >
                    <Input size="large" placeholder="Enter phone number"/>
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Address (Optional)"
                >
                    <Input.TextArea 
                        size="large" 
                        placeholder="Enter address"
                        rows={3}
                    />
                </Form.Item>

                <Form.Item style={{marginTop: 32, marginBottom: 0}}>
                    <Button 
                        type="primary" 
                        htmlType="submit"
                        size="large"
                        block
                    >
                        Add Parent
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

