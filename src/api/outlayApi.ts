import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ID, UNEXISTING_ROW_ID } from "@/shared/constants";
import type {
  OutlayRow,
  OutlayAllRowsResponse,
  OutlayRowResponse,
  OutlayRowWithParentId,
  OutlayRowWithChild,
} from "@/shared/types";
import { makeEmptyRow } from "./outlayApi.service";

export const outlayApi = createApi({
  reducerPath: "outlayApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://185.244.172.108:8081/v1/outlay-rows/entity/${API_ID}/`,
  }),
  endpoints: (builder) => ({
    getAllRows: builder.query<OutlayAllRowsResponse, void>({
      query: () => "row/list",
    }),
    addEmptyRow: builder.mutation<void, { parentId: number | null }>({
      queryFn: () => ({ data: undefined }),
      async onQueryStarted({ parentId }, { dispatch }) {
        dispatch(
          outlayApi.util.updateQueryData('getAllRows', undefined, (draft) => {
            const emptyRow: OutlayRowWithChild = makeEmptyRow();

            if (parentId === null) {
              draft.push(emptyRow);

              return draft;
            }

            const addRowToTree = (allRows: OutlayRowWithChild[]): OutlayRowWithChild[] => {
              return allRows.map(rowFromStore => {
                if (rowFromStore.id === parentId) {
                  return {
                    ...rowFromStore,
                    child: [...(rowFromStore.child || []), emptyRow]
                  };
                }

                if (rowFromStore.child && rowFromStore.child.length > 0) {
                  return {
                    ...rowFromStore,
                    child: addRowToTree(rowFromStore.child as OutlayRowWithChild[])
                  };
                }

                return {...rowFromStore};
              });
            };

            return addRowToTree(draft);
          })
        );
      }
    }),
    createRow: builder.mutation<OutlayRowResponse, OutlayRowWithParentId>({
      query: (row) => ({
        url: "row/create",
        method: "POST",
        body: row,
      }),

      async onQueryStarted(newRow, { dispatch, queryFulfilled }) {
        try {
          const { data: { current: currentResponceRow, changed: changedResponceRows } } = await queryFulfilled;

          dispatch(
          outlayApi.util.updateQueryData('getAllRows', undefined, (draft) => {
            const addRowToTree = (allRows: OutlayRowWithChild[]): OutlayRowWithChild[] => {
              if (!currentResponceRow || !newRow) {
                return allRows;
              }

              return allRows.map(rowFromStore => {
                const rowToUpdate = changedResponceRows.find((responceRow) => responceRow.id === rowFromStore.id);

                if (rowFromStore.id === newRow.parentId) {
                  return {
                    ...rowFromStore,
                    child: [...(rowFromStore.child?.filter((childRow) => childRow.id !== UNEXISTING_ROW_ID) || []), {...newRow, child: []}]
                  } as OutlayRowWithChild;
                }

                if (rowToUpdate) {
                  return {
                    ...rowFromStore,
                    ...rowToUpdate,
                  };
                }

                return {...rowFromStore};
              });
            };

            return addRowToTree(draft);
          })
        );
        } catch {
          //TODO: handle error
        }
      }
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
  useAddEmptyRowMutation,
  useCreateRowMutation,
  useUpdateRowMutation,
  useDeleteRowMutation,
} = outlayApi;
