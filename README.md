# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on agentic AI and large language models, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 14 Oct 2026: Chained two LLM calls: the first model writes a hard maths question and the second solves it. The second call's content has to be the variable holding the first answer, not the text in quotes.
- 14 Oct 2026: In `AzureOpenAI(...)`, `api_version` takes a date like `2024-08-01-preview`. The model's name goes in `deployment_name` instead.
- 13 Oct 2026: Started week 1 of the agentic AI course: `load_dotenv(override=True)` reads my keys from `.env`. `os.getenv` returns `None` for a missing key, while `os.environ[...]` raises a `KeyError`, so for API keys I use `os.environ` and let it fail early.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above, commits and pushes. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it the same way. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
