import { json } from "@remix-run/node";
export const badRequest = (data: any, status?: number) =>
  json(data, { status: status || 400 });
