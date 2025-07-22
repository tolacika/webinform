# PHP tesztfeladat:

- 1 oldalas weblap: hírlevél feliratkozási űrlap (név, email)
- Feliratkozók száma, utolsó feliratkozó adatai, automatikus (5 mp-enként) és azonnali frissítés AJAX-szal
- MySQL adatbázis, név (5-40 karakter), email (valid), feliratkozás dátuma
- Vanilla PHP , jQuery, AJAX-os űrlap, PHP oldali validáció, mezőnkénti hibajelzés
- Opcionális: Twig , Doctrine, ingyenes html template használata.

# React tesztfeladat

Készíts egy egyoldalas React alkalmazást, amely lehetővé teszi felhasználók számára, hogy feliratkozzanak egy
hírlevélre. Az alkalmazás a következő funkciókat tartalmazza:
- Hírlevél-feliratkozási űrlap:
  - Név (5–40 karakter)
  - Email (valós email formátum)
  - Űrlap mezőnkénti validáció (hibaüzenetek)
  - Beküldés után sikeres/hibas visszajelzés
- Feliratkozók számlálója:
  - Mutatja a feliratkozók számát
  - Megjeleníti a legutóbbi feliratkozó nevét és emailjét
- Adatkezelés:
  - Használj mock API-t (pl. json-server, vagy saját mock adatkezelés)
  - Az adatok frissítése történjen 5 másodpercenként automatikusan, illetve sikeres feliratkozás után
azonnal
- Technológiai elvárások:
  - React (hooks használata kötelező)
  - State- és effektkezelés (pl. useState, useEffect)
  - Komponens-alapú felépítés
  - Stílusozás: bármilyen ingyenes CSS framework vagy saját CSS
  - Nincs szükség backendre, de az adatkezelést mock API-n keresztül szimuláld
- Extra (nem kötelező):
  - Egységteszt egy vagy több komponensre (pl. Jest, React Testing Library)
  - Responsív dizájn
 
# Solution
## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Clone the repository:

```bash
git clone https://github.com/tolacika/webinform.git
cd webinform
```

### Using Docker Compose

Docker Compose allows you to run both the PHP backend and React frontend in isolated containers.

#### 1. Build and Start All Services

```bash
docker-compose up --build
```

This command will:
- Build Docker images for both backend and frontend.
- Start containers for PHP (backend), React (frontend) and MySQL.
- Attach logs for both services.

#### 2. Access the Applications

- **PHP Backend**: Accessible at [http://localhost:8000](http://localhost:8000) (default, may vary depending on your `docker-compose.yml`).
- **React Frontend**: Accessible at [http://localhost:3000](http://localhost:3000) (default, may vary).

### PHP Backend

The backend is located in the `php/` directory.

**Composer dependencies** can be managed inside the container:
```bash
docker-compose exec php composer install
```


### React Frontend

The frontend is located in the `react/` directory.

**Install dependencies** inside the container:
```bash
docker-compose exec react npm install
```
