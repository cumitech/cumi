"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function TeamMemberList() {
  const { tableProps } = useTable({ syncWithLocation: true });
  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray(tableProps?.dataSource) ? tableProps.dataSource : [],
  };

  return (
    <>
      <PageBreadCrumbs items={["Our team", "List"]} />
      <List>
        <Table {...safeTableProps} rowKey="id">
          <Table.Column dataIndex="fullName" title="Name" />
          <Table.Column dataIndex="role" title="Role" />
          <Table.Column
            dataIndex="bio"
            title="Bio"
            ellipsis
            render={(val: string) => (val?.length > 50 ? `${val.slice(0, 50)}...` : val)}
          />
          <Table.Column dataIndex="order" title="Order" width={80} />
          <Table.Column
            title="Actions"
            render={(_: unknown, record: BaseRecord) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>
    </>
  );
}
