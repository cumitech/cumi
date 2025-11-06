"use client";
import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Tag, Typography } from "antd";
import Link from "next/link";

const { Title } = Typography;

export default function AdminTutorialsListPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tutorials?limit=100");
      const json = await res.json();
      setData(json?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    { title: "Subcategory", dataIndex: ["Subcategory", "name"], key: "subcategory" },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag>{s}</Tag> },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Link href={`/dashboard/admin/tutorials/edit/${record.id}`}><Button>Edit</Button></Link>
          <Button danger onClick={async () => {
            await fetch(`/api/tutorials/${record.id}`, { method: 'DELETE' });
            load();
          }}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title={<Space><Title level={4} style={{ margin: 0 }}>Tutorials</Title><Link href="/dashboard/admin/tutorials/create"><Button type="primary">Create</Button></Link></Space>}>
      <Table rowKey="id" loading={loading} dataSource={data} columns={columns} pagination={false} />
    </Card>
  );
}


