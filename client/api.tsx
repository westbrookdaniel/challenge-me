import { InferRequestType, hc } from "hono/client";
import { ApiType } from "../server/api";

const client = hc<ApiType>("/api");

client.challenges.$get();

// const fetcher =
//   <T,>($get: T, arg: InferRequestType<T>) =>
//   async () => {
//     const res = await $get(arg);
//     return await res.json();
//   };
