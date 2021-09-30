# Twitter-like web app with postgres-flask-react deployed with Heroku 
---

## run locally 

Set up the backend:

```shell
cd backend
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

Create the database:
```python
$ python3 # open the shell
import app
app.db.create_all()
```

Run the application
```shell script
python manage.py runserver
```

Set up the frontend in a new terminal window:

```shell
cd frontend
npm install
npm start
```

## run locally (alternative backend in docker)



## run as deployment would do

serves the node.js build through flask

```shell
cd frontend
npm ci 
npm run build
python wsgi
```


## deploy


## Features 

Available: 
* Add questions
* Answer Questions
* Ask and answer anonymously 
* Like questions
* User page
* Question detail page
* Make groups
* Group home page
* Post to group

To come:
* Special pages for game specific questions
* Polls
* Search in users and questions
* Ability to follow users
* Reask question
* Push Notification/Activity feed
* Tags for question themes 
* AI users with generated questions
* Syncing your account with twitter (Twitter bot that posts to jous automatically)

## Architecture
http://www.plantuml.com/plantuml/uml/ZLRDRjim3BxpAOJsiY48i0VeeS66TWE6eHqQx53qeCIguzMsCajkK7HvzycKwLAquouzrEH7wkCFAVlIUTtujYeXqrvlj3FgxBOrpXUsljERqfozWjtyDbklRhUsRAlQlKBhJAEA37nH6TZQsflQWzUvW_k77dFgiBEgB9wCr3L6koUJ1VM-tPJ5LkdQ7I8En_07B98Rj5YXWHFXtAn6yVpf0vUnJOM5N8pgkh7jVfhfUioKTzQpb6NXlBAFwbtYTJ0GXEiHNwt3qVevE3KX6MJlYlreoz8UYZfNWs2Q3g2mkcSTar9JnAlMxqAqnLPFD7mzpjjKkYXXhvsRh9yitE1FzS9Eo11Zryc9fc_zBTAcPJtlIkZWFCxG0Wkwm95IiDXRv-yiHWABVgpeOLNR-gMoRKT7LB7TiqIHWSVtgocyuK6I1zB38YjSOtBTP71CVOXjteDSC8ilneTwKu0X6frbE2-KP6dqiudFnzJrSpWlEEBaCAppZf1wmw09aAxpClInUb5VRHMQo9Mxe54xepFJf428Hr4Z0tBas6DHUjEepOloEaVmACySV1tY8XGScW18bUfS8vj4CYmO7SRWqkP5Z91hexaHEN2BjSEK4rtN2n7v2EwNRXeSrdO6bjxK7Cnp4g7S4xL-Cj45FTA2ADjwL4_449kDABRbmyTGOkDlgKvAEyLaYJjfuCYYAwYm4ig1x8hgW6PSmIsma6J2D6I3sn3nGG8UJTnBik0gICx0jK0ZfeWccVsEyzKBFqrUE6yQbB47Fym1NQ96PnbbIounRfBMTPo1mJm6T0RuawkZBfRtvv_2x-hgOPaMdGlgukzogPANkuAtYop2yco0TCUHgp5P869P083O2XcKxB5K_4ziaW9WlC2dYy5hCSKcuV6t1qI1mfaW5o5Fsm2xdz68hJMmPva9pUxm52c6xmTWTpiYyZO1eP0CVC6uy1wFlDH0AYGFtr8k2IPHS76pGY8A3h77gQXEzPTVVNpIQJrd36XZ0TXLp2pu9G0YB_PM4nCaGIx8XDcTn8Nnra_XewzVa5rEFqY0IMcab3ka8ZkZFn_Vo6aI_JKA_V_eS-8pbVnP3-ZQXRV7-IC0gBDoyAYXOuGtKc2pipoxKG3iCftgsF0AE3cxa7nZfcS4MSBi5gUJ-oFa0ARtFroQEckhyXy0

