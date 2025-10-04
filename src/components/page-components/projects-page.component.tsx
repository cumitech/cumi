"use client";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import ProjectCard from "@components/project/ProjectCard";
import { projectAPI } from "@store/api/project_api";
import {
  Col,
  Empty,
  Layout,
  Row,
  Spin,
  Typography,
  Card,
  Space,
  Tag,
  Statistic,
} from "antd";
import { motion } from "framer-motion";
import styles from "@app/projects/project-card.module.css";
import {
  RocketOutlined,
  CodeOutlined,
  GlobalOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useTranslation } from "@contexts/translation.context";
import { AppCTA } from "@components/CTA.component";
import { NonBlockingLoader } from "@components/shared";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function ProjectsPageComponent() {
  const { t } = useTranslation();

  const {
    data: projects,
    isLoading: isLoadingEvent,
    isFetching: isFetchEvent,
  } = projectAPI.useFetchAllProjectsQuery(1);

  const loading = isLoadingEvent || isFetchEvent;

  const stats = [
    {
      title: t("about.projects_completed"),
      value: projects?.length || 0,
      icon: <TrophyOutlined />,
    },
    {
      title: t("projects.technologies_master"),
      value: "15+",
      icon: <CodeOutlined />,
    },
    { title: t("about.happy_clients"), value: "50+", icon: <RocketOutlined /> },
    {
      title: t("about.years_experience"),
      value: "5+",
      icon: <GlobalOutlined />,
    },
  ];

  const technologies = [
    "JavaScript",
    "PHP",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "MySQL",
    "GraphQL",
    "Python",
    "REST API",
    "UI/UX Design",
    "Laravel",
  ];

  return (
    <NonBlockingLoader loading={loading}>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      {!loading && (
        <>
          <BannerComponent
            breadcrumbs={[{ label: t("nav.projects"), uri: "projects" }]}
            pageTitle={t("nav.projects")}
          />
          {}
          <section className="py-5 my-5">
            <div className="container">
              <Row gutter={[24, 24]} justify="center">
                {stats.map((stat, index) => (
                  <Col xs={12} sm={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="text-center border-0 shadow-sm h-100">
                        <div
                          className="text-primary mb-3"
                          style={{ fontSize: "2rem" }}
                        >
                          {stat.icon}
                        </div>
                        <Statistic
                          title={stat.title}
                          value={stat.value}
                          valueStyle={{
                            color: "#1890ff",
                            fontSize: "2rem",
                            fontWeight: "bold",
                          }}
                        />
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          {}
          <section className="py-5 my-5">
            <div className="container">
              <Row justify="center" className="mb-4">
                <Col xs={24} lg={16} className="text-center">
                  <Title level={2} className="mb-3">
                    {t("projects.technologies_master")}
                  </Title>
                  <Paragraph className="fs-5 text-muted">
                    {t("projects.tech_description")}
                  </Paragraph>
                </Col>
              </Row>
              <Row justify="center">
                <Col xs={24} lg={18}>
                  <div className="text-center">
                    <Space wrap size="large">
                      {technologies.map((tech, index) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Tag
                            color="blue"
                            className="px-3 py-2 fs-6"
                            style={{ borderRadius: "20px", fontSize: "1rem" }}
                          >
                            {tech}
                          </Tag>
                        </motion.div>
                      ))}
                    </Space>
                  </div>
                </Col>
              </Row>
            </div>
          </section>

          {}
          <Content className="container py-5">
            <Row justify="center" className="mb-5">
              <Col xs={24} lg={16} className="text-center">
                <Title level={2} className="mb-3">
                  <span className={styles.glow}>
                    {t("projects.featured_projects")}
                  </span>
                </Title>
                <Paragraph className="fs-5 text-muted">
                  {t("projects.featured_description")}
                </Paragraph>
              </Col>
            </Row>

            {projects && projects.length > 0 ? (
              <Row gutter={[24, 24]} justify="center">
                {projects?.map((project, index) => (
                  <Col xs={24} sm={12} lg={8} key={project.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProjectCard
                        project={project}
                        index={index}
                        styles={styles}
                      />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row justify="center">
                <Col span={24}>
                  <Card className="text-center border-0 shadow-sm">
                    <Empty
                      description={t("projects.no_projects")}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </Content>

          <AppCTA />
          <AppFooter logoPath="/" />
          <AppFootnote />
        </>
      )}
    </NonBlockingLoader>
  );
}
