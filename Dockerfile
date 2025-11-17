FROM denoland/deno:2.4.3

# Install Chromium for PDF generation
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN deno task build

# Set Chromium path for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 8000
CMD ["run", "--unstable", "--unstable-kv", "--unstable-cron", "-A", "main.ts"]
