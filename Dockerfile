# ============================|| DOCKERFILE FOR REACT ADMIN ||============================ #

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Install wget for health check
RUN apk add --no-cache wget

EXPOSE 3000

# Start the application using yarn start
CMD ["yarn", "start"] 