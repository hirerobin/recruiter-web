FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


FROM node:24-alpine AS runtime

WORKDIR /app
RUN addgroup --system app && adduser --system --ingroup app app 

COPY --from=builder --chown=app:app /app/.output ./.output
COPY --from=builder --chown=app:app /app/package.json ./package.json

USER app

EXPOSE 3000

CMD ["npm", "run", "start"]
