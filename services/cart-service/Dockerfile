FROM python:3.11-slim

WORKDIR /app

# Install dependencies for psycopg2 and curl for healthcheck
RUN apt-get update && apt-get install -y libpq-dev gcc curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment variables
ENV FLASK_APP=run.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

EXPOSE 5002

# Command to run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5002", "--workers", "3", "run:app"]
