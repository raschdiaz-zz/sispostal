import moment from "moment";
import { FORMATO_FECHA } from "../config/config";

export let getFechaActual = () => {
  return moment(new Date())
    .locale("es")
    .format(FORMATO_FECHA);
};


export let formatDate = (value: any, format: string) => {
  let date = new Date(value);
  const _padStart = (value: number): string => value.toString().padStart(2, '0');
  return format
    .replace(/yyyy/g, _padStart(date.getFullYear()))
    .replace(/dd/g, _padStart(date.getDate()))
    .replace(/mm/g, _padStart(date.getMonth() + 1))
    .replace(/hh/g, _padStart(date.getHours()))
    .replace(/ii/g, _padStart(date.getMinutes()))
    .replace(/ss/g, _padStart(date.getSeconds()));
}