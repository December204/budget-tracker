import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useCategoryList } from 'hooks';

type Props = {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
};

const TransactionFilters = ({ filters, onChange }: Props) => {
  const { data: categoryData } = useCategoryList();
  const categories = categoryData?.data ?? [];

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    onChange({ ...filters, type: e.target.value as TransactionFilters['type'], page: 1 });
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    onChange({ ...filters, categoryId: e.target.value, page: 1 });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, dateFrom: e.target.value, page: 1 });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, dateTo: e.target.value, page: 1 });
  };

  const handleReset = () => {
    onChange({ type: '', categoryId: '', dateFrom: '', dateTo: '', page: 1, limit: filters.limit });
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mb={2}>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Loại giao dịch</InputLabel>
        <Select
          value={filters.type ?? ''}
          label="Loại giao dịch"
          onChange={handleTypeChange}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="income">Thu nhập</MenuItem>
          <MenuItem value="expense">Chi tiêu</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Danh mục</InputLabel>
        <Select
          value={filters.categoryId ?? ''}
          label="Danh mục"
          onChange={handleCategoryChange}
        >
          <MenuItem value="">Tất cả danh mục</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Từ ngày"
        type="date"
        value={filters.dateFrom ?? ''}
        onChange={handleDateFromChange}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        size="small"
        label="Đến ngày"
        type="date"
        value={filters.dateTo ?? ''}
        onChange={handleDateToChange}
        InputLabelProps={{ shrink: true }}
      />

      <Button variant="outlined" onClick={handleReset}>
        Xóa bộ lọc
      </Button>
    </Box>
  );
};

export default TransactionFilters;
