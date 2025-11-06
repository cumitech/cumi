import { baseAPI } from "./base-api";

export const tutorialAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    fetchAllTutorials: build.query<any[], { searchTitle?: string; sortBy?: string; page?: number; limit?: number; authorId?: string; subcategoryId?: string } | void>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params?.searchTitle) sp.set('searchTitle', params.searchTitle);
        if (params?.sortBy) sp.set('sortBy', params.sortBy);
        if (params?.page) sp.set('page', String(params.page));
        if (params?.limit) sp.set('limit', String(params.limit));
        if (params?.authorId) sp.set('authorId', params.authorId);
        if (params?.subcategoryId) sp.set('subcategoryId', params.subcategoryId);
        const qs = sp.toString();
        return `/tutorials${qs ? `?${qs}` : ''}`;
      },
      providesTags: ["Tutorial"],
      transformResponse: (response: any) => response?.data || [],
    }),

    getTutorialById: build.query<any, string>({
      query: (id) => `/tutorials/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Tutorial", id }],
      transformResponse: (response: any) => response?.data,
    }),

    getTutorialBySlug: build.query<any, string>({
      query: (slug) => `/tutorials/slugs/${slug}`,
      providesTags: ["Tutorial"],
      transformResponse: (response: any) => response?.data,
    }),

    createTutorial: build.mutation<any, any>({
      query: (body) => ({ url: `/tutorials`, method: 'POST', body }),
      invalidatesTags: ["Tutorial"],
      transformResponse: (response: any) => response?.data,
    }),

    updateTutorial: build.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/tutorials/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_res, _err, arg) => [{ type: "Tutorial", id: arg.id }],
      transformResponse: (response: any) => response?.data,
    }),

    deleteTutorial: build.mutation<any, string>({
      query: (id) => ({ url: `/tutorials/${id}`, method: 'DELETE' }),
      invalidatesTags: ["Tutorial"],
    }),

    fetchSubcategories: build.query<any[], void>({
      query: () => `/tutorials/subcategories`,
      providesTags: ["TutorialSubcategory"],
      transformResponse: (response: any) => response?.data || [],
    }),

    createSubcategory: build.mutation<any, any>({
      query: (body) => ({ url: `/tutorials/subcategories`, method: 'POST', body }),
      invalidatesTags: ["TutorialSubcategory"],
      transformResponse: (response: any) => response?.data,
    }),

    updateSubcategory: build.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/tutorials/subcategories/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_res, _err, arg) => [{ type: "TutorialSubcategory", id: arg.id }],
      transformResponse: (response: any) => response?.data,
    }),

    deleteSubcategory: build.mutation<any, string>({
      query: (id) => ({ url: `/tutorials/subcategories/${id}`, method: 'DELETE' }),
      invalidatesTags: ["TutorialSubcategory"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchAllTutorialsQuery,
  useGetTutorialByIdQuery,
  useGetTutorialBySlugQuery,
  useCreateTutorialMutation,
  useUpdateTutorialMutation,
  useDeleteTutorialMutation,
  useFetchSubcategoriesQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = tutorialAPI;


