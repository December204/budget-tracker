# Frontend Developer Guide

> React 18 · TypeScript · Vite · MUI v5 · Redux Toolkit · React Query

---

## Tech Stack

| Lớp | Công nghệ |
|---|---|
| Framework | React 18, TypeScript 4 |
| Build | Vite |
| UI | MUI v5 (Material UI) + Emotion |
| CSS | Tailwind CSS 3, SASS/SCSS |
| State | Redux Toolkit + redux-persist (localStorage) |
| Server state | TanStack React Query v4 |
| Routing | React Router DOM v6 |
| Form | React Hook Form v7 |
| HTTP | Axios (interceptor tự động gắn Bearer token) |
| Notifications | notistack |
| Date | Luxon |
| Number | react-number-format |

---

## Cấu trúc thư mục

```
src/
  assets/           # Hình ảnh, font, icon tĩnh
  components/       # UI nhỏ, tái sử dụng (common/)
  containers/       # AppProvider, AppTheme, AppMenu, AppHeader, AppHooks…
  hooks/            # Custom React hooks
  layouts/          # AuthLayout, PrivateLayout
  models/           # TypeScript type definitions (*.d.ts)
  reducers/         # Redux slices + store (profileSlice, themeSlice)
  routes/           # Route definitions
  services/         # axios client, auth API, queryClient
  styles/           # _vars.scss, _mui.scss, tailwind.css
  utils/            # Helper functions
  views/            # Màn hình (Auth, Home, Profile, Components…)
```

---

## Routing pattern

| Pattern | Layout | Mô tả |
|---|---|---|
| `/auth/*` | `AuthLayout` | login, register — không yêu cầu đăng nhập |
| `/*` | `PrivateLayout` | tất cả màn hình còn lại — yêu cầu đăng nhập |

---

## Scripts quan trọng

| Script | Mô tả |
|---|---|
| `npm run start` | Vite dev server |
| `npm run build` | tsc + vite build |
| `npm run preview` | Preview bản build production |

---

## Quy tắc

### HTTP & Auth

- Axios client (`src/services/axios.ts`) tự gắn `Authorization: Bearer <token>` và dispatch `signOut()` khi nhận 401.
- **Không xử lý auth token thủ công** ở bất kỳ nơi nào khác ngoài axios interceptor.

### State management

- Redux store chỉ giữ **`profile`** (auth state) và **`theme`** — không nhét server state vào Redux.
- Server state (data từ API) dùng **React Query** hoàn toàn.
- `redux-persist` lưu toàn bộ store vào `localStorage` — **không lưu dữ liệu nhạy cảm** (token, PII) vào Redux state.

### UI & Styling

- Component UI dùng **MUI làm base**, tuỳ chỉnh qua `src/styles/_mui.scss` và Tailwind classes.
- **Không override MUI bằng `!important`** trừ khi thực sự bắt buộc và phải có comment giải thích.
- Biến SCSS dùng qua `_vars.scss`, không hardcode màu/spacing trực tiếp trong component.

### Environment Variables

- **Không dùng `import.meta.env` trực tiếp** rải rác trong code.
- Tất cả env var đọc qua `src/env.ts`.

### TypeScript

- Tránh `any` — khai báo type rõ ràng tại module boundary.
- Type definitions đặt trong `src/models/*.d.ts`.
- Comment chỉ khi lý do không tự hiển nhiên từ code.

---

## Workflow: Tạo feature / màn hình mới

### Bước 1 — Tạo branch từ develop

```bash
# convention: feat/ fix/ chore/ refactor/ hotfix/
git checkout develop
git pull origin develop
git checkout -b feat/expense-category-screen
```

### Bước 2 — Xác định loại file cần tạo

| Loại | Thư mục |
|---|---|
| Màn hình chính | `src/views/` |
| Component tái sử dụng | `src/components/common/` |
| Container / Provider | `src/containers/` |
| Custom hook | `src/hooks/` |
| Type definition | `src/models/` |
| Redux slice | `src/reducers/` |
| API service | `src/services/` |
| Utility | `src/utils/` |

### Bước 3 — Khai báo type

Khai báo interface/type trong `src/models/` trước khi viết component.

```typescript
// src/models/expense.d.ts
export interface IExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface IExpenseCategoryPayload {
  name: string;
  color: string;
  icon: string;
}
```

### Bước 4 — Tạo API service

Gọi API qua axios client đã có sẵn trong `src/services/axios.ts`. Không tạo axios instance mới.

```typescript
// src/services/expenseCategory.ts
import axiosClient from './axios';
import { IExpenseCategory, IExpenseCategoryPayload } from '@/models/expense';

export const expenseCategoryApi = {
  getAll: () =>
    axiosClient.get<IExpenseCategory[]>('/expense-categories'),

  create: (payload: IExpenseCategoryPayload) =>
    axiosClient.post<IExpenseCategory>('/expense-categories', payload),

  update: (id: string, payload: Partial<IExpenseCategoryPayload>) =>
    axiosClient.put<IExpenseCategory>(`/expense-categories/${id}`, payload),

  delete: (id: string) =>
    axiosClient.delete(`/expense-categories/${id}`),
};
```

### Bước 5 — Tạo React Query hooks

