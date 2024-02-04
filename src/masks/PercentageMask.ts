import { MaskitoOptions, maskitoUpdateElement } from "@maskito/core";
import {
  maskitoCaretGuard,
  maskitoEventHandler,
  maskitoNumberOptionsGenerator,
} from "@maskito/kit";

export const postfix = "%";
const { plugins, ...numberOptions } = maskitoNumberOptionsGenerator({
  postfix,
  min: 0,
  max: 100,
  precision: 2,
});

export default {
  ...numberOptions,
  plugins: [...plugins],
} as MaskitoOptions;
