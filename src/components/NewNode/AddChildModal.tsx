import React from 'react';
import {Modal, Form, Input, Select, DatePicker, Button} from 'antd';
import {DataTreeResponseType, TreeCollectionType} from '../../api/treeData/type';
import {useAppDispatch} from '../../hooks/reducer';
import {postPersonTC, updatePersonTC} from '../../reducers/treeReducer';

const {Option} = Select;

interface AddChildModalProps {
    visible: boolean;
    parentNode: DataTreeResponseType | null;
    onClose: () => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({visible, parentNode, onClose}) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        if (!parentNode) return;

        const {firstName, lastName, dateOfBirth, address, phoneNumber, sex} = values;
        
        const newPerson: TreeCollectionType = {
            childrenId: null,
            dateOfBirth: dateOfBirth ? dateOfBirth.format('YYYY-MM-DD') : null,
            firstName,
            lastName,
            parentId: parentNode._id,
            sex: sex || null,
            spouseId: null,
            address: address || null,
            phoneNumber: phoneNumber || null,
            parentType: 'biological'
        };

        const result = await dispatch(postPersonTC(newPerson));
        if (result) {
            // Update parent's childrenId to point to the new child
            const parentUpdate: TreeCollectionType = {
                firstName: parentNode.firstName,
                lastName: parentNode.lastName,
                parentId: parentNode.parentId,
                childrenId: result._id,
                sex: parentNode.sex,
                dateOfBirth: parentNode.dateOfBirth,
                spouseId: parentNode.spouseId,
                address: parentNode.address,
                phoneNumber: parentNode.phoneNumber,
                parentType: parentNode.parentType
            };
            await dispatch(updatePersonTC(parentNode._id, parentUpdate));

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
            title={`Add Child to ${parentNode?.firstName} ${parentNode?.lastName}`}
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
                    name="sex"
                    label="Sex"
                    rules={[{required: true, message: "Sex is required"}]}
                >
                    <Select size="large" placeholder="Select sex">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                    </Select>
                </Form.Item>

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
                        Add Child
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

