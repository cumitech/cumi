"use client";

import { Row, Col } from "antd";
import TutorialItem from "@components/tutorials/tutorial-item";

interface TutorialsGridProps {
  tutorials: any[];
  subcategories: any[];
  users: any[];
}

export default function TutorialsGrid({
  tutorials,
  subcategories,
  users,
}: TutorialsGridProps) {
  return (
    <Row gutter={[20, 20]}>
      {tutorials.map((tutorial) => (
        <Col key={tutorial.id} xs={24} sm={24} md={24} lg={24} xl={12}>
          <TutorialItem
            tutorial={tutorial}
            subcategories={subcategories}
            users={users}
          />
        </Col>
      ))}
    </Row>
  );
}
