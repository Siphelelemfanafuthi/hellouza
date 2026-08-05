"""Approved, auditable vendor command catalogue."""
from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

from dauglas.models.troubleshooting import ApprovedCommand
from dauglas.safety_engine import SafetyClass, classify_command


class CommandCatalogue:
    def __init__(self, catalogue_path: Path):
        payload = yaml.safe_load(catalogue_path.read_text(encoding="utf-8")) or {}
        self.commands: dict[str, ApprovedCommand] = {}
        for item in payload.get("commands", []):
            command = ApprovedCommand(
                command_id=item["command_id"], vendor=item["vendor"], intent=item["intent"],
                template=item["template"], safety=item["safety"],
                supported_device_types=tuple(item.get("supported_device_types", [])),
                requires_parameters=tuple(item.get("requires_parameters", [])),
            )
            if command.safety != SafetyClass.READ_ONLY.value:
                raise ValueError(f"v0.2 catalogue command {command.command_id} is not READ_ONLY")
            sample = command.template
            for parameter in command.requires_parameters:
                sample = sample.replace("{" + parameter + "}", "GigabitEthernet0/0/1")
            if classify_command(sample) != SafetyClass.READ_ONLY:
                raise ValueError(f"Catalogue command {command.command_id} fails deterministic safety classification")
            self.commands[command.command_id] = command

    def render(self, command_id: str, parameters: dict[str, str], vendor: str, device_type: str) -> str:
        command = self.commands.get(command_id)
        if not command:
            raise KeyError(f"Command {command_id} is not approved")
        if command.vendor.lower() != vendor.lower():
            raise ValueError(f"Command {command_id} is not approved for {vendor}")
        if command.supported_device_types and device_type.lower() not in {item.lower() for item in command.supported_device_types}:
            raise ValueError(f"Command {command_id} is not approved for device type {device_type}")
        rendered = command.render(parameters)
        if classify_command(rendered) != SafetyClass.READ_ONLY:
            raise ValueError("Rendered command failed safety validation")
        return rendered
