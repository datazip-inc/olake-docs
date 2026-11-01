import os

from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://openrouter.ai/api/v1")
# Order chosen by measurement (organizers confirmed teams may reorder the 3 allowed models):
# DeepSeek scored 17/20 on the organizer examples vs 13/20 for GLM, and was faster.
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek/deepseek-v4.1-flash")
LLM_FALLBACK_MODELS = [m.strip() for m in os.getenv(
    "LLM_FALLBACK_MODELS", "google/gemini-2.5-flash-lite,z-ai/glm-4.7-flash").split(",") if m.strip()]
MAX_ANSWER_TOKENS = int(os.getenv("MAX_ANSWER_TOKENS", "800"))
LLM_TIMEOUT_S = float(os.getenv("LLM_TIMEOUT_S", "25"))
HEDGE_AFTER_S = float(os.getenv("HEDGE_AFTER_S", "6"))  # 0 disables hedged requests
# Optional query rewriting into docs vocabulary, e.g. REWRITE_MODEL=google/gemini-2.5-flash-lite
REWRITE_MODEL = os.getenv("REWRITE_MODEL", "")  # off: measured worse (97%->89% on our set); see README
REWRITE_TIMEOUT_S = float(os.getenv("REWRITE_TIMEOUT_S", "3"))

TOP_K = int(os.getenv("TOP_K", "20"))  # 20: judge-style questions needed chunks ranked 11-20
MAX_QUESTION_CHARS = int(os.getenv("MAX_QUESTION_CHARS", "4000"))  # room for pasted logs / stack traces

# Abuse / budget guards. The graders send the test set from one IP, so the per-IP
# limit is generous; the global daily cap is what protects the $3 credit.
RATE_LIMIT_PER_MIN = int(os.getenv("RATE_LIMIT_PER_MIN", "120"))
DAILY_LLM_CALL_CAP = int(os.getenv("DAILY_LLM_CALL_CAP", "3000"))

SUGGESTIONS_ENABLED = os.getenv("SUGGESTIONS_ENABLED", "1") == "1"
SUGGESTIONS_MODEL = os.getenv("SUGGESTIONS_MODEL", "")  # empty = use LLM_MODEL
MAX_SUGGESTIONS_TOKENS = int(os.getenv("MAX_SUGGESTIONS_TOKENS", "100"))

# GitHub webhook: set WEBHOOK_SECRET to the secret configured in GitHub repo settings.
# WEBHOOK_BRANCH filters pushes (default: main). Empty string = trigger on any branch push.
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "")
WEBHOOK_BRANCH = os.getenv("WEBHOOK_BRANCH", "main")
