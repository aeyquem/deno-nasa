import {
  Application,
  ListenOptions,
  send,
} from "https://deno.land/x/oak@v5.0.0/mod.ts";

import * as log from "https://deno.land/std/log/mod.ts";
import api from "./api.ts";

const app = new Application();
const listenOptions: ListenOptions = { port: 8000 };

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    },
  },
});

app.addEventListener("error", (event) => {
  log.error(event.error);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.body = "Internal Server Error";
    throw err;
  }
});

app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.headers.get("X-Response-Time");
  log.info(`${ctx.request.method} ${ctx.request.url} : ${time}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const delta = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(api.routes());
app.use(api.allowedMethods());

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const fileWhiteList = [
    "/index.html",
    "/javascripts/script.js",
    "/stylesheets/style.css",
    "/images/favicon.png",
  ];

  if (fileWhiteList.includes(filePath)) {
    const options = {
      root: `${Deno.cwd()}/public`,
    };
    await send(ctx, filePath, options);
  }
});

if (import.meta.main) {
  log.info("listening on port: " + listenOptions.port);
  await app.listen(listenOptions);
}
