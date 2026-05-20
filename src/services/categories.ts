import axiosInstance from 'lib/axiosInstance';

const getCategories = (): Promise<CategoryListResponse> => axiosInstance.get('/categories');

const categoryService = {
  getCategories,
};

export default categoryService;
