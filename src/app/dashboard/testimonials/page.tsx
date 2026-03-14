"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import { Space, Table } from "antd";

export default function TestimonialList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray(tableProps?.dataSource) ? tableProps.dataSource : [],
  };

  return (
    <>
      <PageBreadCrumbs items={["Testimonials", "List"]} />
      <List>
        <Table {...safeTableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title="ID"
            render={(_: any, _record: any, index: number) =>
              format.twoChar((index + 1).toString())
            }
          />
          <Table.Column
            dataIndex="quote"
            title="Quote"
            ellipsis
            render={(val: string) => (val?.length > 60 ? `${val.slice(0, 60)}...` : val)}
          />
          <Table.Column dataIndex="authorName" title="Author" />
          <Table.Column dataIndex="authorRole" title="Role" />
          <Table.Column dataIndex="order" title="Order" width={80} />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_: any, record: BaseRecord) => (
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