Server state dùng React Query — không dùng `useEffect` + `useState` để fetch data.

```typescript
// src/hooks/useExpenseCategory.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseCategoryApi } from '@/services/expenseCategory';

const QUERY_KEY = ['expense-categories'];

export const useExpenseCategories = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => expenseCategoryApi.getAll().then(r => r.data),
  });

export const useCreateExpenseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseCategoryApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};
```

### Bước 6 — Tạo Form với React Hook Form

```typescript
// bên trong view/component
import { useForm, Controller } from 'react-hook-form';
import { IExpenseCategoryPayload } from '@/models/expense';

const { control, handleSubmit, formState: { errors } } = useForm<IExpenseCategoryPayload>({
  defaultValues: { name: '', color: '#000000', icon: '' },
});

const onSubmit = (data: IExpenseCategoryPayload) => {
  createCategory.mutate(data);
};
```

### Bước 7 — Tạo màn hình (View)

```typescript
// src/views/ExpenseCategory/index.tsx
import { Box, Typography, Button } from '@mui/material';
import { useExpenseCategories, useCreateExpenseCategory } from '@/hooks/useExpenseCategory';

const ExpenseCategoryView = () => {
  const { data: categories, isLoading } = useExpenseCategories();
  const createCategory = useCreateExpenseCategory();

  if (isLoading) return <Box>Loading…</Box>;

  return (
    <Box className="p-4">
      <Typography variant="h5">Danh mục chi tiêu</Typography>
      {/* ... */}
    </Box>
  );
};

export default ExpenseCategoryView;
```

### Bước 8 — Đăng ký route

```typescript
// src/routes/index.tsx — thêm vào PrivateLayout routes
{
  path: 'expense-categories',
  element: <ExpenseCategoryView />,
}
```

### Bước 9 — Thêm env var (nếu có)

Khai báo trong `src/env.ts` và cập nhật `.env.example`. Không commit `.env`.

```typescript
// src/env.ts
export const env = {
  API_URL: import.meta.env.VITE_API_URL as string,
  // thêm biến mới tại đây
};
```

### Bước 10 — Build và kiểm tra

```bash
npm run build
```

Build pass → commit được. Kiểm tra lỗi TypeScript trước khi push.

```bash
git push origin feat/expense-category-screen
```

---

## Workflow: Tạo Pull Request

### Target branch

- `feat/*` và `fix/*` → merge vào `develop`.
- `hotfix/*` → merge vào cả `main` và `develop`.
- **Không mở PR trực tiếp vào `main`** trừ khi là hotfix khẩn cấp.

### Tiêu đề PR

Format: `[type]: mô tả ngắn gọn`

```
feat: add expense category management screen
fix: resolve token refresh loop on 401
chore: upgrade react-query to v4.36
refactor: extract date helpers into utils/date.ts
hotfix: patch redux-persist rehydration error
```

### Mô tả PR

```
## What
Mô tả những gì đã thay đổi và tại sao.

## How
Cách tiếp cận, design decision đáng chú ý.

## Test
Cách đã test (manual flow, scenario cụ thể, màn hình/thiết bị).

## Breaking change / Migration
Có thay đổi store shape (redux-persist) không? Có breaking change API không?
Nếu không, ghi "None".
```

### Labels

`feature` · `bugfix` · `hotfix` · `chore` · `refactor` · `breaking-change`

### Rebase trước khi merge

```bash
git fetch origin
git rebase origin/develop
# giải conflict nếu có, rồi:
git push --force-with-lease
```

### Merge strategy

- Feature branch → **Squash and merge** (giữ history sạch).
- Hotfix → **Merge commit**.
- Sau khi merge: xoá branch remote. Không để branch rác tồn tại quá 3 ngày sau khi merged.
- PR cần ít nhất **1 approval** — không được tự merge.

---

## PR Checklist (self-review trước khi mở PR)

### Code quality

- [ ] Không còn `any` nào trong code mới — type rõ ràng tại module boundary
- [ ] Type mới khai báo trong `src/models/*.d.ts`, không inline trong component
- [ ] Không dùng `import.meta.env` trực tiếp — tất cả env var qua `src/env.ts`
- [ ] Không xử lý auth token thủ công — chỉ qua axios interceptor

### State & data fetching

- [ ] Server state dùng React Query, không dùng `useEffect` + `useState` để fetch API
- [ ] Redux store chỉ chứa `profile` và `theme` — không nhét data từ API vào Redux
- [ ] Không lưu dữ liệu nhạy cảm vào Redux (sẽ bị persist vào localStorage)

### UI & Styling

- [ ] Component dùng MUI làm base — override qua `_mui.scss` hoặc Tailwind class
- [ ] Không có `!important` mới nào trừ khi có comment giải thích rõ lý do
- [ ] Không hardcode màu/spacing trực tiếp trong JSX — dùng biến từ `_vars.scss` hoặc MUI theme

### Build

- [ ] `npm run build` pass không lỗi TypeScript
- [ ] Không có console.log nào còn sót lại trong code

### PR metadata

- [ ] Tiêu đề PR theo format `[type]: mô tả`
- [ ] Description điền đủ What / How / Test / Breaking change
- [ ] Đã assign reviewer và gắn label phù hợp