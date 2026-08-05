"""Local Ollama implementation of the AIProvider contract."""
from __future__ import annotations

import json
import urllib.request
from dataclasses import dataclass
from typing import Any


@dataclass
class OllamaProvider:
    model: str = "llama3.2:1b"
    endpoint: str = "http://127.0.0.1:11434/api/generate"
    timeout_seconds: int = 180
    name: str = "ollama-local"

    def generate_structured(self, prompt: str, schema: dict[str, Any]) -> dict[str, Any]:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "format": schema,
            "options": {"temperature": 0.0},
        }
        request = urllib.request.Request(self.endpoint, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(request, timeout=self.timeout_seconds) as response:
            envelope = json.loads(response.read().decode("utf-8"))
        result = json.loads(envelope["response"])
        if not isinstance(result, dict):
            raise ValueError("Provider returned a non-object JSON response")
        return result
