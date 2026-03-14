"use client";
import BannerComponent from "@components/banner/banner.component";
import TagContainer from "@components/blog_post/containers/tag";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { postAPI } from "@store/api/post_api";
import { tagAPI } from "@store/api/tag_api";
import { Spin, Card } from "antd";

export default function TagsPageComponent() {
  const {
    data: postsResponse,
    error,
    isLoading,
    isFetching,
  } = postAPI.useFetchAllPostsQuery({});

const posts = postsResponse || [];

const {
    data: tags,
    isLoading: isLoadingTag,
    isFetching: isFetchTag,
  } = tagAPI.useFetchAllTagsQuery(1);

const loading = isLoading || isFetching || isLoadingTag || isFetchTag;

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
            <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>Loading tags...</div>
          </Card>
        </div>
      ) : (
        <>
      {}
      <BannerComponent
        breadcrumbs={[{ label: "Tags", uri: "tags" }]}
        pageTitle="Tags"
      />

<div id="page-content">
        <TagContainer
          posts={isLoading || isFetching ? [] : posts}
          tags={isLoadingTag || isFetchTag ? [] : tags}
        />
      </div>

<AppFooter logoPath="/" />
      <AppFootnote />
        </>
      )}
    </>
  );
}
