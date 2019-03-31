FROM node:latest

WORKDIR /usr/app/server

# Install Chrome deps + add Chrome Stable + purge all the things
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    --no-install-recommends \
    && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y \
    google-chrome-stable \
    fontconfig \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-symbola \
    fonts-noto \
    ttf-freefont \
    --no-install-recommends \
    && apt-get purge --auto-remove -y curl gnupg \
    && rm -rf /var/lib/apt/lists/*

# Add Chrome as a user
RUN groupadd -r chrome && useradd -r -g chrome -G audio,video chrome \
    && mkdir -p /home/chrome && chown -R chrome:chrome /home/chrome \
    && mkdir -p /opt/google/chrome && chown -R chrome:chrome /opt/google/chrome

# Install the program as root.
USER root

COPY package.json .
COPY package-lock.json .
COPY crawler-* .

RUN npm install

COPY . .

RUN chown -R chrome:chrome /usr/app/server

USER chrome

ENV MONGO_USER=mongo
ENV MONGO_PASS=password
ENV SERVER_PORT=3001
ENV CHROME_PATH=/usr/bin/google-chrome-stable
ENV NICKJS_NO_SANDBOX=1

CMD ["npm", "start"]