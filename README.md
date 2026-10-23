# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 23 Oct 2026: **Find Pivot Index (prefix sums, brute force first):** I wrote `pivot_index` that checks every index `i` and compares `sum(nums[:i])` with `sum(nums[i+1:])`, returning `-1` when no index balances, with test calls for edge cases like `[5]` and `[2, 1, -1]`. Each slice and sum is O(n), so this version is O(n^2) time with O(n) extra space per slice, which is why the next step is a running left sum against `total - left - nums[i]` for O(n).
- 23 Oct 2026: **LLM APIs (Azure OpenAI):** I built an `AzureOpenAI` client from `api_key`, `azure_endpoint` and `api_version="2024-08-01-preview"`, loading the keys with `load_dotenv(override=True)` and `os.environ`, then sent a `messages` list with `"role": "user"` to `client.chat.completions.create(model="gpt-5-mini")`. Keeping secrets in `.env` keeps them out of the notebook, and the same `chat.completions.create` call shape also works with the local Ollama client I tried earlier, so only the client setup changes between providers.
- 22 Oct 2026: **Top K Frequent Elements (hash map + sort):** I counted each number in a dictionary `box`, then sorted `box.items()` with `key=lambda x: x[1]` and `reverse=True` and took the first `k` keys. Counting is one O(n) pass and sorting the m distinct numbers costs O(m log m), so a heap or bucket sort would be the next step to get below a full sort.
- 20 Oct 2026: Solved pivot index with a brute-force loop: at each index I compare `sum(nums[:i])` with `sum(nums[i+1:])` and return the first index where they match, or -1. It gives 3, -1 and 0 on my three test arrays, but it re-sums both sides at every step, so it is O(n^2).
- 20 Oct 2026: Ran three small local models through Ollama with the same OpenAI client by pointing `base_url` at `http://localhost:11434/v1` (the key can be any string, here `ollama`), then looped over `granite3.1-dense:2b`, `llama3.2:3b-instruct-q4_0` and `qwen2.5:3b-instruct-q4_0` to collect their answers to one question.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
