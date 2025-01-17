#!/bin/bash
python manage.py makemigrations home contact_me projects
python manage.py migrate
