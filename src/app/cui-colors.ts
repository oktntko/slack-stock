import kleur from "kleur";

const alias = {
  info: kleur.cyan,
  warn: kleur.yellow,
  error: kleur.red,
  success: kleur.green,
  link: kleur.blue,
};

export const COLOR = { ...kleur, ...alias };
