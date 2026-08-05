"""Model-provider boundary for replaceable approved local providers."""
from __future__ import annotations

from typing import Any, Protocol


class AIProvider(Protocol):
    name: str

    def generate_structured(self, prompt: str, schema: dict[str, Any]) -> dict[str, Any]:
        """Return provider output parsed as a JSON object."""
        ...
