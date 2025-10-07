import React from "react";
import Image from "next/image";
import { Card, Tag, Tooltip, Typography, Button, Space, Avatar } from "antd";
import { IProject } from "@domain/models/project.model";
import Link from "next/link";
import { motion } from "framer-motion";

import { 
  GithubOutlined, 
  GlobalOutlined, 
  EyeOutlined,
  CalendarOutlined,
  TagOutlined
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
type Prop = {
  project: IProject;
  index: number;
  styles: any;
};

const colors = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1", "#13c2c2"];
const ProjectCard: React.FC<Prop> = ({ project, index, styles }) => {
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        hoverable
        cover={
          <div className="position-relative overflow-hidden" style={{ height: 250 }}>
            <Image
              alt={project.title}
              src={project.imageUrl}
              fill
              className={`card-img-top ${styles.projectImage}`}
              style={{ objectFit: 'cover' }}
            />
            <div className="position-absolute top-0 end-0 m-3">
              <Tag 
                color={colors[index % colors.length]} 
                className="text-uppercase fw-bold px-3 py-1"
                style={{ borderRadius: '15px' }}
              >
                {project.slug}
              </Tag>
            </div>
            <div className="position-absolute top-0 start-0 m-3">
              <Avatar 
                size="small" 
                style={{ 
                  backgroundColor: colors[index % colors.length],
                  color: 'white'
                }}
              >
                <TagOutlined />
              </Avatar>
            </div>
          </div>
        }
        className={`shadow-lg border-0 ${styles.projectCard}`}
        styles={{ 
          body: { padding: "1.5rem" },
          cover: { borderRadius: "16px 16px 0 0" }
        }}
        actions={[
          <Tooltip title="View Project Details" key="view">
            <Link href={`/projects/${project.slug}`}>
              <Button 
                type="text" 
                icon={<EyeOutlined />}
                className="text-primary"
              >
                View
              </Button>
            </Link>
          </Tooltip>,
          <Tooltip title="GitHub Repository" key="github">
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                type="text" 
                icon={<GithubOutlined />}
                className="text-dark"
              >
                Code
              </Button>
            </Link>
          </Tooltip>,
          <Tooltip title="Live Demo" key="demo">
            <Link
              href={project.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                type="text" 
                icon={<GlobalOutlined />}
                className="text-success"
              >
                Live
              </Button>
            </Link>
          </Tooltip>
        ]}
      >
        <div className="mb-3">
          <Title level={4} className={`${styles.projectTitle} mb-2`}>
            <Link href={`/projects/${project.slug}`} className={styles.projectTitleLink}>
              {project.title}
            </Link>
          </Title>
        </div>

<Paragraph 
          ellipsis={{ rows: 3 }}
          className="text-muted mb-4"
        >
          {project.description}
        </Paragraph>

<div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center text-muted">
            <CalendarOutlined className="me-2" />
            <Text type="secondary" className="small">
              {formatDate(project.createdAt)}
            </Text>
          </div>

<Link href={`/projects/${project.slug}`}>
            <Button 
              type="primary" 
              size="small"
              className="rounded-pill px-3"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
