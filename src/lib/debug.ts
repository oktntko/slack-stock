import { env } from '../env';

export const debug = {
  assert,
  clear,
  count,
  countReset,
  debug: debugLog,
  dir,
  dirxml,
  error,
  group,
  groupCollapsed,
  groupEnd,
  info,
  log,
  table,
  time,
  timeEnd,
  timeLog,
  trace,
  warn,
  profile,
  profileEnd,
  timeStamp,
};

function assert(...args: Parameters<typeof console.assert>) {
  if (!env.SLACK_STOKC_PUBLISH) console.assert(...args);
}
function clear(...args: Parameters<typeof console.clear>) {
  if (!env.SLACK_STOKC_PUBLISH) console.clear(...args);
}
function count(...args: Parameters<typeof console.count>) {
  if (!env.SLACK_STOKC_PUBLISH) console.count(...args);
}
function countReset(...args: Parameters<typeof console.countReset>) {
  if (!env.SLACK_STOKC_PUBLISH) console.countReset(...args);
}
function debugLog(...args: Parameters<typeof console.debug>) {
  if (!env.SLACK_STOKC_PUBLISH) console.debug(...args);
}
function dir(...args: Parameters<typeof console.dir>) {
  if (!env.SLACK_STOKC_PUBLISH) console.dir(...args);
}
function dirxml(...args: Parameters<typeof console.dirxml>) {
  if (!env.SLACK_STOKC_PUBLISH) console.dirxml(...args);
}
function error(...args: Parameters<typeof console.error>) {
  if (!env.SLACK_STOKC_PUBLISH) console.error(...args);
}
function group(...args: Parameters<typeof console.group>) {
  if (!env.SLACK_STOKC_PUBLISH) console.group(...args);
}
function groupCollapsed(...args: Parameters<typeof console.groupCollapsed>) {
  if (!env.SLACK_STOKC_PUBLISH) console.groupCollapsed(...args);
}
function groupEnd(...args: Parameters<typeof console.groupEnd>) {
  if (!env.SLACK_STOKC_PUBLISH) console.groupEnd(...args);
}
function info(...args: Parameters<typeof console.info>) {
  if (!env.SLACK_STOKC_PUBLISH) console.info(...args);
}
function log(...args: Parameters<typeof console.log>) {
  if (!env.SLACK_STOKC_PUBLISH) console.log(...args);
}
function table(...args: Parameters<typeof console.table>) {
  if (!env.SLACK_STOKC_PUBLISH) console.table(...args);
}
function time(...args: Parameters<typeof console.time>) {
  if (!env.SLACK_STOKC_PUBLISH) console.time(...args);
}
function timeEnd(...args: Parameters<typeof console.timeEnd>) {
  if (!env.SLACK_STOKC_PUBLISH) console.timeEnd(...args);
}
function timeLog(...args: Parameters<typeof console.timeLog>) {
  if (!env.SLACK_STOKC_PUBLISH) console.timeLog(...args);
}
function trace(...args: Parameters<typeof console.trace>) {
  if (!env.SLACK_STOKC_PUBLISH) console.trace(...args);
}
function warn(...args: Parameters<typeof console.warn>) {
  if (!env.SLACK_STOKC_PUBLISH) console.warn(...args);
}
function profile(...args: Parameters<typeof console.profile>) {
  if (!env.SLACK_STOKC_PUBLISH) console.profile(...args);
}
function profileEnd(...args: Parameters<typeof console.profileEnd>) {
  if (!env.SLACK_STOKC_PUBLISH) console.profileEnd(...args);
}
function timeStamp(...args: Parameters<typeof console.timeStamp>) {
  if (!env.SLACK_STOKC_PUBLISH) console.timeStamp(...args);
}
