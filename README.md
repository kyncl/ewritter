# ewritter
Is web platform that connects people who wants to bitch about things, write articles and want to be epesni (that's why the e)
[Link](https://ewritter.kyncl.dev/)

# Run
- Locally
```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
docker exec backend composer install
``` 
- Production
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

```
