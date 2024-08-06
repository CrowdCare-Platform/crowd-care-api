type IAvailableFiltersInput = {
  filter: unknown;
};

type IAvailableFiltersOutput<T> = {
  where: T;
};

type IAvailableFilters<T> = {
  [key: string]: (
    params: IAvailableFiltersInput,
  ) => Promise<IAvailableFiltersOutput<T>>;
};

type IDefaultFilters<T> = {
  [key in keyof T]: () => Promise<IAvailableFiltersOutput<T>>;
};

type IApplyFiltersInput<T> = {
  defaultFilters?: IDefaultFilters<T>;
  availableFilters: IAvailableFilters<T>;
  appliedFiltersInput: T;
};

type IApplyFiltersOutput<T> = {
  whereBuilder: T;
};

/**
 *
 * @param params IApplyFiltersInput
 * @returns Returns the where of the prism and the filters applied to return to the frontend
 */
export const applyFilters = async <T>(
  params: IApplyFiltersInput<T>,
): Promise<IApplyFiltersOutput<T>> => {
  const { defaultFilters, availableFilters, appliedFiltersInput } = params;
  const whereBuilder: T = {} as T;

  if (defaultFilters) {
    for (const [key] of Object.entries(defaultFilters)) {
      const { where } = await defaultFilters[key]();

      Object.assign(whereBuilder, where);
    }
  }

  for (const [key, value] of Object.entries(appliedFiltersInput)) {
    if (availableFilters[key] && value) {
      const { where } = await availableFilters[key]({
        filter: value,
      });
      Object.assign(whereBuilder, where);
    }
  }

  return {
    whereBuilder,
  };
};
