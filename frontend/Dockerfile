FROM node:20-alpine3.17 as builder

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./

RUN yarn

# copy source code to /app/src folder
COPY src /app/src
COPY public /app/public
RUN yarn run build

# Bundle static assets with nginx
FROM nginx:1.25.1-alpine as production

ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
# CMD ["nginx", "-g", "daemon off;"]