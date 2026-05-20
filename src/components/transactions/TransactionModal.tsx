import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import DialogClose from 'components/DialogClose';
import { useCreateTransaction, useUpdateTransaction } from 'hooks';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  amount: z
    .number({ invalid_type_error: 'Số tiền không hợp lệ' })
    .positive('Số tiền phải lớn hơn 0'),
  type: z.enum(['income', 'expense'], { required_error: 'Vui lòng chọn loại giao dịch' }),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  date: z.string().min(1, 'Vui lòng chọn ngày'),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  editItem: Transaction | null;
  categories: Category[];
  onClose: () => void;
};

const TransactionModal = ({ open, editItem, categories, onClose }: Props) => {
  const isEditing = editItem !== null;
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      type: 'expense',
      categoryId: '',
      date: '',
      note: '',
    },
  });

  const selectedType = watch('type');

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === selectedType),
    [categories, selectedType],
  );

  useEffect(() => {
    if (open) {
      if (editItem) {
        reset({
          amount: editItem.amount,
          type: editItem.type,
          categoryId: editItem.categoryId,
          date: editItem.date.split('T')[0],
          note: editItem.note ?? '',
        });
      } else {
        reset({
          amount: 0,
          type: 'expense',
          categoryId: '',
          date: '',
          note: '',
        });
      }
    }
  }, [open, editItem, reset]);

  const onSubmit = (values: FormValues) => {
    const body: CreateTransactionBody = {
      amount: values.amount,
      type: values.type,
      categoryId: values.categoryId,
      date: values.date,
      note: values.note || undefined,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: editItem.id, ...body },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(body, { onSuccess: onClose });
    }
  };

  const isPending = createMutation.isLoading || updateMutation.isLoading;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? 'Sửa giao dịch' : 'Thêm giao dịch'}
        <DialogClose onClick={onClose} />
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.type)}>
                <InputLabel>Loại giao dịch</InputLabel>
                <Select {...field} label="Loại giao dịch">
                  <MenuItem value="income">Thu nhập</MenuItem>
                  <MenuItem value="expense">Chi tiêu</MenuItem>
                </Select>
                {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.categoryId)}>
                <InputLabel>Danh mục</InputLabel>
                <Select {...field} label="Danh mục">
                  {filteredCategories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && (
                  <FormHelperText>{errors.categoryId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Số tiền"
                type="number"
                fullWidth
                error={Boolean(errors.amount)}
                helperText={errors.amount?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
                inputProps={{ min: 0 }}
              />
            )}
          />

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ngày"
                type="date"
                fullWidth
                error={Boolean(errors.date)}
                helperText={errors.date?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ghi chú"
                fullWidth
                multiline
                rows={3}
                error={Boolean(errors.note)}
                helperText={errors.note?.message}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isEditing ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionModal;
