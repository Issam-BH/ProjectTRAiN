FROM node:lts-alpine3.23

COPY . /app
WORKDIR /app

RUN cd frontend && \
    npm i --legacy-peer-deps && \
    npm run build && \ 
    cd ../backend && \
    npm i && \
    npm run build && \
    cp -r ../frontend/dist/ ./dist/public

CMD [ "node", "/app/backend/dist/main.js" ]
