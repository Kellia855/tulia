from fastapi import APIRouter, Query
from typing import Dict, List, Optional
from urllib import parse, request
import json
import time

router = APIRouter()

VOCAB_CATEGORIES = [
    {"name": "Joyful", "description": "Positive, energized emotions"},
    {"name": "Peaceful", "description": "Calm, grounded emotions"},
    {"name": "Powerful", "description": "Confident, capable emotions"},
    {"name": "Sad", "description": "Low, heavy emotions"},
    {"name": "Fearful", "description": "Anxious, uncertain emotions"},
    {"name": "Angry", "description": "Frustrated, intense emotions"},
]

CURATED_VOCAB = [
    {"word": "Grateful", "category": "Joyful", "definition": "Feeling thankful and appreciative.", "intensity": "Medium", "source": "curated"},
    {"word": "Exuberant", "category": "Joyful", "definition": "Filled with lively energy and excitement.", "intensity": "High", "source": "curated"},
    {"word": "Hopeful", "category": "Joyful", "definition": "Feeling optimistic about future outcomes.", "intensity": "Medium", "source": "curated"},
    {"word": "Serene", "category": "Peaceful", "definition": "Calm, peaceful, and untroubled.", "intensity": "Low", "source": "curated"},
    {"word": "Content", "category": "Peaceful", "definition": "In a state of peaceful happiness.", "intensity": "Low", "source": "curated"},
    {"word": "Grounded", "category": "Peaceful", "definition": "Emotionally stable and centered.", "intensity": "Low", "source": "curated"},
    {"word": "Empowered", "category": "Powerful", "definition": "Feeling strong and confident in your abilities.", "intensity": "High", "source": "curated"},
    {"word": "Resilient", "category": "Powerful", "definition": "Able to recover quickly from difficulties.", "intensity": "Medium", "source": "curated"},
    {"word": "Determined", "category": "Powerful", "definition": "Having firmness of purpose.", "intensity": "Medium", "source": "curated"},
    {"word": "Melancholy", "category": "Sad", "definition": "A deep, thoughtful sadness.", "intensity": "Low", "source": "curated"},
    {"word": "Isolated", "category": "Sad", "definition": "Feeling emotionally alone or disconnected.", "intensity": "Medium", "source": "curated"},
    {"word": "Disheartened", "category": "Sad", "definition": "Having lost hope or confidence.", "intensity": "Medium", "source": "curated"},
    {"word": "Apprehensive", "category": "Fearful", "definition": "Anxious that something bad may happen.", "intensity": "Medium", "source": "curated"},
    {"word": "Uneasy", "category": "Fearful", "definition": "Slightly worried or uncomfortable.", "intensity": "Low", "source": "curated"},
    {"word": "Overwhelmed", "category": "Fearful", "definition": "Feeling unable to cope with demands.", "intensity": "High", "source": "curated"},
    {"word": "Irritated", "category": "Angry", "definition": "Slightly angry or annoyed.", "intensity": "Low", "source": "curated"},
    {"word": "Frustrated", "category": "Angry", "definition": "Upset because something is blocked or difficult.", "intensity": "Medium", "source": "curated"},
    {"word": "Enraged", "category": "Angry", "definition": "Very angry; furious.", "intensity": "High", "source": "curated"},
]

CATEGORY_HINTS: Dict[str, List[str]] = {
    "Joyful": ["joy", "happy", "grateful"],
    "Peaceful": ["calm", "peace", "content"],
    "Powerful": ["confident", "resilient", "motivated"],
    "Sad": ["sad", "lonely", "melancholy"],
    "Fearful": ["anxious", "afraid", "nervous"],
    "Angry": ["angry", "frustrated", "irritated"],
}

_DATAMUSE_CACHE: Dict[str, Dict[str, object]] = {}
_DEFINITION_CACHE: Dict[str, Dict[str, object]] = {}
_CACHE_TTL_SECONDS = 60 * 60 * 6
_DEFINITION_CACHE_TTL_SECONDS = 60 * 60 * 24 * 7


def _guess_category(term: str, fallback: Optional[str]) -> str:
    if fallback:
        return fallback

    lowered = term.lower()
    for category, hints in CATEGORY_HINTS.items():
        if any(hint in lowered for hint in hints):
            return category
    return "Peaceful"


def _guess_intensity(term: str) -> str:
    lowered = term.lower()
    if any(token in lowered for token in ["panic", "rage", "devastat", "furious", "enrag"]):
        return "High"
    if any(token in lowered for token in ["uneasy", "annoy", "calm", "mild"]):
        return "Low"
    return "Medium"


