import click
from flask import current_app
from flask.cli import with_appcontext
from app import create_app
from api.models import db

app, _ = create_app()

@app.cli.command("recreate_db")
@with_appcontext
def recreate_db():
    """
    Drops all tables, creates them fresh.
    """
    db.drop_all()
    db.create_all()
    click.echo("Database recreated successfully.")

@app.cli.command("create_all")
@with_appcontext
def create_all():
    """
    Creates all tables (if they don't already exist).
    """
    db.create_all()
    click.echo("All tables created.")


@app.cli.command("runserver")
def run_server():
    """Run the Flask development server."""
    app.run(debug=True, host="0.0.0.0", port=5000)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
    with app.app_context():
        db.create_all()