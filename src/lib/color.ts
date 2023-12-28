// https://misc.flogisoft.com/bash/tip_colors_and_formatting

////////////////////////////////
// # Code
////////////////////////////////
// # Set
export const Bold /*            */ = '\x1b[1m';
export const Bright /*          */ = Bold;
export const Dim /*             */ = '\x1b[2m';
export const Underlined /*      */ = '\x1b[4m';
export const Blink /*           */ = '\x1b[5m';
export const Reverse /*         */ = '\x1b[7m'; /* invert the foreground and background colors */
export const Hidden /*          */ = '\x1b[8m'; /* useful for passwords */

// # Reset
export const ResetAll /*        */ = '\x1b[0m';
// ! not working
export const ResetBold /*       */ = '\x1b[21m';
export const ResetBright /*     */ = ResetBold;
export const ResetDim /*        */ = '\x1b[22m';
export const ResetUnderlined /* */ = '\x1b[24m';
export const ResetBlink /*      */ = '\x1b[25m';
export const ResetReverse /*    */ = '\x1b[27m';
export const ResetHidden /*     */ = '\x1b[28m';

// # Foreground (text)
export const Default /*         */ = '\x1b[39m'; /* Default foreground color */
export const Black /*           */ = '\x1b[30m';
export const Red /*             */ = '\x1b[31m';
export const Green /*           */ = '\x1b[32m';
export const Yellow /*          */ = '\x1b[33m';
export const Blue /*            */ = '\x1b[34m';
export const Magenta /*         */ = '\x1b[35m';
export const Cyan /*            */ = '\x1b[36m';
export const LightGray /*       */ = '\x1b[37m';
export const DarkGray /*        */ = '\x1b[90m';
export const LightRed /*        */ = '\x1b[91m';
export const LightGreen /*      */ = '\x1b[92m';
export const LightYellow /*     */ = '\x1b[93m';
export const LightBlue /*       */ = '\x1b[94m';
export const LightMagenta /*    */ = '\x1b[95m';
export const LightCyan /*       */ = '\x1b[96m';
export const White /*           */ = '\x1b[97m';

// # Background
export const BgDefault /*       */ = '\x1b[49m'; /* Default background color */
export const BgBlack /*         */ = '\x1b[40m';
export const BgRed /*           */ = '\x1b[41m';
export const BgGreen /*         */ = '\x1b[42m';
export const BgYellow /*        */ = '\x1b[43m';
export const BgBlue /*          */ = '\x1b[44m';
export const BgMagenta /*       */ = '\x1b[45m';
export const BgCyan /*          */ = '\x1b[46m';
export const BgLightGray /*     */ = '\x1b[47m';
export const BgDarkGray /*      */ = '\x1b[100m';
export const BgLightRed /*      */ = '\x1b[101m';
export const BgLightGreen /*    */ = '\x1b[102m';
export const BgLightYellow /*   */ = '\x1b[103m';
export const BgLightBlue /*     */ = '\x1b[104m';
export const BgLightMagenta /*  */ = '\x1b[105m';
export const BgLightCyan /*     */ = '\x1b[106m';
export const BgWhite /*         */ = '\x1b[107m';

////////////////////////////////
// # Function
////////////////////////////////
const reset /*           */ = (message: string) => `${ResetAll}${message}`;

const bold /*            */ = (message: string) => `${Bold}${message}${ResetAll}`;
const bright /*          */ = bold;
const dim /*             */ = (message: string) => `${Dim}${message}${ResetAll}`;
const underlined /*      */ = (message: string) => `${Underlined}${message}${ResetAll}`;
const blink /*           */ = (message: string) => `${Blink}${message}${ResetAll}`;
const reverse /*         */ = (message: string) => `${Reverse}${message}${ResetAll}`;
const hidden /*          */ = (message: string) => `${Hidden}${message}${ResetAll}`;

