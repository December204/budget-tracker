import axiosInstance from 'lib/axiosInstance';

const getTransactions = (params: TransactionFilters): Promise<TransactionListResponse> =>
  axiosInstance.get('/transactions', { params });

const createTransaction = (body: CreateTransactionBody): Promise<{ data: Transaction }> =>
  axiosInstance.post('/transactions', body);

const updateTransaction = ({
  id,
  ...body
}: { id: string } & UpdateTransactionBody): Promise<{ data: Transaction }> =>
  axiosInstance.patch(`/transactions/${id}`, body);

const deleteTransaction = (id: string): Promise<void> =>
  axiosInstance.delete(`/transactions/${id}`);

const transactionService = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

export default transactionService;
