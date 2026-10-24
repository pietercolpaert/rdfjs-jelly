"""Use the pinned upstream test generators as independent reference decoders."""
import base64
import json
from pathlib import Path
import sys

upstream, kind, fixture = sys.argv[1:]
test = Path(upstream) / "test"
sys.path.insert(0, str(test))
sys.path.insert(0, str(test / ("rdf/v1_2" if kind == "rdf" else "sparql") / "generator"))
import decoder  # noqa: E402
import model  # noqa: E402

cases = json.loads(Path(fixture).read_text())
for case in cases:
    actual = decoder.decode(base64.b64decode(case["actual"]))
    expected = decoder.decode(base64.b64decode(case["expected"]))
    if kind == "rdf":
        _, physical, stream_type = decoder.decode_stream(base64.b64decode(case["actual"]))
        _, expected_physical, expected_stream_type = decoder.decode_stream(base64.b64decode(case["expected"]))
        if (physical, stream_type) != (expected_physical, expected_stream_type):
            raise AssertionError(f'{case["name"]}: stream options differ')
        difference = model.equivalent_result(expected, actual, stream_type == 1)
        if difference:
            raise AssertionError(f'{case["name"]}: {difference}')
    else:
        if isinstance(actual, list) != isinstance(expected, list):
            raise AssertionError(f'{case["name"]}: stream types differ')
        actual = actual if isinstance(actual, list) else [actual]
        expected = expected if isinstance(expected, list) else [expected]
        if len(actual) != len(expected):
            raise AssertionError(f'{case["name"]}: result counts differ')
        for left, right in zip(expected, actual):
            difference = model.equivalent(left, right)
            if difference:
                raise AssertionError(f'{case["name"]}: {difference}')
            if not isinstance(left, model.AskResult) and left.links != right.links:
                raise AssertionError(f'{case["name"]}: links differ')
print(f"Upstream Python decoder verified {len(cases)} {kind} writer fixtures.")
