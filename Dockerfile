FROM oven/bun

WORKDIR /app

COPY package.json .
#COPY bun.lockb .

RUN bun install --production

# Install system dependencies for PhantomJS
RUN apt-get update && apt-get install -y \
    bzip2 \
    libfontconfig1 \
    libfreetype6 \
    libfreetype6-dev \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

RUN bun add phantomjs-prebuilt

COPY src src
COPY tsconfig.json .
COPY .env .
# COPY public public

ENV NODE_ENV=production
CMD ["bun", "src/index.ts"]

EXPOSE 3000