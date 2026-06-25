# StreetEats Live — common tasks
.PHONY: up down logs build seed fe

up:        ## Build + start the whole stack
	docker compose up --build -d

down:      ## Stop everything (keep data)
	docker compose down

clean:     ## Stop and wipe volumes
	docker compose down -v

logs:      ## Tail all logs
	docker compose logs -f

fe:        ## Run the React app (dev) against the gateway
	cd frontend/web-app && npm install && npm run dev

seed:      ## Seed one demo vendor with status, menu, review (through the gateway :8080)
	./scripts/seed.sh
