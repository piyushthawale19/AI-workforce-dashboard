FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npm run prisma:push && npm start"]
