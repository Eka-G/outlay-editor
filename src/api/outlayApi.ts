import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_ID, UNEXISTING_ROW_ID } from '@/shared/constants';
import type {
  OutlayRow,
  OutlayAllRowsResponse,
  OutlayRowResponse,
  OutlayRowWithParentId,
  OutlayRowWithChild,
} from '@/shared/types';

import { makeEmptyRow } from './outlayApi.service';

export const outlayApi = createApi({
  reducerPath: 'outlayApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `http://185.244.172.108:8081/v1/outlay-rows/entity/${API_ID}/`,
  }),
  endpoints: (builder) => ({
    getAllRows: builder.query<OutlayAllRowsResponse, void>({
      query: () => 'row/list',
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

            const addRowToTree = (
              allRows: OutlayRowWithChild[]
            ): OutlayRowWithChild[] => {
              return allRows.map((rowFromStore) => {
                if (rowFromStore.id === parentId) {
                  return {
                    ...rowFromStore,
                    child: [...(rowFromStore.child || []), emptyRow],
                  };
                }

                if (rowFromStore.child && rowFromStore.child.length > 0) {
                  return {
                    ...rowFromStore,
                    child: addRowToTree(
                      rowFromStore.child as OutlayRowWithChild[]
                    ),
                  };
                }

                return { ...rowFromStore };
              });
            };

            return addRowToTree(draft);
          })
        );
      },
    }),
    deleteEmptyRow: builder.mutation<void, { parentId: number | null }>({
      queryFn: () => ({ data: undefined }),
      async onQueryStarted({ parentId }, { dispatch }) {
        dispatch(
          outlayApi.util.updateQueryData('getAllRows', undefined, (draft) => {
            const deleteRowFromTree = (
              allRows: OutlayRowWithChild[]
            ): OutlayRowWithChild[] => {
              return allRows.map((row) => {
                if (row.id === parentId) {
                  return {
                    ...row,
                    child: row.child && row.child.length > 0
                      ? row.child.slice(0, -1)
                      : [],
                  };
                }

                return {
                  ...row,
                  child: row.child && row.child.length > 0
                    ? deleteRowFromTree(row.child as OutlayRowWithChild[])
                    : [],
                };
              });
            };

            return deleteRowFromTree(draft);
          })
        );
      },
    }),
    createRow: builder.mutation<OutlayRowResponse, OutlayRowWithParentId>({
      query: (row) => ({
        url: 'row/create',
        method: 'POST',
        body: row,
      }),

      async onQueryStarted(newRow, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { current: currentResponceRow, changed: changedResponceRows },
          } = await queryFulfilled;

          dispatch(
            outlayApi.util.updateQueryData('getAllRows', undefined, (draft) => {
              const addRowToTree = (
                allRows: OutlayRowWithChild[]
              ): OutlayRowWithChild[] => {
                if (!currentResponceRow) {
                  return allRows;
                }

                return allRows.map((rowFromStore) => {
                  const rowToUpdate = changedResponceRows.find(
                    (responceRow) => responceRow.id === rowFromStore.id
                  );

                  if (rowFromStore.id === newRow.parentId) {
                    return {
                      ...rowFromStore,
                      child: [
                        ...(rowFromStore.child?.filter(
                          (childRow) => childRow.id !== UNEXISTING_ROW_ID
                        ) || []),
                        { ...currentResponceRow, child: [] },
                      ],
                    } as OutlayRowWithChild;
                  }

                  if (rowToUpdate) {
                    return {
                      ...rowFromStore,
                      ...rowToUpdate,
                    };
                  }

                  return { ...rowFromStore };
                });
              };

              return addRowToTree(draft);
            })
          );
        } catch {
          //TODO: handle error
        }
      },
    }),
    updateRow: builder.mutation<OutlayRowResponse, OutlayRow>({
      query: (row) => ({
        url: `row/${row.id}/update`,
        method: 'POST',
        body: row,
      }),

      async onQueryStarted(newRow, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { current: currentResponceRow, changed: changedResponceRows },
          } = await queryFulfilled;

          dispatch(
            outlayApi.util.updateQueryData('getAllRows', undefined, (draft) => {
              const updateRowTree = (
                allRows: OutlayRowWithChild[]
              ): OutlayRowWithChild[] => {
                return allRows.map((row) => {
                  if (row.id === currentResponceRow?.id) {
                    return {
                      ...row,
                      ...currentResponceRow,
                    } as OutlayRowWithChild;
                  }

                  const rowToUpdate = changedResponceRows.find(
                    (responceRow) => responceRow.id === row.id
                  );

                  if (rowToUpdate) {
                    return {
                      ...(rowToUpdate as OutlayRowWithChild),
                      child: row.child?.length
                        ? updateRowTree(row.child as OutlayRowWithChild[])
                        : [],
                    };
                  }

                  return { ...row };
                });
              };

              return updateRowTree(draft);
            })
          );
        } catch {
          //TODO: handle error
        }
      },
    }),
    deleteRow: builder.mutation<OutlayRowResponse, number>({
      query: (id) => ({
        url: `row/${id}/delete`,
        method: 'DELETE',
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { changed: changedResponceRows },
          } = await queryFulfilled;

          dispatch(
            outlayApi.util.updateQueryData('getAllRows', undefined, (draft) => {
              const deleteRowFromTree = (
                allRows: OutlayRowWithChild[]
              ): OutlayRowWithChild[] => {
                return allRows
                  .filter((row) => row.id !== id)
                  .map((row) => {
                    const rowToUpdate = changedResponceRows.find(
                      (responceRow) => responceRow.id === row.id
                    );
                    if (rowToUpdate) {
                      return {
                        ...(rowToUpdate as OutlayRowWithChild),
                        child: row.child?.length
                          ? deleteRowFromTree(row.child as OutlayRowWithChild[])
                          : [],
                      };
                    }

                    return { ...row };
                  });
              };

              return deleteRowFromTree(draft);
            })
          );
        } catch {
          //TODO: handle error
        }
      },
    }),
  }),
});

export const {
  useGetAllRowsQuery,
  useAddEmptyRowMutation,
  useDeleteEmptyRowMutation,
  useCreateRowMutation,
  useUpdateRowMutation,
  useDeleteRowMutation,
} = outlayApi;
