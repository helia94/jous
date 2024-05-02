import logging
from flask_migrate import Migrate
from backend.api import create_app
from backend.api.models import db
from backend.add_categories import add_categories_1
import traceback

app, jwt = create_app()

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

@app.cli.command("runserver")
def run_server():
    """Run the Flask development server."""
    app.run(debug=True, host="0.0.0.0", port=5000)

@app.cli.command("runworker")
def run_worker():
    """Run a worker."""
    app.run(debug=False)

@app.cli.command("recreate_db")
def recreate_db():
    """
    Recreates a database. This should only be used once
    when there's a new database instance. This shouldn't be
    used when you migrate your database.
    """
    print("Recreating database")
    with app.app_context():
        db.drop_all()
        db.create_all()
        db.session.commit()
        add_categories_1()

@app.cli.command("create_all")
def create_all():
    """Create all database tables."""
    with app.app_context():
        db.create_all()
        add_categories_1()

if __name__ == "__main__":
    print("Running main")
    try:
        recreate_db()
        run_server()
    except Exception as e:
        print(traceback.format_stack())
