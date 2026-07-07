FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=run.py
ENV FLASK_RUN_PORT=5005

EXPOSE 5005

CMD ["flask", "run", "--host=0.0.0.0", "--port=5005"]
