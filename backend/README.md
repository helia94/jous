
 Documentation is provided in the [wiki page](https://github.com/tko22/flask-boilerplate/wiki) of the repository used for backend.
 
 

First start a postgres docker container and persist the data with a volume `flask-app-db`:

```
docker run -e POSTGRES_USER=testusr -e POSTGRES_PASSWORD=password -e POSTGRES_DB=testdb -p 5432:5432 -v flask-app-db:/var/lib/postgresql/data -d postgres:10
```

Another option is to create a postgres instance on a cloud service like elephantsql and connect it to this app. Remember to change the postgres url and don't hard code it in!

Then, start your virtual environment

```
$ pip3 install virtualenv
$ virtualenv venv
$ source venv/bin/activate
```
Now, install the python dependencies and run the server:
```
(venv) $ pip install -r requirements.txt
(venv) $ pip install -r requirements-dev.txt
(venv) $ python manage.py recreate_db
(venv) $ python manage.py runserver
```

To exit the virtual environment:
```
(venv) $ deactivate
$
```

For ease of setup, I have hard-coded postgres URLs for development and docker configurations. If you are using a separate postgres instance as mentioned above, _do not hardcode_ the postgres url including the credentials to your code. Instead, create a file called `creds.ini` in the same directory level as `manage.py` and write something like this:

```
[pg_creds]
pg_url = postgresql://testusr:password@127.0.0.1:5432/testdb
```
Note: you will need to call `api.core.get_pg_url` in the Config file.

For production, you should do something similar with the flask `SECRET_KEY`.

If you like to destroy your docker postgres database and start over, run:

```
(venv) $ python manage.py recreate_db
```

### backend Contents

- `api/views/` - Holds files that define your endpoints
- `api/models/` - Holds files that defines your database schema
- `api/__init__.py` - What is initially ran when you start your application
- `api/utils.py` - utility functions and classes - explained [here](https://github.com/tko22/flask-boilerplate/wiki/Conventions)
- `api/core.py` - includes core functionality including error handlers and logger
- `api/wsgi.py` - app reference for gunicorn
- `tests/` - Folder holding tests

#### Others

- `config.py` - Provides Configuration for the application. There are two configurations: one for development and one for production using Heroku.
- `manage.py` - Command line interface that allows you to perform common functions with a command
- `requirements.txt` - A list of python package dependencies the application requires
- `runtime.txt` & `Procfile` - configuration for Heroku
- `Dockerfile` - instructions for Docker to build the Flask app
- `docker-compose.yml` - config to setup this Flask app and a Database
- `migrations/` - Holds migration files – doesn't exist until you `python manage.py db init` if you decide to not use docker
