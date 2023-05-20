FROM node

# создание директории приложения
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Если вы создаете сборку для продакшн
# RUN npm ci --omit=dev

# копируем исходный код
COPY . .

EXPOSE 5050
CMD [ "node", "index.js" ]