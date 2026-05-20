import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import TransactionFilters from 'components/transactions/TransactionFilters';
import TransactionList from 'components/transactions/TransactionList';
import TransactionModal from 'components/transactions/TransactionModal';
import { useCategoryList, useDeleteTransaction, useTransactionList } from 'hooks';
import { useState } from 'react';

type ModalState = {
  open: boolean;
  editItem: Transaction | null;
};

const DEFAULT_FILTERS: TransactionFilters = {
  type: '',
  categoryId: '',
  dateFrom: '',
  dateTo: '',
  page: 1,
  limit: 10,
};

const TransactionsPage = () => {
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [modalState, setModalState] = useState<ModalState>({ open: false, editItem: null });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useTransactionList(filters);

  const { data: categoryData } = useCategoryList();
  const categories = categoryData?.data ?? [];

  const deleteMutation = useDeleteTransaction();

  const handleFiltersChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleOpenAdd = () => {
    setModalState({ open: true, editItem: null });
  };

  const handleEdit = (transaction: Transaction) => {
    setModalState({ open: true, editItem: transaction });
  };

  const handleCloseModal = () => {
    setModalState({ open: false, editItem: null });
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSettled: () => setDeleteId(null),
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Giao dịch
        </Typography>
        <Button variant="contained" onClick={handleOpenAdd}>
          Thêm giao dịch
        </Button>
      </Box>

      <TransactionFilters filters={filters} onChange={handleFiltersChange} />

      <TransactionList
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        page={filters.page ?? 1}
        onPageChange={handlePageChange}
      />

      <TransactionModal
        open={modalState.open}
        editItem={modalState.editItem}
        categories={categories}
        onClose={handleCloseModal}
      />

      <Dialog open={deleteId !== null} onClose={handleDeleteCancel}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa giao dịch này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Hủy</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isLoading}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TransactionsPage;
