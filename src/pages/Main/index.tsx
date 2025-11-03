import React, { useState, useMemo } from 'react';
import { Table, Button, Input, Space, Modal, Form, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface DramaItem {
  key: string;
  name: string;
  group: string;
  remark?: string;
  creator: string;
  createTime: string;
}

const MyComponent: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DramaItem[]>([
  ]);

  const [searchName, setSearchName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<DramaItem | null>(null);

  // 搜索结果
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.name.includes(searchName)
    );
  }, [data, searchName]);

  // 表格列定义
  const columns: ColumnsType<DramaItem> = [
    { title: '名称', dataIndex: 'name' },
    { title: '组别', dataIndex: 'group' },
    { title: '备注', dataIndex: 'remark' },
    { title: '创建人', dataIndex: 'creator' },
    { title: '创建时间', dataIndex: 'createTime' },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>修改</Button>
          <Button type="link" danger onClick={() => onDelete(record.key)}>删除</Button>
        </Space>
      ),
    },
  ];

  // 打开编辑或新增弹窗
  const onEdit = (record?: DramaItem) => {
    setEditingItem(record || null);
    setIsModalVisible(true);
    form.setFieldsValue(record || { name: '', group: '', remark: '' });
  };

  // 删除
  const onDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除此条记录？',
      onOk: () => {
        setData(prev => prev.filter(item => item.key !== key));
        message.success('删除成功');
      },
    });
  };

  // 保存（新增或修改）
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        // 修改
        setData(prev =>
          prev.map(item =>
            item.key === editingItem.key
              ? { ...item, ...values }
              : item
          )
        );
        message.success('修改成功');
      } else {
        // 新增
        const newItem: DramaItem = {
          key: Date.now().toString(),
          name: values.name,
          group: values.group,
          remark: values.remark,
          creator: '当前用户',
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        setData(prev => [newItem, ...prev]);
        message.success('新增成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  // 重置搜索
  const handleReset = () => {
    setSearchName('');
  };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="请输入名称"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary">搜索</Button>
        <Button onClick={handleReset}>重置</Button>
        <Button type="primary" onClick={() => onEdit()}>新增</Button>
      </Space>

      <Table
        dataSource={filteredData}
        columns={columns}
        bordered
        rowKey="key"
      />

      <Modal
        title={editingItem ? '修改记录' : '新增记录'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="保存"
        cancelText="取消"
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
