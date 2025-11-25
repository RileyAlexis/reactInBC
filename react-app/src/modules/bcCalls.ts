import { isDevEnv } from "./enviornment";

export const getTableData = async (
  tableNumber: number,
  maxRecords: number,
  filterField?: string | number,
  filterText?: string
) => {
  if (isDevEnv()) {
    console.log("Dev Env true");
    try {
      const response = await fetch(`/mockData/${tableNumber}.json`);
      if (!response.ok) throw new Error("Mock data not found");
      let data = await response.json();

      // Filtering
      if (filterField && filterText) {
        data = data.filter((record: any) => {
          // Try direct property first
          if (
            record[filterField] != null &&
            String(record[filterField]).includes(filterText)
          ) {
            return true;
          }
          // Then check in the fields array
          if (Array.isArray(record.fields)) {
            return record.fields.some(
              (f: any) =>
                (f.name === filterField || f.id === filterField) &&
                f.value != null &&
                String(f.value).includes(filterText)
            );
          }
          return false;
        });
      }

      // Limit to maxRecords
      data = data.slice(0, maxRecords);

      // Simulate BC event
      const event = new CustomEvent("BCData", { detail: data });
      window.dispatchEvent(event);
      console.log("Dispatched mock BCData event:", event);
    } catch (err) {
      console.error("Error loading mock data:", err);
    }
  } else {
    if (filterField == undefined) filterField = 0;
    if (filterText == undefined) filterText = "";
    console.log("Max Records to Nav", maxRecords);
    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod("GetTable", [
      tableNumber,
      maxRecords,
      filterField,
      filterText,
    ]);
  }
};
