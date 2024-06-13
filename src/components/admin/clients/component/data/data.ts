export const generateData = (numRows: number) => {
  return Array.from({ length: numRows }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    value: Math.floor(Math.random() * 100),
  }));
};
