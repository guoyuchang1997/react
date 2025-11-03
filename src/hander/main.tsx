import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  getUserInfo,
  addUser,
  updateUser,
  deleteUser,
} from '../api/user';

interface UserItem {
  id: string;
  name: string;
  group: string;
  remark?: string;
  creator: string;
  createTime: string;
}

const MyComponent: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<UserItem | null>(null);

  /** ✅ 查询接口（统一刷新用） */
  const fetchList = async (keyword = '') => {
    try {
      setLoading(true);
      const res = await getUserInfo({ keyword });
      if (res.code === 200) {
        setData(res.data || []);
      } else {
        message.error(res.message || '查询失败');
      }
    } catch (error) {
      console.error(error);
      message.error('接口请求失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /** ✅ 搜索 */
  const handleSearch = () => {
    fetchList(searchName);
  };

  /** ✅ 重置 */
  const handleReset = () => {
    setSearchName('');
    fetchList('');
  };

  /** ✅ 新增或修改提交 */
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      let res;
      if (editingItem) {
        // 修改接口
        res = await updateUser({ id: editingItem.id, ...values });
      } else {
        // 新增接口
        res = await addUser(values);
      }

      if (res.code === 200) {
        message.success(editingItem ? '修改成功' : '新增成功');
        setIsModalVisible(false);
        form.resetFields();
        setEditingItem(null);
        fetchList(searchName); // ✅ 操作成功后重新请求列表
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /** ✅ 删除 */
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除该条记录？',
      onOk: async () => {
        const res = await deleteUser(id);
        if (res.code === 200) {
          message.success('删除成功');
          fetchList(searchName);
        } else {
          message.error(res.message || '删除失败');
        }
      },
    });
  };

  /** ✅ 打开新增/编辑弹窗 */
  const openModal = (record?: UserItem) => {
    if (record) {
      setEditingItem(record);
      form.setFieldsValue(record);
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  /** ✅ 表格列 */
  const columns: ColumnsType<UserItem> = [
    { title: '名称', dataIndex: 'name' },
    { title: '组别', dataIndex: 'group' },
    { title: '备注', dataIndex: 'remark' },
    { title: '创建人', dataIndex: 'creator' },
    { title: '创建时间', dataIndex: 'createTime' },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>修改</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 搜索区域 */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="请输入名称"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={handleSearch}>搜索</Button>
        <Button onClick={handleReset}>重置</Button>
        <Button type="primary" onClick={() => openModal()}>新增</Button>
      </Space>

      {/* 数据表格 */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
        bordered
      />

      {/* 新增 / 编辑弹窗 */}
      <Modal
        title={editingItem ? '修改记录' : '新增记录'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="group"
            label="组别"
            rules={[{ required: true, message: '请输入组别' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyComponent;
