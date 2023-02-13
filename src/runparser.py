from js import mode
from js import input_str
import json
from parse_equation import parse, calculate
if mode == "parse":
    output = json.dumps(parse(input_str))
elif mode == "calculate":
    input_str = json.loads(input_str)
    output = json.dumps(calculate(input_str))

output
