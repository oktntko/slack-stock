import { cli } from "cli-ux";
import fs from "fs";
import kleur from "kleur";
import Papa from "papaparse";
import xlsx from "xlsx";

const alias = {
  info: kleur.cyan,
  warn: kleur.yellow,
  error: kleur.red,
  success: kleur.green,
  link: kleur.blue,
};

export const color = { ...kleur, ...alias };

export const icon = {
  info: color.info("ℹ️ "),
  warn: color.warn("⚠️ "),
  error: color.error("❌"),
  success: color.success("✔️ "),
  done: color.success("☺️ "),
  question: color.warn("❓"),
};

export const message = {
  progressing: `${icon.info} Progressing`,
  success: `${icon.success} Success!`,
  no_data: `${icon.error} No data`,
};

export const output = async (output: OutputType, data: any[], filePath: string, schema?: any[]) => {
  switch (output) {
    case "console":
      console.table(data);
      return;
    case "csv":
    case "tsv":
      toXsv(output === "tsv" ? "\t" : ",", data, filePath);
      break;
    case "xlsx":
      toExcel(data, filePath);
      break;
  }

  cli.info(`${icon.info} created "${color.info(filePath)}", ${data.length.toLocaleString()} raws`);
};

const toExcel = (values: any[], filePath: string) => {
  console.log(values);
  console.log(Object.values(values));
  const data = [Object.keys(values[0]), ...values.map((v) => Object.values(v))];
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.aoa_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, "sheet1");
  xlsx.writeFile(workbook, filePath);
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
