type Category = {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
};

type CategoryListResponse = {
  data: Category[];
  meta: {
    total: number;
  };
};
