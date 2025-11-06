"use client";
import { useState } from "react";
import { Col, Empty, Layout, Row, Spin, Card, Typography, Input, Select, Space, Pagination, Skeleton } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
// Switched to REST API for tutorials entity
import { SortPostsType } from "@domain/models/shared/sort.model";
import TutorialsHeader from "@components/tutorials/tutorials-header";
import FiltersBar from "@components/tutorials/filters-bar";
import TutorialsGrid from "@components/tutorials/tutorials-grid";
import { userAPI } from "@store/api/user_api";
import { tutorialAPI } from "@store/api/tutorial_api";
import {
  SearchOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { 
  PageLayout, 
} from "@components/shared";
import { useTranslation } from "@contexts/translation.context";
import Breadcrumb from "@components/breadcrumb/breadcrumb.component";
import TutorialCategories from "@components/tutorials/tutorial-categories";
import { useSearchParams } from "next/navigation";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function TutorialsPageComponent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortPostsType>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // RTK Query for tutorials
  const { data: tutorialsApiData = [], isLoading, isFetching, error: apiError } = tutorialAPI.useFetchAllTutorialsQuery({
    searchTitle,
    sortBy: sortOrder as any,
    page: currentPage,
    limit: pageSize,
  });

  // Filter posts by category "tutorials"
  // Data already filtered by API to tutorials entity
  const allTutorials = tutorialsApiData || [];

  // Get unique tutorial subcategories
  const tutorialSubcategories = Array.from(new Set(
    allTutorials.map((tutorial: any) => tutorial.Subcategory?.id).filter(Boolean)
  ));
  
  // Fetch all tutorial subcategories
  const { data: allSubcategories = [] } = tutorialAPI.useFetchSubcategoriesQuery();
  
  // Get subcategories that have tutorials
  const subcategoriesWithTutorials = allSubcategories.filter((subcat: any) =>
    tutorialSubcategories.includes(subcat.id)
  );

  // Active subcategory from query (id or slug)
  const activeSubcategoryId = searchParams.get('subcategoryId') || undefined;
  const activeSubcategorySlug = searchParams.get('subcategory') || undefined;

  // Apply search and sort filters
  let filteredTutorials = allTutorials;
  
  if (searchTitle) {
    filteredTutorials = filteredTutorials.filter((post: any) =>
      post.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTitle.toLowerCase())
    );
  }

  if (sortOrder) {
    filteredTutorials = [...filteredTutorials].sort((a: any, b: any) => {
      switch (sortOrder) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return (a.authorName || a.author?.name || '').localeCompare(b.authorName || b.author?.name || '');
        default:
          return 0;
      }
    });
  }

  // Apply pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTutorials = filteredTutorials.slice(startIndex, endIndex);

  const {
    data: users,
    isLoading: isLoadingUser,
    isFetching: isFetchUser,
  } = userAPI.useFetchAllUsersQuery(1);

  const loading = isLoadingUser || isFetchUser;

  return (
    <PageLayout
      showBanner={true}
      bannerTitle={t('tutorials.title')}
      bannerBreadcrumbs={[{ label: t('tutorials.breadcrumb'), uri: "tutorials" }]}
    >
      {/* SEO Breadcrumb */}
      <div className="container py-3">
        <Breadcrumb 
          items={[
            { label: t('nav.welcome'), href: '/' },
            { label: t('tutorials.breadcrumb'), href: '/tutorials' }
          ]}
        />
      </div>

      <div className="container py-5 mb-5">
        {apiError && <h1>{t('tutorials.something_wrong')}</h1>}

        {loading ? (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} style={{ borderRadius: '16px' }}>
                    <Skeleton active avatar paragraph={{ rows: 3 }} />
                  </Card>
                ))}
              </Space>
            </Col>
            <Col xs={24} lg={8}>
              <Card style={{ borderRadius: '16px' }}>
                <Skeleton active paragraph={{ rows: 6 }} />
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TutorialsHeader />

              <FiltersBar 
                search={searchTitle}
                onSearchChange={setSearchTitle}
                sortBy={sortOrder as any}
                onSortChange={(v) => setSortOrder(v as SortPostsType)}
              />

              {/* Tutorials List */}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  {paginatedTutorials.length === 0 ? (
                    <Card style={{ borderRadius: '16px', textAlign: 'center', padding: '60px 20px' }}>
                      <Empty
                        description={t('tutorials.no_tutorials_title')}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      >
                        <Text type="secondary">
                          {searchTitle ? t('tutorials.no_tutorials_desc') : t('tutorials.no_tutorials_desc')}
                        </Text>
                      </Empty>
                    </Card>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TutorialsGrid tutorials={paginatedTutorials} subcategories={allSubcategories} users={users || []} />
                      </motion.div>

                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                        <Pagination 
                          current={currentPage}
                          pageSize={pageSize}
                          total={filteredTutorials.length}
                          showSizeChanger
                          onChange={(page, size) => { setCurrentPage(page); setPageSize(size); }}
                          aria-label="tutorials-pagination"
                        />
                      </div>
                    </>
                  )}
                </Col>

                <Col xs={24} lg={8}>
                  <TutorialCategories 
                    subcategories={subcategoriesWithTutorials}
                    allTutorials={allTutorials}
                    title={t('tutorials.topics_covered')}
                    activeSubcategoryId={activeSubcategoryId}
                    activeSubcategorySlug={activeSubcategorySlug}
                  />
                </Col>
              </Row>
            </motion.div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

