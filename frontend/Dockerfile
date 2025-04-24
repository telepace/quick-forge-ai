# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:20 AS build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install -g pnpm && \
    pnpm config set auto-install-peers true && \
    pnpm config set unsafe-perm true && \
    pnpm install

COPY ./ /app/

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

ARG SKIP_TS_CHECK=false
ENV SKIP_TS_CHECK=${SKIP_TS_CHECK}

RUN if [ "$SKIP_TS_CHECK" = "true" ] ; then \
        pnpm exec vite build; \
    else \
        pnpm build; \
    fi

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
