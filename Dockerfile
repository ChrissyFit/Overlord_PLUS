FROM node:18-bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.9 \
    python3-pip \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install --upgrade Pillow

WORKDIR /app

COPY . .

CMD [ "node", "index.js" ]