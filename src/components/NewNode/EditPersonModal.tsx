import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Select, DatePicker, Button, Popconfirm, Divider} from 'antd';
import {DataTreeResponseType, TreeCollectionType} from '../../api/treeData/type';
import moment from 'moment';
import {useAppDispatch} from '../../hooks/reducer';
import {updatePersonTC} from '../../reducers/treeReducer';
import {useSelector} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {InitialStateTreeType} from '../../reducers/treeReducer';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';

const {Option} = Select;

interface EditPersonModalProps {
    visible: boolean;
    node: DataTreeResponseType | null;
    onClose: () => void;
}

export const EditPersonModal: React.FC<EditPersonModalProps> = ({visible, node, onClose}) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const {dataState} = useSelector<AppRootStateType, InitialStateTreeType>(state => state.tree);
    const [editingSpouse, setEditingSpouse] = useState(false);

    useEffect(() => {
        if (node && visible && !editingSpouse) {
            form.setFieldsValue({
                firstName: node.firstName,
                lastName: node.lastName,
                sex: node.sex,
                dateOfBirth: node.dateOfBirth ? moment(node.dateOfBirth) : null,
                phoneNumber: node.phoneNumber || '',
                address: node.address || '',
                parentId: node.parentId || undefined,
                parentType: node.parentType || 'biological'
            });
        }
    }, [node, visible, form, editingSpouse]);

    const handleSubmit = async (values: any) => {
        if (!node) return;

        const {firstName, lastName, dateOfBirth, address, phoneNumber, sex, parentId, parentType} = values;
        
        const updatedPerson: TreeCollectionType = {
            childrenId: null,
            dateOfBirth: dateOfBirth ? dateOfBirth.format('YYYY-MM-DD') : null,
            firstName,
            lastName,
            parentId: parentId || null,
            sex: sex || null,
            spouseId: node.spouseId,
            address: address || null,
            phoneNumber: phoneNumber || null,
            parentType: parentType || 'biological'
        };

        const result = await dispatch(updatePersonTC(node._id, updatedPerson));
        if (result) {
            form.resetFields();
            onClose();
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setEditingSpouse(false);
        onClose();
    };

    const handleDeleteSpouse = async () => {
        if (!node || !node.spouseId) return;

        const spouse = dataState.find(p => p._id === node.spouseId);
        
        // Remove spouse relationship from both persons
        await dispatch(updatePersonTC(node._id, {
            ...node,
            spouseId: null
        }));

        if (spouse) {
            await dispatch(updatePersonTC(spouse._id, {
                ...spouse,
                spouseId: null
            }));
        }

        form.resetFields();
        onClose();
    };

    const handleEditSpouse = () => {
        setEditingSpouse(true);
        // Populate form with spouse data
        const spouse = dataState.find(p => p._id === node?.spouseId);
        if (spouse) {
            form.setFieldsValue({
                firstName: spouse.firstName,
                lastName: spouse.lastName,
                sex: spouse.sex,
                dateOfBirth: spouse.dateOfBirth ? moment(spouse.dateOfBirth) : null,
                phoneNumber: spouse.phoneNumber || '',
                address: spouse.address || '',
                parentId: spouse.parentId || undefined,
                parentType: spouse.parentType || 'biological'
            });
        }
    };

    const handleSubmitSpouseEdit = async (values: any) => {
        if (!node || !node.spouseId) return;

        const {firstName, lastName, dateOfBirth, address, phoneNumber, sex, parentId, parentType} = values;
        
        const spouse = dataState.find(p => p._id === node.spouseId);
        if (!spouse) return;

        const updatedSpouse: TreeCollectionType = {
            childrenId: null,
            dateOfBirth: dateOfBirth ? dateOfBirth.format('YYYY-MM-DD') : null,
            firstName,
            lastName,
            parentId: parentId || null,
            sex: sex || null,
            spouseId: spouse.spouseId,
            address: address || null,
            phoneNumber: phoneNumber || null,
            parentType: parentType || 'biological'
        };

        const result = await dispatch(updatePersonTC(node.spouseId, updatedSpouse));
        if (result) {
            setEditingSpouse(false);
            form.resetFields();
            onClose();
        }
    };

    const spouse = node?.spouseId ? dataState.find(p => p._id === node.spouseId) : null;

    return (
        <Modal
            title={editingSpouse ? "Edit Spouse" : "Edit Person"}
            visible={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnClose
        >
            {!editingSpouse && spouse && (
                <>
                    <div style={{ 
                        background: '#f8fafc', 
                        padding: '16px', 
                        borderRadius: '8px',
                        marginTop: '16px',
                        marginBottom: '16px'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center' 
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                                    Spouse
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                                    {spouse.firstName} {spouse.lastName}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button 
                                    icon={<EditOutlined />}
                                    onClick={handleEditSpouse}
                                    size="small"
                                >
                                    Edit
                                </Button>
                                <Popconfirm
                                    title="Are you sure you want to remove this spouse relationship?"
                                    onConfirm={handleDeleteSpouse}
                                    okText="Yes, Remove"
                                    cancelText="Cancel"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button 
                                        icon={<DeleteOutlined />}
                                        danger
                                        size="small"
                                    >
                                        Remove
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </div>
                    <Divider style={{ marginTop: '8px', marginBottom: '16px' }} />
                </>
            )}
            
            <Form 
                form={form} 
                onFinish={editingSpouse ? handleSubmitSpouseEdit : handleSubmit}
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
                        size="large"
                    >
                        {dataState
                            .sort((a, b) => a.firstName.localeCompare(b.firstName))
                            .filter(n => n._id !== node?._id)
                            .map(n => (
                                <Option key={n._id} value={n._id}>
                                    {n.firstName} {n.lastName}
                                </Option>
                            ))
                        }
                    </Select>
                </Form.Item>

                <Form.Item style={{marginTop: 32, marginBottom: 0}}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {editingSpouse && (
                            <Button 
                                size="large"
                                onClick={() => {
                                    setEditingSpouse(false);
                                }}
                                style={{ flex: 1 }}
                            >
                                Back to Person
                            </Button>
                        )}
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            size="large"
                            style={{ flex: 1 }}
                        >
                            {editingSpouse ? 'Update Spouse' : 'Update Person'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

