FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Cloud Run sets PORT (default 8080). Gunicorn is configured in gunicorn.conf.py.
CMD ["sh", "-c", "exec gunicorn tooli_uk.wsgi:application --config gunicorn.conf.py"]
