"use client";

import React from "react";
import { Input, Select, Row, Col, Space, Button } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

interface FilterOption {
  value: string;
  label: string;
}

interface SearchAndFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: {
    label: string;
    key: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    placeholder?: string;
  }[];
  onClearFilters?: () => void;
  showClearButton?: boolean;
  className?: string;
  resultsCount?: number;
  resultsLabel?: string;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onClearFilters,
  showClearButton = true,
  className = "",
  resultsCount,
  resultsLabel = "results",
}) => {
  const handleClearFilters = () => {
    onSearchChange("");
    filters.forEach((filter) => filter.onChange(""));
    onClearFilters?.();
  };

return (
    <div className={`mb-4 ${className}`}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12}>
          <Search
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onSearch={onSearchChange}
            enterButton={<SearchOutlined />}
            style={{ height: "44px" }}
            allowClear
            size="large"
          />
        </Col>

{filters.length > 0 && (
          <Col xs={24} md={12}>
            <Space wrap>
              {filters.map((filter) => (
                <Select
                  key={filter.key}
                  placeholder={
                    filter.placeholder || `Filter by ${filter.label}`
                  }
                  value={filter.value}
                  onChange={filter.onChange}
                  style={{ minWidth: 150, height: "44px" }}
                  allowClear
                  size="large"
                >
                  {filter.options.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              ))}

{showClearButton && (
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClearFilters}
                  size="large"
                >
                  Clear Filters
                </Button>
              )}
            </Space>
          </Col>
        )}
      </Row>

{resultsCount !== undefined && (
        <div style={{ marginTop: "12px", textAlign: "right" }}>
          <span style={{ color: "#666", fontSize: "14px" }}>
            {resultsCount} {resultsLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilterBar;
