"use client";
import BannerComponent from "@components/banner/banner.component";
import CategoryContainer from "@components/blog_post/containers/category";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { categoryAPI } from "@store/api/category_api";
import { postAPI } from "@store/api/post_api";
import { Spin, Card } from "antd";

export default function CategoriesPageComponent() {
  const {
    data: postsResponse,
    isLoading,
    isFetching,
  } = postAPI.useFetchAllPostsQuery({});

const posts = postsResponse || [];

const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchCategory,
  } = categoryAPI.useFetchAllCategoriesQuery(1);

const loading = isLoadingCategory || isFetchCategory || isLoading || isFetching;

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
            <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>Loading categories...</div>
          </Card>
        </div>
      ) : (
        <>
      {}
      <BannerComponent
        breadcrumbs={[{ label: "Categories", uri: "categories" }]}
        pageTitle="Categories"
      />

<div id="page-content">
        <CategoryContainer
          posts={isLoading || isFetching ? [] : posts}
          categories={isLoadingCategory || isFetchCategory ? [] : categories || []}
        />
      </div>

<AppFooter logoPath="/" />
      <AppFootnote />
        </>
      )}
    </>
  );
}
