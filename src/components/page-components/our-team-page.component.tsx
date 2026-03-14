"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Typography, Avatar, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useTranslation } from "@contexts/translation.context";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import BannerComponent from "@components/banner/banner.component";

const { Title, Paragraph } = Typography;

interface ITeamMember {
  id: string;
  fullName: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
  order: number;
}

export default function OurTeamPageComponent() {
  const { t } = useTranslation();
  const [members, setMembers] = useState<ITeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team-members")
      .then((res) => res.json())
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <BannerComponent
        pageTitle={t("nav.our_team")}
        breadcrumbs={[
          { label: t("nav.welcome"), uri: "/" },
          { label: t("nav.our_team"), uri: "/our-team" },
        ]}
      />

      <section style={{ padding: "60px 0", minHeight: "60vh" }}>
        <div className="container">
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
              <Spin size="large" />
            </div>
          ) : !members.length ? (
            <Empty description="No team members yet." style={{ padding: "48px 0" }} />
          ) : (
            <Row gutter={[24, 24]}>
              {members.map((member) => (
                <Col xs={24} sm={12} md={8} lg={6} key={member.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                    }}
                    styles={{ body: { padding: "24px" } }}
                  >
                    {member.imageUrl ? (
                      <div style={{ marginBottom: 16, borderRadius: "50%", overflow: "hidden", width: 120, height: 120, margin: "0 auto 16px" }}>
                        <Image
                          src={member.imageUrl}
                          alt={member.fullName}
                          width={120}
                          height={120}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <Avatar
                        size={120}
                        icon={<UserOutlined />}
                        style={{ marginBottom: 16, backgroundColor: "#22C55E", fontSize: 48 }}
                      />
                    )}
                    <Title level={5} style={{ marginBottom: 4 }}>
                      {member.fullName}
                    </Title>
                    {member.role && (
                      <Paragraph type="secondary" style={{ marginBottom: 8, fontSize: "0.9rem" }}>
                        {member.role}
                      </Paragraph>
                    )}
                    {member.bio && (
                      <Paragraph style={{ margin: 0, fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5 }}>
                        {member.bio.length > 120 ? `${member.bio.slice(0, 120)}...` : member.bio}
                      </Paragraph>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
