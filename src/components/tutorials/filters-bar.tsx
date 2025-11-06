"use client";

import { Row, Col, Input, Select, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

interface FiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy?: string;
  onSortChange: (value: string) => void;
}

export default function FiltersBar({ search, onSearchChange, sortBy, onSortChange }: FiltersBarProps) {
  return (
    <Card style={{ borderRadius: 16, marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} sm={16} md={18}>
          <Search
            placeholder="Search tutorials"
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="search-tutorials"
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            size="large"
            style={{ width: '100%' }}
            placeholder="Sort by"
            value={sortBy || 'date'}
            onChange={onSortChange}
            aria-label="sort-tutorials"
          >
            <Option value="date">Newest first</Option>
            <Option value="title">Alphabetical</Option>
            <Option value="author">Author</Option>
          </Select>
        </Col>
      </Row>
    </Card>
  );
}


