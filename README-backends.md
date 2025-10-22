# Backends for NeuroFleetX

This workspace now contains two optional backends:

- `Backend-Node` (Express + MySQL) — runs on port 5000 by default
- `Backend-Java` (Spring Boot + MySQL) — runs on port 8080 by default

Frontend configuration

The frontend selects which backend to call using environment variables. Create a `.env` file in the `Frontend` folder (next to `package.json`) with one of these:

- To use Node backend (default):

```
REACT_APP_BACKEND=node
REACT_APP_API_URL=
```

- To use Java backend:

```
REACT_APP_BACKEND=java
REACT_APP_API_URL=
```

- Or override the base URL explicitly:

```
REACT_APP_API_URL=http://localhost:5000
```

How to run Node backend

```powershell
cd Backend-Node
npm install
copy .env.example .env
# edit .env to match your MySQL credentials
npm run dev
```

How to run Java backend

```powershell
cd Backend-Java
# edit src/main/resources/application.properties for DB credentials
mvn spring-boot:run
```

MySQL schema (command-line)

Run the SQL provided in `Backend-Node/schema.sql` or `Backend-Java/schema.sql` using the MySQL CLI:

```powershell
mysql -u root -p < Backend-Node/schema.sql
```

Switching backends

Change `REACT_APP_BACKEND` in the frontend `.env` and restart the frontend dev server.

Removing a backend

Because the two backends are independent, you can remove one of the `Backend-Node` or `Backend-Java` folders; update `REACT_APP_BACKEND` accordingly.
