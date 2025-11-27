import React from 'react';
import {Modal, Form, Input, Select, DatePicker, Button} from 'antd';
import {DataTreeResponseType, TreeCollectionType} from '../../api/treeData/type';
import {useAppDispatch} from '../../hooks/reducer';
import {postPersonTC, updatePersonTC} from '../../reducers/treeReducer';

const {Option} = Select;

interface AddSpouseModalProps {
    visible: boolean;
    personNode: DataTreeResponseType | null;
    onClose: () => void;
}

export const AddSpouseModal: React.FC<AddSpouseModalProps> = ({visible, personNode, onClose}) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        if (!personNode) return;

        const {firstName, lastName, dateOfBirth, address, phoneNumber, sex} = values;
        
        // Spouse should have the same parentId as their partner so they appear at the same level
        const newSpouse: TreeCollectionType = {
            childrenId: null,
            dateOfBirth: dateOfBirth ? dateOfBirth.format('YYYY-MM-DD') : null,
            firstName,
            lastName,
            parentId: personNode.parentId, // Same parent as their spouse
            sex: sex || null,
            spouseId: personNode._id,
            address: address || null,
            phoneNumber: phoneNumber || null,
            parentType: 'biological'
        };

        const result = await dispatch(postPersonTC(newSpouse));
        if (result) {
            // Update the existing person to point to the new spouse
            const personUpdate: TreeCollectionType = {
                firstName: personNode.firstName,
                lastName: personNode.lastName,
                parentId: personNode.parentId,
                childrenId: personNode.childrenId,
                sex: personNode.sex,
                dateOfBirth: personNode.dateOfBirth,
                spouseId: result._id,
                address: personNode.address,
                phoneNumber: personNode.phoneNumber,
                parentType: personNode.parentType
            };
            await dispatch(updatePersonTC(personNode._id, personUpdate));
            
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
            title={`Add Spouse to ${personNode?.firstName} ${personNode?.lastName}`}
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
                        Add Spouse
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

