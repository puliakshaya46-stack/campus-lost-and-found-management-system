from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime
from pathlib import Path

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATABASE = str(BASE_DIR / "campus_lost_found.db")


# -----------------------------
# Database connection
# -----------------------------
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# -----------------------------
# Create database
# -----------------------------
def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending',
            student_name TEXT NOT NULL,
            item_name TEXT NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT NOT NULL,
            contact TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# -----------------------------
# Web pages
# -----------------------------

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/lost")
def lost():
    return render_template("lost.html")


@app.route("/found")
def found():
    return render_template("found.html")


@app.route("/browse")
def browse():
    return render_template("browse.html")


@app.route("/admin")
def admin():
    return render_template("admin.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# -----------------------------
# Get all items
# -----------------------------

@app.route("/api/items", methods=["GET"])
def get_items():

    conn = get_db()

    items = conn.execute("""
        SELECT
            id,
            type,
            status,
            student_name AS studentName,
            item_name AS itemName,
            category,
            date,
            location,
            description,
            contact,
            created_at AS createdAt
        FROM items
        ORDER BY id DESC
    """).fetchall()

    conn.close()

    return jsonify([dict(item) for item in items])


# -----------------------------
# Add lost/found item
# -----------------------------

@app.route("/api/items", methods=["POST"])
def add_item():

    data = request.get_json()

    required_fields = [
        "type",
        "studentName",
        "itemName",
        "category",
        "date",
        "location",
        "description",
        "contact"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    conn = get_db()

    cursor = conn.execute("""
        INSERT INTO items (
            type,
            status,
            student_name,
            item_name,
            category,
            date,
            location,
            description,
            contact,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["type"],
        "Pending",
        data["studentName"],
        data["itemName"],
        data["category"],
        data["date"],
        data["location"],
        data["description"],
        data["contact"],
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    conn.commit()

    item_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "success": True,
        "message": "Report submitted successfully!",
        "id": item_id
    })


# -----------------------------
# Update item status
# -----------------------------

@app.route("/api/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):

    data = request.get_json()

    status = data.get("status")

    if status not in ["Pending", "Approved", "Claimed"]:
        return jsonify({
            "success": False,
            "message": "Invalid status."
        }), 400

    conn = get_db()

    cursor = conn.execute("""
        UPDATE items
        SET status = ?
        WHERE id = ?
    """, (status, item_id))

    conn.commit()

    updated = cursor.rowcount

    conn.close()

    if updated == 0:
        return jsonify({
            "success": False,
            "message": "Item not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Item status updated."
    })


# -----------------------------
# Delete item
# -----------------------------

@app.route("/api/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):

    conn = get_db()

    cursor = conn.execute("""
        DELETE FROM items
        WHERE id = ?
    """, (item_id,))

    conn.commit()

    deleted = cursor.rowcount

    conn.close()

    if deleted == 0:
        return jsonify({
            "success": False,
            "message": "Item not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Item deleted successfully."
    })


# -----------------------------
# Start application
# -----------------------------

init_db()


if __name__ == "__main__":
    app.run(debug=True)

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )