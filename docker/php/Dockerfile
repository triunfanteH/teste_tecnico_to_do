FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

ARG UID
ARG GID

RUN groupadd -g ${GID:-1000} dev
RUN useradd -u ${UID:-1000} -g dev -m dev
RUN usermod -a -G dev www-data

WORKDIR /var/www/html

USER dev