const fgDefault /*       */ = (message: string) => `${Default}${message}${Default}`;
const black /*           */ = (message: string) => `${Black}${message}${Default}`;
const red /*             */ = (message: string) => `${Red}${message}${Default}`;
const green /*           */ = (message: string) => `${Green}${message}${Default}`;
const yellow /*          */ = (message: string) => `${Yellow}${message}${Default}`;
const blue /*            */ = (message: string) => `${Blue}${message}${Default}`;
const magenta /*         */ = (message: string) => `${Magenta}${message}${Default}`;
const cyan /*            */ = (message: string) => `${Cyan}${message}${Default}`;
const lightGray /*       */ = (message: string) => `${LightGray}${message}${Default}`;
const darkGray /*        */ = (message: string) => `${DarkGray}${message}${Default}`;
const lightRed /*        */ = (message: string) => `${LightRed}${message}${Default}`;
const lightGreen /*      */ = (message: string) => `${LightGreen}${message}${Default}`;
const lightYellow /*     */ = (message: string) => `${LightYellow}${message}${Default}`;
const lightBlue /*       */ = (message: string) => `${LightBlue}${message}${Default}`;
const lightMagenta /*    */ = (message: string) => `${LightMagenta}${message}${Default}`;
const lightCyan /*       */ = (message: string) => `${LightCyan}${message}${Default}`;
const white /*           */ = (message: string) => `${White}${message}${Default}`;
const bgDefault /*       */ = (message: string) => `${BgDefault}${message}${Default}`;
const bgBlack /*         */ = (message: string) => `${BgBlack}${message}${Default}`;
const bgRed /*           */ = (message: string) => `${BgRed}${message}${Default}`;
const bgGreen /*         */ = (message: string) => `${BgGreen}${message}${Default}`;
const bgYellow /*        */ = (message: string) => `${BgYellow}${message}${Default}`;
const bgBlue /*          */ = (message: string) => `${BgBlue}${message}${Default}`;
const bgMagenta /*       */ = (message: string) => `${BgMagenta}${message}${Default}`;
const bgCyan /*          */ = (message: string) => `${BgCyan}${message}${Default}`;
const bgLightGray /*     */ = (message: string) => `${BgLightGray}${message}${Default}`;
const bgDarkGray /*      */ = (message: string) => `${BgDarkGray}${message}${Default}`;
const bgLightRed /*      */ = (message: string) => `${BgLightRed}${message}${Default}`;
const bgLightGreen /*    */ = (message: string) => `${BgLightGreen}${message}${Default}`;
const bgLightYellow /*   */ = (message: string) => `${BgLightYellow}${message}${Default}`;
const bgLightBlue /*     */ = (message: string) => `${BgLightBlue}${message}${Default}`;
const bgLightMagenta /*  */ = (message: string) => `${BgLightMagenta}${message}${Default}`;
const bgLightCyan /*     */ = (message: string) => `${BgLightCyan}${message}${Default}`;
const bgWhite /*         */ = (message: string) => `${BgWhite}${message}${Default}`;

// alias
const info /*            */ = cyan;
const warn /*            */ = yellow;
const error /*           */ = red;
const success /*         */ = green;
const link /*            */ = blue;

export const color = {
  reset /*           */,
  bold /*            */,
  bright /*          */,
  dim /*             */,
  underlined /*      */,
  blink /*           */,
  reverse /*         */,
  hidden /*          */,
  fgDefault /*       */,
  black /*           */,
  red /*             */,
  green /*           */,
  yellow /*          */,
  blue /*            */,
  magenta /*         */,
  cyan /*            */,
  lightGray /*       */,
  darkGray /*        */,
  lightRed /*        */,
  lightGreen /*      */,
  lightYellow /*     */,
  lightBlue /*       */,
  lightMagenta /*    */,
  lightCyan /*       */,
  white /*           */,
  bgDefault /*       */,
  bgBlack /*         */,
  bgRed /*           */,
  bgGreen /*         */,
  bgYellow /*        */,
  bgBlue /*          */,
  bgMagenta /*       */,
  bgCyan /*          */,
  bgLightGray /*     */,
  bgDarkGray /*      */,
  bgLightRed /*      */,
  bgLightGreen /*    */,
  bgLightYellow /*   */,
  bgLightBlue /*     */,
  bgLightMagenta /*  */,
  bgLightCyan /*     */,
  bgWhite /*         */,
  info /*            */,
  warn /*            */,
  error /*           */,
  success /*         */,
  link /*            */,
};
