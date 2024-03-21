from flask_migrate import Migrate
from backend.api import create_app
from backend.api.models import db

app, jwt = create_app()

# Initialize Flask-Migrate
migrate = Migrate(app, db)

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
    db.drop_all()
    db.create_all()
    db.session.commit()

@app.cli.command("create_all")
def create_all():
    """Create all database tables."""
    db.create_all()

if __name__ == "__main__":
    app.run()
