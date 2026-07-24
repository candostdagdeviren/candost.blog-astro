import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { t } from "../i18n/utils";
import type { en } from "../i18n/en";
import { config } from "../consts";

dayjs.locale(config.lang);
dayjs.extend(advancedFormat);
dayjs.extend(utc);

export function formatDate(
  date: Date | null | undefined,
  dateType: keyof typeof en = "post.dateFormat",
) {
  if (date) {
    const dateFormat = t(dateType) || "YYYY-MM-DD";
    return dayjs(date).utc().format(dateFormat);
  } else {
    return "";
  }
}
