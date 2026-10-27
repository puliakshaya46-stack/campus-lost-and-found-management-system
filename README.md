# Campus Lost & Found

A Flask + SQLite web application for reporting, approving, browsing, and claiming campus lost-and-found items.

## Run in VS Code (Windows)

1. Open this folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Create a virtual environment:

```powershell
py -m venv .venv
```

4. Activate it:

```powershell
.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use Command Prompt instead:

```bat
.venv\Scripts\activate.bat
```

5. Install Flask:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

6. Start the application:

```powershell
python app.py
```

7. Open the address shown in the terminal, normally `http://127.0.0.1:5000/`.

## Staff login

- Username: `admin`
- Password: `admin123`

## Main pages

- Home: `/`
- Report Lost: `/lost`
- Report Found: `/found`
- Browse Items: `/browse`
- Staff Login: `/admin`
- Dashboard: `/dashboard`

The database file `campus_lost_found.db` is included so existing project data is preserved.
