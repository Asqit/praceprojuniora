FROM denoland/deno:2.4.3

WORKDIR /app

COPY . .

# Cache main app code
RUN deno cache --unstable main.ts

# 🔨 Build your assets (Tailwind, etc.)
RUN deno task build

EXPOSE 8000

CMD ["run", "--unstable", "--unstable-kv", "--unstable-cron", "-A", "main.ts"]
