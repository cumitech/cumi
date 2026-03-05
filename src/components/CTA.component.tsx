import {
  ArrowRightOutlined,
  MailOutlined,
  RocketOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useTranslation } from "@contexts/translation.context";
import { Button, Card, Space, Typography, Row, Col } from "antd";
import { motion } from "framer-motion";
import React from "react";

const { Title, Paragraph, Text } = Typography;

export const AppCTA = () => {
  const { t } = useTranslation();
  return (
    <section
      className="cta-wrapper"
      style={{
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
      }}
    >
       <div className="container bg-none">
         <Card
           bordered={false}
           className="cta-gradient-card"
           style={{
             borderRadius: "24px",
             background:
               "linear-gradient(135deg, #16a34a 0%, #0d9488 50%, #0284c7 100%)",
             position: "relative",
             overflow: "hidden",
             border: "none",
             boxShadow: "0 20px 60px rgba(34, 197, 94, 0.25)",
           }}
           // styles={{ body: { padding: 0 } }}
         >
          {}
          <div
            style={{
              position: "absolute",
              top: "-150px",
              right: "-150px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-120px",
              left: "-120px",
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

{}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "20%",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(245, 158, 11, 0.15)",
              filter: "blur(80px)",
              animation: "float 6s ease-in-out infinite",
            }}
          />

<Row
            gutter={[48, 48]}
            align="middle"
            style={{ position: "relative", zIndex: 1 }}
          >
            {}
            <Col xs={24} lg={14} style={{ padding: "60px 40px" }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 20px",
                    background: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "30px",
                    marginBottom: "28px",
                    border: "1.5px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RocketOutlined
                      style={{ color: "#22C55E", fontSize: "14px" }}
                    />
                  </div>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: "15px",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {t("projects.lets_work_together")}
                  </Text>
                </div>

<Title
                  level={2}
                  style={{
                    color: "white",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 800,
                    marginBottom: "24px",
                    lineHeight: 1.15,
                    textShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {t("projects.ready_to_start")}
                </Title>

<Paragraph
                  style={{
                    color: "rgba(255, 255, 255, 0.98)",
                    fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                    lineHeight: 1.75,
                    marginBottom: "36px",
                    maxWidth: "600px",
                    fontWeight: 400,
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {t("projects.start_description")}
                </Paragraph>

<Space size="large" wrap>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    href="https://wa.me/237681289411"
                    target="_blank"
                    style={{
                      background: "white",
                      color: "#16a34a",
                      border: "none",
                      fontWeight: 700,
                      height: "56px",
                      padding: "0 36px",
                      borderRadius: "14px",
                      fontSize: "16px",
                      letterSpacing: "0.3px",
                      boxShadow:
                        "0 8px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-4px) scale(1.02)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(0, 0, 0, 0.3)";
                      e.currentTarget.style.background = "#f0fdf4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    {t("projects.start_project")}
                  </Button>

<Button
                    size="large"
                    icon={<MailOutlined />}
                    href="mailto:info@cumi.dev"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      border: "2px solid rgba(255, 255, 255, 0.4)",
                      fontWeight: 700,
                      height: "56px",
                      padding: "0 36px",
                      borderRadius: "14px",
                      fontSize: "16px",
                      letterSpacing: "0.3px",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-4px) scale(1.02)";
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.95)";
                      e.currentTarget.style.color = "#16a34a";
                      e.currentTarget.style.borderColor = "white";
                      e.currentTarget.style.boxShadow =
                        "0 8px 30px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.4)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 16px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    {t("projects.get_quote")}
                  </Button>
                </Space>
              </motion.div>
            </Col>

{}
            <Col xs={24} lg={10} style={{ padding: "40px" }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Row gutter={[20, 20]}>
                  {[
                    {
                      icon: <RocketOutlined />,
                      title: "Fast Delivery",
                      desc: "From concept to launch",
                      color: "#22C55E",
                    },
                    {
                      icon: <PhoneOutlined />,
                      title: "Direct Support",
                      desc: "We work with you",
                      color: "#14B8A6",
                    },
                    {
                      icon: <MailOutlined />,
                      title: "Solutions That Scale",
                      desc: "Small business to enterprise",
                      color: "#0EA5E9",
                    },
                  ].map((item, index) => (
                    <Col xs={24} key={index}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div
                          style={{
                            padding: "24px",
                            background: "rgba(255, 255, 255, 0.18)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "18px",
                            border: "1.5px solid rgba(255, 255, 255, 0.3)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.95)";
                            e.currentTarget.style.transform =
                              "translateX(8px) scale(1.02)";
                            e.currentTarget.style.borderColor = "white";
                            e.currentTarget.style.boxShadow =
                              "0 12px 36px rgba(0, 0, 0, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.18)";
                            e.currentTarget.style.transform =
                              "translateX(0) scale(1)";
                            e.currentTarget.style.borderColor =
                              "rgba(255, 255, 255, 0.3)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 24px rgba(0, 0, 0, 0.12)";
                          }}
                        >
                          <Space align="center" size="large">
                            <div
                              style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "14px",
                                background: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "26px",
                                color: item.color,
                                boxShadow: `0 4px 16px ${item.color}40`,
                                transition: "transform 0.3s ease",
                              }}
                            >
                              {item.icon}
                            </div>
                            <div>
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: "17px",
                                  fontWeight: 700,
                                  display: "block",
                                  marginBottom: "6px",
                                  letterSpacing: "0.3px",
                                }}
                              >
                                {item.title}
                              </Text>
                              <Text
                                style={{
                                  color: "rgba(255, 255, 255, 0.9)",
                                  fontSize: "14px",
                                  fontWeight: 500,
                                }}
                              >
                                {item.desc}
                              </Text>
                            </div>
                          </Space>
                        </div>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            </Col>
          </Row>
        </Card>
      </div>

{}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(30px, -30px);
          }
          66% {
            transform: translate(-20px, 20px);
          }
        }
      `}</style>
    </section>
  );
};
