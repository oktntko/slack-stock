import fs from "fs";
import Papa from "papaparse";
import toExcel from "write-excel-file/node";

export const output = async (
  output: OutputType,
  data: any[],
  filePath: string,
  schema?: any[]
) => {
  if (data.length === 0) {
    console.error("No data.");
    return;
  }

  switch (output) {
    case "console":
      console.table(data);
      break;
    case "csv":
    case "tsv":
      toXsv(output === "tsv" ? "\t" : ",", data, filePath);
      break;
    case "excel":
      await toExcel(data, {
        schema: schema
          ? schema
          : Object.keys(data[0]).map((key) => ({
              column: key,
              value: (obj: any) => obj[key],
            })),
        filePath,
        headerStyle: {
          backgroundColor: "#eeeeee",
          fontWeight: "bold",
          align: "center",
        },
        dateFormat: "yyyy-mm-dd hh:mm:ss",
      });
      break;
  }
};

const toXsv = (delimiter: string, data: any[], filePath: string) => {
  const parsed = Papa.unparse(data, {
    delimiter,
    header: true,
    newline: "\n",
    escapeFormulae: true,
  });

  fs.writeFileSync(filePath, parsed, {
    encoding: "utf8",
  });
};
