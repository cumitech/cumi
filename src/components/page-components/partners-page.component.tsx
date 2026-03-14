"use client";

import React, { useState } from "react";
import { Card, Row, Col, Spin, Typography, Button, Input, Empty } from "antd";
import { GlobalOutlined, PhoneOutlined, SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useTranslation } from "@contexts/translation.context";
import { useGetAllPartnersQuery } from "@store/api/partner_api";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import BannerComponent from "@components/banner/banner.component";

const { Title, Text, Paragraph } = Typography;

export default function PartnersPageComponent() {
  const { t } = useTranslation();
  const { data: partners = [], isLoading } = useGetAllPartnersQuery();
  const [searchTerm, setSearchTerm] = useState("");

// Filter partners based on search
  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

<BannerComponent 
        pageTitle={t('partners.page_title')} 
        breadcrumbs={[
          { label: t('nav.welcome'), uri: '/' },
          { label: t('partners.page_title'), uri: '/partners' }
        ]}
      />

<section id="page-content" style={{ padding: "60px 0", minHeight: "70vh" }}>
        <div className="container">
          {}
          <div style={{ maxWidth: "600px", margin: "0 auto 48px" }}>
            <Input
              size="large"
              placeholder={t('partners.search_placeholder')}
              prefix={<SearchOutlined style={{ color: "#20b2aa", fontSize: "18px" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: "50px",
                padding: "12px 24px",
                fontSize: "16px",
                border: "2px solid #e8e8e8",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#20b2aa";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(32,178,170,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e8e8e8";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
              }}
            />
          </div>

{}
          {isLoading ? (
            <div
              style={{
                minHeight: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin size="large" tip={t('common.loading')} />
            </div>
          ) : filteredPartners.length === 0 ? (
            <Empty
              description={
                searchTerm ? t('partners.no_results') : t('partners.no_partners')
              }
              style={{ margin: "80px 0" }}
            />
          ) : (
            <Row gutter={[32, 32]}>
              {filteredPartners.map((partner) => (
                <Col key={partner.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: "20px",
                      border: "2px solid #f0f0f0",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      overflow: "hidden",
                      background: "white",
                      height: "100%",
                    }}
                    styles={{
                      body: {
                        padding: "32px 24px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        minHeight: "420px",
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(32,178,170,0.2)";
                      e.currentTarget.style.borderColor = "#20b2aa";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                      e.currentTarget.style.borderColor = "#f0f0f0";
                    }}
                  >
                    {}
                    <div
                      style={{
                        width: "140px",
                        height: "140px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                        border: "4px solid #20b2aa",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 4px 16px rgba(32,178,170,0.15)",
                      }}
                    >
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            padding: "8px",
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/favicon.svg";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            fontSize: "48px",
                            fontWeight: "700",
                            color: "#20b2aa",
                          }}
                        >
                          {partner.name.charAt(0)}
                        </div>
                      )}
                    </div>

{}
                    <div style={{ textAlign: "center", width: "100%", flex: 1 }}>
                      <Title
                        level={4}
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#333",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {partner.name}
                      </Title>
                      <Text
                        style={{
                          fontSize: "13px",
                          color: "#999",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          fontWeight: "500",
                        }}
                      >
                        {partner.location}
                      </Text>
                      <Paragraph
                        ellipsis={{ rows: 3 }}
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          margin: "16px 0",
                          lineHeight: "1.7",
                          minHeight: "63px",
                        }}
                      >
                        {partner.description}
                      </Paragraph>
                    </div>

{}
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        width: "100%",
                        justifyContent: "center",
                        paddingTop: "12px",
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      {partner.websiteLink && (
                        <Button
                          type="primary"
                          icon={<GlobalOutlined />}
                          href={partner.websiteLink}
                          target="_blank"
                          shape="round"
                          style={{
                            background: "linear-gradient(135deg, #20b2aa 0%, #17a2b8 100%)",
                            border: "none",
                            color: "white",
                            fontWeight: "500",
                            fontSize: "13px",
                            height: "36px",
                            padding: "0 20px",
                            boxShadow: "0 2px 8px rgba(32,178,170,0.25)",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(32,178,170,0.35)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(32,178,170,0.25)";
                          }}
                        >
                          {t('partners.visit')}
                        </Button>
                      )}
                      {partner.contactPhone && (
                        <Button
                          icon={<PhoneOutlined />}
                          href={`tel:${partner.contactPhone}`}
                          shape="round"
                          style={{
                            border: "2px solid #e8e8e8",
                            color: "#666",
                            fontWeight: "500",
                            fontSize: "13px",
                            height: "36px",
                            padding: "0 20px",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#20b2aa";
                            e.currentTarget.style.color = "#20b2aa";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e8e8e8";
                            e.currentTarget.style.color = "#666";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          {t('partners.contact')}
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

{}
          {!isLoading && filteredPartners.length > 0 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "64px",
                padding: "32px",
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                borderRadius: "20px",
                border: "2px solid #20b2aa",
              }}
            >
              <Title level={3} style={{ margin: 0, color: "#20b2aa", fontWeight: "700" }}>
                {filteredPartners.length}
              </Title>
              <Text style={{ fontSize: "16px", color: "#666", fontWeight: "500" }}>
                {t('partners.total_partners')}
              </Text>
            </div>
          )}
        </div>
      </section>

<AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
