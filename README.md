# ewritter
Is web platform that connects people who wants to bitch about things, write articles and want to be epesni (that's why the e)
[Link](https://ewritter.kyncl.dev/)

# Install 
```bash
cd frontend
bun install
cd ../backend
composer install
docker compose up --build
docker compose exec backend php artisan migrate
docker network create frontend_net
docker network create backend_net
docker compose run --rm frontend bun install
```
