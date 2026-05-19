# Frontend — SKILLS.md

Hướng dẫn thêm từng loại thành phần mới vào dự án, dựa trên patterns hiện có.

---

## 1. Thêm Màn Hình (View)

**1. Tạo thư mục và file view** trong `src/views/`:

```typescript
// src/views/Expense/Expense.tsx
import { Container } from '@mui/material';

const Expense = () => {
  return (
    <Container>
      {/* nội dung màn hình */}
    </Container>
  );
};

export default Expense;
```

```typescript
// src/views/Expense/index.tsx
export { default } from './Expense';
```

**2. Thêm route** trong `src/routes/privateRoute.tsx`:

```typescript
import Expense from 'views/Expense';

// trong <Routes>:
<Route path='/expenses' element={<Expense />} />
```

**3. Thêm menu item** trong `src/containers/AppMenu.tsx` nếu cần.

---

## 2. Thêm API Service

**1. Tạo file service** trong `src/services/`:

```typescript
// src/services/expense.ts
import { client } from './axios';

const list = (params: { page?: number }): Promise<PaginatedResponse<Expense>> =>
  client.get('/expenses', { params });

const create = (body: CreateExpenseBody): Promise<Expense> =>
  client.post('/expenses', body);

const expenseService = { list, create };
export default expenseService;
```

**2. Export qua barrel** `src/services/index.ts`:

```typescript
export { default as expenseService } from './expense';
```

---

## 3. Dùng React Query để Fetch Dữ Liệu

**Query (GET):**

```typescript
import { useQuery } from '@tanstack/react-query';
import { expenseService } from 'services';

const { data, isLoading, isError } = useQuery(
  ['expenses', page],
  () => expenseService.list({ page }),
  { keepPreviousData: true },
);
```

**Mutation (POST/PUT/DELETE):**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from 'services';
import { enqueueSnackbar } from 'notistack';

const queryClient = useQueryClient();

const { mutate: createExpense, isLoading } = useMutation(expenseService.create, {
  onSuccess: () => {
    enqueueSnackbar('Tạo thành công');
    queryClient.invalidateQueries(['expenses']);
  },
});
```

> Dùng `queryClient.invalidateQueries` sau mutation để tự động refetch danh sách.

---

## 4. Thêm Redux Slice

Chỉ dùng Redux cho global UI state (auth, theme). Server state dùng React Query.

```typescript
// src/reducers/expenseSlice.ts
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

type ExpenseState = {
  selectedId: string | null;
};

export const expenseSlice = createSlice({
  name: 'expense',
  initialState: { selectedId: null } as ExpenseState,
  reducers: {
    selectExpense: (state, { payload }: PayloadAction<string>) => {
      state.selectedId = payload;
    },
    clearSelection: (state) => {
      state.selectedId = null;
    },
  },
});

export const { selectExpense, clearSelection } = expenseSlice.actions;
export const expenseSelector = ({ expense }: RootState) => expense;
```

**Đăng ký vào store** `src/reducers/store.ts`:

```typescript
import { expenseSlice } from './expenseSlice';

const rootReducer = combineReducers({
  [profileSlice.name]: profileSlice.reducer,
  [themeSlice.name]: themeSlice.reducer,
  [expenseSlice.name]: expenseSlice.reducer,  // thêm đây
});
```

**Dùng trong component:**

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { expenseSelector, selectExpense } from 'reducers/expenseSlice';

const { selectedId } = useSelector(expenseSelector);
const dispatch = useDispatch();
dispatch(selectExpense('abc123'));
```

---

## 5. Thêm Form với React Hook Form + MUI

Pattern chuẩn từ `LoginScreen`:

```typescript
import { Controller, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation } from '@tanstack/react-query';

type FormValues = {
  name: string;
  amount: number;
};

const ExpenseForm = () => {
  const { control, handleSubmit } = useForm<FormValues>({ mode: 'onChange' });

  const { mutate: create, isLoading } = useMutation(expenseService.create, {
    onSuccess: () => enqueueSnackbar('Đã tạo'),
  });

  const onSubmit = handleSubmit((values) => create(values));

  return (
    <form onSubmit={onSubmit}>
      <Controller
        name='name'
        control={control}
        rules={{ required: 'Bắt buộc' }}
        render={({ field, fieldState: { error } }) => (
          <TextField {...field} label='Tên' error={!!error} helperText={error?.message} fullWidth />
        )}
      />
      <LoadingButton type='submit' loading={isLoading} variant='contained'>
        Lưu
      </LoadingButton>
    </form>
  );
};
```

> Luôn dùng `Controller` thay vì `register` khi dùng cùng MUI — MUI components không hỗ trợ `ref` theo cách React Hook Form mong đợi.

---

## 6. Thêm Custom Hook

```typescript
// src/hooks/useExpenses.tsx
import { useQuery } from '@tanstack/react-query';
import { expenseService } from 'services';
import useSearch from './useSearch';

const useExpenses = () => {
  const [search, onSearchChange] = useSearch({ page: 1, size: 10 });

  const query = useQuery(
    ['expenses', search],
    () => expenseService.list(search as any),
    { keepPreviousData: true },
  );

  return { ...query, search, onSearchChange };
};

export default useExpenses;
```

**Export qua barrel** `src/hooks/index.tsx`:

```typescript
export { default as useExpenses } from './useExpenses';
```

**`useSearch` — hook phân trang/sắp xếp có sẵn:**

```typescript
const [search, onSearchChange] = useSearch({ page: 1, size: 20 });

// thay đổi filter:
onSearchChange({ searchText: 'ăn trưa' });
// tự động reset page về 1
```

---

## 7. Thêm Component Tái Sử Dụng

```typescript
// src/components/common/AmountDisplay.tsx
import { Typography } from '@mui/material';

type Props = {
  amount: number;
  currency?: string;
};

const AmountDisplay = ({ amount, currency = 'VND' }: Props) => (
  <Typography variant='body2'>
    {amount.toLocaleString('vi-VN')} {currency}
  </Typography>
);

export default AmountDisplay;
```

**Export qua barrel** `src/components/common/index.tsx`:

```typescript
export { default as AmountDisplay } from './AmountDisplay';
```

---

## 8. Hiển Thị Notification

```typescript
import { enqueueSnackbar } from 'notistack';

enqueueSnackbar('Thao tác thành công');                          // success (mặc định)
enqueueSnackbar('Có lỗi xảy ra', { variant: 'error' });
enqueueSnackbar('Đang xử lý', { variant: 'info' });
```

> `SnackbarProvider` đã được cấu hình trong `AppProvider` với `autoHideDuration: 3000` và hiển thị ở góc trên phải.

---

## 9. Thêm Type Definition

```typescript
// src/models/Expense.d.ts
type Expense = {
  _id: string;
  name: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

type CreateExpenseBody = Pick<Expense, 'name' | 'amount'>;

type ExpenseListResponse = PaginatedResponse<Expense>;
```
