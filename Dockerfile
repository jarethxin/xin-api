# usa una imagen base de Node.js
FROM node:20

# establece el directorio de trabajo
WORKDIR /app

# copia el archivo package.json y package-lock.json
COPY package*.json ./

# instalar las dependencias necesarias para la app
RUN npm install

# copia el resto del código de la app
COPY . .

# expone el puerto que usa la app
EXPOSE 51810

# define el comando para ejecutar la app
CMD [ "node", "app.js" ]