
import React, { useState } from 'react';
import { Row, Col, Card, Form, Input, Button, Space, Tag, Select, Checkbox } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Component for key-value pairs (Features, Pros, Cons)
export const KeyValueList: React.FC<{
  value?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
  placeholder?: { key: string; value: string };
}> = ({ value = {}, onChange, placeholder = { key: 'Key', value: 'Value' } }) => {
  const entries = Object.entries(value);

  const handleAdd = () => {
    const newKey = `item_${Date.now()}`;
    onChange?.({ ...value, [newKey]: '' });
  };

  const handleRemove = (key: string) => {
    const newValue = { ...value };
    delete newValue[key];
    onChange?.(newValue);
  };

  const handleKeyChange = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const newValue = { ...value };
    newValue[newKey] = newValue[oldKey];
    delete newValue[oldKey];
    onChange?.(newValue);
  };

  const handleValueChange = (key: string, newVal: string) => {
    onChange?.({ ...value, [key]: newVal });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {entries.map(([key, val]) => (
        <Space key={key} style={{ width: '100%' }} align="start">
          <Input
            placeholder={placeholder.key}
            value={key}
            onChange={(e) => handleKeyChange(key, e.target.value)}
            style={{ width: 150 }}
          />
          <Input
            placeholder={placeholder.value}
            value={val}
            onChange={(e) => handleValueChange(key, e.target.value)}
            style={{ flex: 1 }}
          />
          <MinusCircleOutlined onClick={() => handleRemove(key)} style={{ color: '#ff4d4f' }} />
        </Space>
      ))}
      <Button type="dashed" onClick={handleAdd} icon={<PlusOutlined />} style={{ width: '100%' }}>
        Add Item
      </Button>
    </Space>
  );
};
