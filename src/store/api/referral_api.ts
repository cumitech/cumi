import { baseAPI } from "./base-api";
import { IReferral } from "@domain/models/referral.model";

interface IReferralFilters {
  category?: string;
  featured?: boolean;
  limit?: number;
}

export const referralAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    fetchReferrals: build.query<IReferral[], IReferralFilters>({
      query: (filters = {}) => {
        const searchParams = new URLSearchParams();
        if (filters.category) searchParams.append('category', filters.category);
        if (filters.featured) searchParams.append('featured', 'true');
        if (filters.limit) searchParams.append('limit', filters.limit.toString());
        
        const queryString = searchParams.toString();
        return `/referrals${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: { success: boolean; data: IReferral[] }) => response.data,
      providesTags: (result) => ["Referral"],
    }),
    getSingleReferral: build.query<IReferral, string>({
      query: (referralId) => `/referrals/${referralId}`,
      providesTags: (result, error, referralId) => [{ type: "Referral", id: referralId }],
    }),
    createReferral: build.mutation<IReferral, Partial<IReferral>>({
      query: (referral) => ({
        url: '/referrals',
        method: 'POST',
        body: referral,
      }),
      invalidatesTags: ["Referral"],
    }),
    updateReferral: build.mutation<IReferral, { id: string; data: Partial<IReferral> }>({
      query: ({ id, data }) => ({
        url: `/referrals/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Referral", id }],
    }),
    deleteReferral: build.mutation<void, string>({
      query: (referralId) => ({
        url: `/referrals/${referralId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, referralId) => [{ type: "Referral", id: referralId }],
    }),
    trackReferralClick: build.mutation<void, { referralId: string; sessionId: string; referrer?: string }>({
      query: ({ referralId, sessionId, referrer }) => ({
        url: `/referrals/${referralId}/click`,
        method: 'POST',
        body: { sessionId, referrer },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchReferralsQuery,
  useGetSingleReferralQuery,
  useCreateReferralMutation,
  useUpdateReferralMutation,
  useDeleteReferralMutation,
  useTrackReferralClickMutation,
} = referralAPI;
