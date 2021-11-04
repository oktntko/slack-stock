import { cli } from "cli-ux";
import fs from "fs";
import kleur from "kleur";
import Papa from "papaparse";
import toExcel from "write-excel-file/node";

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
  done: color.success("☺️"),
  tips: color.warn("💡"),
  question: color.warn("❓"),
  ok: color.success("🆗"),
};

export const output = async (output: OutputType, data: any[], filePath: string, schema?: any[]) => {
  if (data.length === 0) {
    cli.info(`${icon.error} No data.`);
    return;
  }

  switch (output) {
    case "console":
      console.table(data);
      return;
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

  cli.info(`${icon.info} created "${filePath}", ${data.length.toLocaleString()} raws`);
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
