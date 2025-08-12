FROM denoland/deno:2.4.3

WORKDIR /app

COPY . .

RUN deno cache --unstable main.ts

EXPOSE 8000

CMD ["run", "--unstable","--unstable-kv","--unstable-cron", "--allow-net", "--allow-read", "--allow-env", "main.ts"]
