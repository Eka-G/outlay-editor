import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ID } from "@/shared/constants";
import type {
  OutlayRow,
  OutlayAllRowsResponse,
  OutlayRowResponse,
  OutlayRowWithParentId,
} from "@/shared/types";

export const outlayApi = createApi({
  reducerPath: "outlayApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://185.244.172.108:8081/v1/outlay-rows/entity/${API_ID}/`,
  }),
  endpoints: (builder) => ({
    getAllRows: builder.query<OutlayAllRowsResponse, void>({
      query: () => "row/list",
    }),
    createRow: builder.mutation<OutlayRowResponse, OutlayRowWithParentId>({
      query: (row) => ({
        url: "row/create",
        method: "POST",
        body: row,
      }),
    }),
    updateRow: builder.mutation<OutlayRowResponse, OutlayRow>({
      query: (row) => ({
        url: `row/${row.id}/update`,
        method: "POST",
        body: row,
      }),
    }),
    deleteRow: builder.mutation<OutlayRowResponse, number>({
      query: (id) => ({
        url: `row/${id}/delete`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllRowsQuery,
  useCreateRowMutation,
  useUpdateRowMutation,
  useDeleteRowMutation,
} = outlayApi;
