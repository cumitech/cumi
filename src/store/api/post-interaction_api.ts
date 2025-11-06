import { baseAPI } from "./base-api";
import { IPostInteractionStats } from "@domain/models/post-interaction.model";

export const postInteractionAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getPostStats: build.query<IPostInteractionStats, { postId: string; userId?: string }>({
      query: ({ postId, userId }) => `/posts/interactions/stats?postId=${postId}&userId=${userId || ''}`,
      transformResponse: (response: any) => {
        // Handle the API response structure
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || { likesCount: 0, dislikesCount: 0, userInteraction: null };
      },
      providesTags: (result, error, { postId }) => [
        { type: "PostInteraction", id: postId },
        { type: "PostInteraction", id: "LIST" },
      ],
      keepUnusedDataFor: 90, // Cache for 90 seconds (interactions change frequently)
    }),
    handlePostInteraction: build.mutation<IPostInteractionStats, { postId: string; action: 'like' | 'dislike' }>({
      query: ({ postId, action }) => ({
        url: "/posts/interactions",
        method: "POST",
        body: { postId, action },
      }),
      transformResponse: (response: any) => {
        // Handle the API response structure
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || { likesCount: 0, dislikesCount: 0, userInteraction: null };
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "PostInteraction", id: postId },
        { type: "PostInteraction", id: "LIST" },
      ],
    }),
    getUserPostInteractions: build.query<any[], string>({
      query: (userId) => `/posts/interactions/user/${userId}`,
      transformResponse: (response: any) => {
        // Handle the API response structure
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result, error, userId) => [
        { type: "PostInteraction", id: userId },
        { type: "PostInteraction", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPostStatsQuery,
  useHandlePostInteractionMutation,
  useGetUserPostInteractionsQuery,
} = postInteractionAPI;

