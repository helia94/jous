init:
	python -m pip install pipenv
	python -m pipenv install -r "requirements.txt" --dev
	cd frontend && npm i

dev-flask:
	python -m pipenv run python app.py

dev-react:
	cd frontend && npm start

flask: dev-flask
react: dev-react

production:
	cd frontend && npm ci && npm run build
	python -m pipenv run gunicorn wsgi:app

prod: production
