export interface PaginationInfoInterface {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  prevPage: boolean | number;
  nextPage: boolean | number;
}

export const SORT_DIRECTIONS = ['asc', 'desc'];

export const generateSort = (
  sortFromQuery: object,
  fields: Array<string>
): object => {
  const sort = {};
  for (const key in sortFromQuery) {
    if (
      sortFromQuery[key] &&
      sortFromQuery.hasOwnProperty(key) &&
      fields.includes(key) &&
      SORT_DIRECTIONS.includes(sortFromQuery[key])
    ) {
      sort[key] = sortFromQuery[key];
    }
  }
  return sort;
};

export const generatePagination = (
  optionsPage= 1,
  total = 0,
  limit = 1
): PaginationInfoInterface => {
  const page = Math.abs(optionsPage) || 1;
  const totalPages = Math.ceil(total / limit);
  const prevPage = page !== 1 ? (page - 1) : false;
  const nextPage = page < totalPages ? (page + 1) : false;
  return {
    total,
    page,
    limit,
    totalPages,
    prevPage,
    nextPage
  };
};
