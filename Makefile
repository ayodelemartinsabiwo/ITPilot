.PHONY: help build up down restart logs shell migrate test clean

help:
	@echo "ITPilot Development Commands"
	@echo "=============================="
	@echo "make build      - Build Docker containers"
	@echo "make up         - Start all services"
	@echo "make down       - Stop all services"
	@echo "make restart    - Restart all services"
	@echo "make logs       - View logs"
	@echo "make shell      - Access Django shell"
	@echo "make migrate    - Run database migrations"
	@echo "make test       - Run tests"
	@echo "make clean      - Clean up containers and volumes"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

shell:
	docker-compose exec backend python manage.py shell

migrate:
	docker-compose exec backend python manage.py migrate

makemigrations:
	docker-compose exec backend python manage.py makemigrations

createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

test:
	docker-compose exec backend pytest

clean:
	docker-compose down -v
	docker system prune -f

dev-backend:
	cd backend && python manage.py runserver

dev-frontend:
	cd frontend && npm run dev

install-backend:
	cd backend && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

setup:
	make install-backend
	make install-frontend
	make migrate
	make createsuperuser
