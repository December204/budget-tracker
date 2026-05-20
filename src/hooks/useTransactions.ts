import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { categoryService, transactionService } from 'services';

const TRANSACTIONS_KEY = 'transactions';
const CATEGORIES_KEY = 'categories';

export const useTransactionList = (filters: TransactionFilters) =>
  useQuery(
    [TRANSACTIONS_KEY, filters],
    () => transactionService.getTransactions(filters),
    { keepPreviousData: true },
  );

export const useCategoryList = () =>
  useQuery([CATEGORIES_KEY], categoryService.getCategories);

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation(transactionService.createTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries([TRANSACTIONS_KEY]);
      enqueueSnackbar('Thêm giao dịch thành công', { variant: 'success' });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation(transactionService.updateTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries([TRANSACTIONS_KEY]);
      enqueueSnackbar('Cập nhật giao dịch thành công', { variant: 'success' });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation(transactionService.deleteTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries([TRANSACTIONS_KEY]);
      enqueueSnackbar('Xóa giao dịch thành công', { variant: 'success' });
    },
  });
};
