type TransactionType = 'income' | 'expense';

type Transaction = {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

type TransactionMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type TransactionListResponse = {
  data: Transaction[];
  meta: TransactionMeta;
};

type TransactionFilters = {
  type?: TransactionType | '';
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

type CreateTransactionBody = {
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  note?: string;
};

type UpdateTransactionBody = Partial<CreateTransactionBody>;
