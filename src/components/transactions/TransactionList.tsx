import { Delete, Edit } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { formatDate, formatVND } from 'utils/common';

type Props = {
  data: TransactionListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  page: number;
  onPageChange: (page: number) => void;
};

const TransactionList = ({
  data,
  isLoading,
  isError,
  onRetry,
  categories,
  onEdit,
  onDelete,
  page,
  onPageChange,
}: Props) => {
  const getCategoryName = (categoryId: string): string => {
    return categories.find((c) => c.id === categoryId)?.name ?? categoryId;
  };

  if (isLoading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 4 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton variant="text" width={80} /></TableCell>
                <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
                <TableCell><Skeleton variant="text" width={100} /></TableCell>
                <TableCell><Skeleton variant="text" width={90} /></TableCell>
                <TableCell><Skeleton variant="text" width={120} /></TableCell>
                <TableCell><Skeleton variant="rounded" width={70} height={30} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Thử lại
          </Button>
        }
      >
        Không thể tải danh sách giao dịch.
      </Alert>
    );
  }

  const transactions = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  if (transactions.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Chưa có giao dịch nào.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nhấn "Thêm giao dịch" để bắt đầu theo dõi thu chi.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} hover>
                <TableCell>{formatDate(tx.date)}</TableCell>
                <TableCell>
                  {tx.type === 'income' ? (
                    <Chip label="Thu nhập" color="success" size="small" />
                  ) : (
                    <Chip label="Chi tiêu" color="error" size="small" />
                  )}
                </TableCell>
                <TableCell>{getCategoryName(tx.categoryId)}</TableCell>
                <TableCell
                  sx={{
                    color: tx.type === 'income' ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatVND(tx.amount)}
                </TableCell>
                <TableCell>{tx.note ?? '—'}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => onEdit(tx)} aria-label="Sửa">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(tx.id)} aria-label="Xóa" color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
          />
        </Box>
      )}
    </>
  );
};

export default TransactionList;
