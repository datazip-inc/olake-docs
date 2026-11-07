FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV PYTHONUNBUFFERED=1 HF_HOME=/app/.hf EMBEDDING_MODEL=minishlab/potion-base-8M

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
# Fresh scrape + index at build time (nightly redeploys keep it fresh).
# If the scrape fails, fall back to the committed data/ snapshot.
RUN python -m ingest.build || (echo "build scrape failed; using committed snapshot" && test -f data/chunks.jsonl) \
    && python -c "from model2vec import StaticModel; StaticModel.from_pretrained('minishlab/potion-base-8M')" \
    && rm -rf data/raw

ENV HF_HUB_OFFLINE=1
EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips='*'"]
