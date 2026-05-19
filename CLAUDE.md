# Frontend — CLAUDE.md (budget-tracker)

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

## Cấu trúc thư mục

```
src/
  assets/
  components/       # UI nhỏ, tái sử dụng (common/)
  containers/       # AppProvider, AppTheme, AppMenu, AppHeader, AppHooks …
  hooks/
  layouts/          # AuthLayout, PrivateLayout
  models/           # TypeScript type definitions (*.d.ts)
  reducers/         # Redux slices + store (profileSlice, themeSlice)
  routes/
  services/         # axios client, auth API, queryClient
  styles/           # _vars.scss, _mui.scss, tailwind.css
  utils/
  views/            # Màn hình (Auth, Home, Profile, Components…)
```

## Routing pattern

- `/auth/*` → `AuthLayout` (login, register)
- `/*` → `PrivateLayout` (yêu cầu đăng nhập)

## Scripts quan trọng

```bash
npm run start    # vite dev server
npm run build    # tsc + vite build
npm run preview  # preview bản build
```

## Quy tắc

- Axios client (`src/services/axios.ts`) tự gắn `Authorization: Bearer <token>` và dispatch `signOut()` khi nhận 401 — không xử lý auth thủ công ở nơi khác.
- Redux store chỉ giữ `profile` (auth state) và `theme`; server state dùng React Query.
- `redux-persist` lưu toàn bộ store vào `localStorage` — không lưu dữ liệu nhạy cảm vào Redux.
- Component UI dùng MUI làm base, tùy chỉnh qua `src/styles/_mui.scss` và Tailwind classes — không override MUI bằng `!important` trừ khi bắt buộc.
- Biến môi trường đọc qua `src/env.ts`, không dùng `import.meta.env` trực tiếp rải rác.
- TypeScript: tránh `any`; khai báo type rõ tại module boundary.
- Comment chỉ khi lý do không tự hiển nhiên từ code.
