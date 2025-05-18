FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock
COPY .env .env

RUN bun install

COPY ./src ./src

ENV NODE_ENV=production
ENV PORT=3000

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server
COPY --from=build /app/.env .env

# Ensure all environment variables are available
ENV NODE_ENV=production
ENV PORT=3000

# Start the server with environment variables
CMD ["./server"]

EXPOSE 3000