def _fetch_datamuse_related(query: str, limit: int, category: Optional[str]) -> List[dict]:
    cache_key = f"{query.lower()}::{category or 'all'}::{limit}"
    now = time.time()
    cache_item = _DATAMUSE_CACHE.get(cache_key)
    if cache_item and now - cache_item["ts"] < _CACHE_TTL_SECONDS:
        return cache_item["data"]  # type: ignore[return-value]

    encoded_query = parse.urlencode({"ml": query, "max": max(limit * 2, 20), "md": "d"})
    endpoint = f"https://api.datamuse.com/words?{encoded_query}"

    try:
        with request.urlopen(endpoint, timeout=6) as response:
            payload = response.read().decode("utf-8")
            words = json.loads(payload)
    except Exception:
        return []

    results: List[dict] = []
    seen = set()

    for item in words:
        word = (item.get("word") or "").strip()
        if not word:
            continue
        if not word.isalpha():
            continue
        if len(word) < 3 or len(word) > 24:
            continue

        lowered = word.lower()
        if lowered in seen:
            continue
        seen.add(lowered)

        inferred_category = _guess_category(word, category)
        datamuse_definition = None
        defs = item.get("defs") or []
        if defs:
            first_def = str(defs[0])
            parts = first_def.split("\t", 1)
            datamuse_definition = parts[1].strip() if len(parts) > 1 else first_def.strip()

        results.append(
            {
                "word": word.capitalize(),
                "category": inferred_category,
                "definition": datamuse_definition or f"Emotion-related term associated with '{query}'.",
                "intensity": _guess_intensity(word),
                "source": "datamuse",
            }
        )

        if len(results) >= limit:
            break

    _DATAMUSE_CACHE[cache_key] = {"ts": now, "data": results}
    return results


def _fetch_dictionary_definition(word: str) -> Optional[str]:
    cache_key = word.lower()
    now = time.time()
    cache_item = _DEFINITION_CACHE.get(cache_key)
    if cache_item and now - cache_item["ts"] < _DEFINITION_CACHE_TTL_SECONDS:
        return cache_item["definition"]  # type: ignore[return-value]

    endpoint = f"https://api.dictionaryapi.dev/api/v2/entries/en/{parse.quote(word.lower())}"

    try:
        with request.urlopen(endpoint, timeout=6) as response:
            payload = response.read().decode("utf-8")
            data = json.loads(payload)
    except Exception:
        return None

    definition: Optional[str] = None
    if isinstance(data, list):
        for entry in data:
            meanings = entry.get("meanings") or []
            for meaning in meanings:
                defs = meaning.get("definitions") or []
                for definition_item in defs:
                    text = (definition_item.get("definition") or "").strip()
                    if text:
                        definition = text
                        break
                if definition:
                    break
            if definition:
                break

    if definition:
        _DEFINITION_CACHE[cache_key] = {"ts": now, "definition": definition}

    return definition


def _attach_dictionary_definitions(items: List[dict], query: str) -> List[dict]:
    # Keep external calls bounded for performance.
    max_lookups = 15
    lookups = 0

    for item in items:
        current_definition = item.get("definition", "")
        if current_definition and not current_definition.startswith("Emotion-related term associated with"):
            continue
        if lookups >= max_lookups:
            break

        word = item.get("word")
        if not word:
            continue

        lookup_definition = _fetch_dictionary_definition(str(word))
        lookups += 1

        if lookup_definition:
            item["definition"] = lookup_definition
        else:
            item["definition"] = f"Emotion-related term associated with '{query}'."

    return items


@router.get("/categories")
def list_vocab_categories():
    return VOCAB_CATEGORIES


@router.get("/search")
def search_vocab(
    q: str = Query("", min_length=0, max_length=50),
    category: Optional[str] = Query(None),
    limit: int = Query(30, ge=1, le=100),
):
    query = q.strip()

    curated = CURATED_VOCAB
    if category:
        curated = [entry for entry in curated if entry["category"] == category]

    if query:
        lowered = query.lower()
        curated = [
            entry
            for entry in curated
            if lowered in entry["word"].lower() or lowered in entry["definition"].lower()
        ]

    results = curated[:limit]

    if len(results) < limit and query:
        needed = limit - len(results)
        datamuse_results = _fetch_datamuse_related(query, needed, category)
        datamuse_results = _attach_dictionary_definitions(datamuse_results, query)
        existing_words = {entry["word"].lower() for entry in results}
        for entry in datamuse_results:
            definition = str(entry.get("definition") or "").strip()
            if not definition or definition.startswith("Emotion-related term associated with"):
                continue
            if entry["word"].lower() not in existing_words:
                results.append(entry)
            if len(results) >= limit:
                break

    return {"items": results, "count": len(results)}
