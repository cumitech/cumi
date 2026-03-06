"use client";

import PageBreadCrumbs from "../../../../components/shared/page-breadcrumb/page-breadcrumb.component";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, useCustom } from "@refinedev/core";
import { format } from "@utils/format";
import { Image, Space, Table } from "antd";

export default function CategoryList() {
  const { tableProps, tableQueryResult } = useTable({
    syncWithLocation: true,
  });

  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray(tableProps?.dataSource) ? tableProps.dataSource : [],
  };

  return (
    <>
      <PageBreadCrumbs items={["Banners", "Lists"]} />
      <List>
        <Table {...safeTableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title={"ID"}
            render={(value, record, index) =>
              format.twoChar((index + 1).toString())
            }
          />
          <Table.Column dataIndex="title" title={"Title"} />
          <Table.Column dataIndex="subTitle" title={"Description"} />
          <Table.Column
            dataIndex="image"
            title={"Image"}
            render={(value, record: any) => (
              <Image
                src={value}
                alt={record?.title}
                height={100}
                width={100}
              />
            )}
          />
          <Table.Column
            title={"Actions"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>
    </>
  );
}

