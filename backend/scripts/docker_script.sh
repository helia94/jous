#!/bin/bash
python backend/manage.py recreate_db
python backend/manage.py runserver