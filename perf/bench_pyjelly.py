from __future__ import annotations

import argparse
import io
import json
import statistics
import time
from importlib.metadata import version

from pyjelly.integrations.generic.generic_sink import IRI, Literal, Triple
from pyjelly.integrations.generic.parse import parse_jelly_flat
from pyjelly.integrations.generic.serialize import flat_stream_to_file


def measure(operation, runs: int, expected_count: int) -> dict[str, object]:
    for _ in range(2):
        result = operation()
        if result[0] != expected_count:
            raise RuntimeError(f"Expected {expected_count} statements, got {result[0]}")
    samples: list[float] = []
    size = 0
    for _ in range(runs):
        start = time.perf_counter()
        actual_count, size = operation()
        elapsed = (time.perf_counter() - start) * 1000
        if actual_count != expected_count:
            raise RuntimeError(f"Expected {expected_count} statements, got {actual_count}")
        samples.append(elapsed)
    milliseconds = statistics.median(samples)
    return {
        "milliseconds": milliseconds,
        "statementsPerSecond": expected_count / (milliseconds / 1000),
        "bytes": size,
        "samples": samples,
    }


arguments = argparse.ArgumentParser()
arguments.add_argument("--input", required=True)
arguments.add_argument("--count", type=int, required=True)
arguments.add_argument("--runs", type=int, default=7)
args = arguments.parse_args()

with open(args.input, "rb") as input_file:
    jelly = input_file.read()

triples = [
    Triple(
        IRI(f"https://example.org/s/{index}"),
        IRI("https://example.org/p"),
        Literal(str(index)),
    )
    for index in range(args.count)
]


def decode() -> tuple[int, int]:
    count = sum(1 for item in parse_jelly_flat(io.BytesIO(jelly)) if isinstance(item, Triple))
    return count, len(jelly)


def encode() -> tuple[int, int]:
    output = io.BytesIO()
    flat_stream_to_file((item for item in triples), output)
    return len(triples), output.tell()


print(json.dumps({
    "implementation": "pyjelly",
    "version": version("pyjelly"),
    "decode": measure(decode, args.runs, args.count),
    "encode": measure(encode, args.runs, args.count),
}))

