# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files to working directory
COPY package*.json ./

# Install dependencies (choose different registry based on IP geolocation)
RUN location=$(curl -sSL https://myip.ipip.net/) \
    && echo $location \
    && if echo "$location" | grep -q "中国"; then \
    echo "The request comes from China."; \
    npm install --registry=https://registry.npmmirror.com; \
    else \
    npm install; \
    fi

# Copy application code to working directory
COPY . .

# Expose the port where the application runs (if needed)
EXPOSE 7001

# todo: When using "npm start," it encounters an error, exits immediately upon successful startup, and the reason is unknown. For now, "npm run dev" is being used instead.
# Run the startup command
# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
