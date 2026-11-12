# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 12 Nov 2026: **Structured output (JSON schema from Pydantic):** I turned my `CVinfo` model into a schema with `CVinfo.model_json_schema()` and passed it to a local `qwen2.5:3b` through Ollama as `response_format={"type": "json_schema", "json_schema": {..., "strict": True}}`. From one sentence about Priya it returned `{"name": "priya sharma", "skills": ["python", "SQL", "Tableau", "FastAPI"], "years_experience": 4}`, which `CVinfo.model_validate_json` accepted, so the schema tells the model the shape and Pydantic checks that it came back that way. My retry loop for replies that fail validation is still unfinished.
- 11 Nov 2026: **Product of Array Except Self (brute force):** For each position `i` I start `prod` at 1 and multiply every `nums[j]` with `j != i`, so the number I am standing on is the one left out, then append `prod` to the answer. It gives `[24, 12, 8, 6]` for `[1, 2, 3, 4]` and gets the zero cases right, but the two nested loops make it O(n²), so it times out on a big input, and a faster version has to reuse products instead of recomputing them for every position.
- 11 Nov 2026: **Structured output (Pydantic validation):** I defined `CVinfo(BaseModel)` with `name: str`, `skills: list[str]` and `years_experience: int`, plus `ConfigDict(extra="forbid")` so unknown keys are rejected, and ran `model_validate_json` on two JSON strings. The good one became a `CVinfo` object and `"years_experience": "4 years"` raised a `ValidationError` (`int_parsing`), so a model's JSON can be checked for shape and types before my code trusts it, though Pydantic cannot tell whether the facts in it are true.
- 9 Nov 2026: **LLM APIs (chat loop from memory):** I rebuilt my chat loop twice, on Azure `gpt-5-mini` and then from memory on a local Ollama model, and three slips taught me the most. The `messages` list has to be created before the `while True` loop, because creating it inside wipes the history every turn, so the model forgets earlier turns such as my name. Importing `load_dotenv` is not enough: `os.environ[...]` raised a `KeyError` until I actually called `load_dotenv(override=True)`. And with Ollama, `model` must be the model's name, such as `qwen2.5:3b-instruct-q4_0`, while `"ollama"` is only the placeholder API key.
- 7 Nov 2026: **Loss (mean squared error):** I computed MSE by hand with NumPy: `errors = actual - guess`, then `(errors**2).mean()`. For actual values `[50, 60, 70]`, the close guess `[48, 63, 69]` gives 4.67 and the far guess `[40, 75, 60]` gives 141.67. Squaring stops plus and minus errors from cancelling out and makes one big miss cost far more than several small ones, so a lower loss means predictions that sit closer to the real values.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. If a note with the same bold label is already in the log, the script stops and says when that one was written, since it is usually the same lesson again; `./til --again "..."` files it anyway. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
