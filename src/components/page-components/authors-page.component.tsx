"use client";

import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import { userAPI } from "@store/api/user_api";
import { Row, Col, Layout, Empty, Spin, Card, Avatar, Typography, Button } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function AuthorsPageComponent() {
  const {
    data: users,
    error,
    isLoading,
    isFetching,
  } = userAPI.useFetchAllUsersQuery(1);

const loading = isLoading || isFetching;

return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        {}
        <AppNav logoPath="/" />
      </div>

{loading ? (
        <div style={{ minHeight: "65vh", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
          <Card style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>Loading authors...</div>
          </Card>
        </div>
      ) : (
        <>
      {}
      <BannerComponent
        breadcrumbs={[
          { label: "Authors", uri: "authors" },
        ]}
        pageTitle="Our Authors"
      />

<div id="page-content" className="container mb-5">
        {error && <h1>Something wrong...</h1>}

<Content>
          {(isLoading || isFetching) && (
            <motion.div
              className="box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SpinnerList />
            </motion.div>
          )}

<div className="row justify-content-center">
            <div className="col-12">
              <motion.div
                className="box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-5">
                  <Title level={2}>Meet Our Expert Authors</Title>
                  <Paragraph className="fs-5 text-muted">
                    Discover the talented writers and technology experts behind our insightful articles
                  </Paragraph>
                </div>
              </motion.div>
            </div>
          </div>

{users && users.length ? (
            <Row gutter={[24, 24]}>
              {users?.map((user, index) => (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  lg={{ span: 6 }}
                  key={user.id}
                >
                  <motion.div
                    className="box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      hoverable
                      className="h-100 text-center"
                      cover={
                        <div className="p-4">
                          <Avatar
                            size={80}
                            className="mb-3"
                          >
                            {user.username?.charAt(0).toUpperCase()}
                          </Avatar>
                        </div>
                      }
                      actions={[
                        <Link key="profile" href={`/authors/${user.username}`}>
                          <Button type="primary" ghost>
                            View Profile
                          </Button>
                        </Link>
                      ]}
                    >
                      <Card.Meta
                        title={
                          <Title level={4} className="mb-2">
                            {user.username}
                          </Title>
                        }
                        description={
                          <div>
                            <Paragraph className="text-muted mb-2">
                              Technology enthusiast and content creator
                            </Paragraph>
                            {user.email && (
                              <small className="text-muted d-block">
                                {user.email}
                              </small>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          ) : (
            <Col span={24}>
              <div className="empty-wrap">
                <Empty description="No authors found" />
              </div>
            </Col>
          )}
        </Content>
      </div>

<AppFooter logoPath="/" />
      <AppFootnote />
        </>
      )}
    </>
  );
}
