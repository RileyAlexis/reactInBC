export const getTableData = (
  tableNumber: Number,
  filterField?: Number,
  filterText?: string
) => {
  Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('GetTable', [
    tableNumber,
    filterField,
    filterText,
  ]);
};
