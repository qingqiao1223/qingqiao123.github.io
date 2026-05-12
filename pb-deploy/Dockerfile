FROM alpine:latest

ARG PB_VERSION=0.26.2

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget

# 下载 PocketBase
RUN wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    -O /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /usr/local/bin/ \
    && rm /tmp/pb.zip

# 创建数据目录
RUN mkdir -p /pb_data

EXPOSE 8080

CMD ["/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb_data"]
