"use client";

import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
  RefreshButton,
} from "@refinedev/antd";
import {
  Table,
  Space,
  Card,
  Typography,
  Tag,
  Button,
  Input,
  Select,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@contexts/translation.context";

const { Title } = Typography;
const { Option } = Select;

export default function MetaManagementList() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("");

  const { tableProps, searchFormProps, filters, sorters } = useTable({
    resource: "meta-data",
    sorters: {
      initial: [
        {
          field: "updatedAt",
          order: "desc",
        },
      ],
    },
    onSearch: (values: any) => {
      return [
        {
          field: "page",
          operator: "contains",
          value: values.page,
        },
        {
          field: "title",
          operator: "contains",
          value: values.title,
        },
      ];
    },
    meta: {
      populate: "*",
    },
  });

  // Debug logging
  useEffect(() => {}, [tableProps]);

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Typography.Text strong style={{ color: "#1890ff" }}>
          {index + 1}
        </Typography.Text>
      ),
    },
    {
      title: t("meta_management.page_url"),
      dataIndex: "page",
      key: "page",
      sorter: true,
      width: "15rem",
      render: (text: string) => <Typography.Text code>{text}</Typography.Text>,
    },
    {
      title: t("meta_management.title_field"),
      dataIndex: "title",
      key: "title",
      sorter: true,
      render: (text: string) => (
        <Typography.Text ellipsis={{ tooltip: text }}>{text}</Typography.Text>
      ),
    },
    {
      title: t("meta_management.schema_type"),
      dataIndex: "schemaType",
      key: "schemaType",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: t("meta_management.robots_meta_tag"),
      dataIndex: "robots",
      key: "robots",
      render: (text: string) => {
        const isIndexed = text.includes("index");
        const isFollowed = text.includes("follow");
        return (
          <Space>
            <Tag color={isIndexed ? "green" : "red"}>
              {isIndexed ? "Index" : "No Index"}
            </Tag>
            <Tag color={isFollowed ? "green" : "red"}>
              {isFollowed ? "Follow" : "No Follow"}
            </Tag>
          </Space>
        );
      },
    },
    // {
    //   title: t("meta_management.updated"),
    //   dataIndex: "updatedAt",
    //   key: "updatedAt",
    //   sorter: true,
    //   render: (text: string) => (
    //     <Typography.Text type="secondary">
    //       {new Date(text).toLocaleDateString()}
    //     </Typography.Text>
    //   ),
    // },
    {
      title: t("common.actions"),
      key: "actions",
      render: (_: any, record: any) => {
        return (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <ShowButton hideText size="small" recordItemId={record.id} />
            <DeleteButton
              hideText
              size="small"
              recordItemId={record.id}
              confirmTitle={t("meta_management.are_you_sure_delete")}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <List
      title={t("meta_management.title")}
      headerButtons={[
        <CreateButton key="create" />,
        <RefreshButton key="refresh" />,
      ]}
    >
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder={t("meta_management.search_by_page_or_title")}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              placeholder={t("meta_management.filter_by_type")}
              value={filterType}
              onChange={setFilterType}
              style={{ width: 150 }}
              allowClear
              size="large"
            >
              <Option value="WebPage">{t("meta_management.webpage")}</Option>
              <Option value="Article">{t("meta_management.article")}</Option>
              <Option value="BlogPosting">
                {t("meta_management.blog_posting")}
              </Option>
              <Option value="Product">{t("meta_management.product")}</Option>
              <Option value="Service">{t("meta_management.service")}</Option>
              <Option value="Course">{t("meta_management.course")}</Option>
              <Option value="Event">{t("meta_management.event")}</Option>
            </Select>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={() => {
                searchFormProps.form?.submit();
              }}
            >
              {t("meta_management.apply_filters")}
            </Button>
          </Space>
        </div>

        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>
    </List>
  );
}
