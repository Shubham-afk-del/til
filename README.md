# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 26 Oct 2026: **Two Sum (hash map):** I stored the index of each number in a dict `box` and, for every `nums[i]`, checked whether `need = target - nums[i]` was already in it before adding the current number. Each dict lookup is O(1) on average, so one pass gives O(n) time and O(n) space instead of checking every pair in O(n^2).
- 25 Oct 2026: **LLM APIs (token usage, temperature):** I read `prompt_tokens`, `completion_tokens` and `completion_tokens_details.reasoning_tokens` from `response.usage` on a `gpt-5-mini` call, then asked a local `qwen2.5:3b` model through Ollama for a chai stall name three times at `temperature=1.5` and for two capitals at `temperature=0`. Reasoning tokens are billed as output even though they never show in the reply, and a high temperature suits open questions like naming while `0` suits questions with one right answer.
- 25 Oct 2026: **Linear regression (train/test split):** I split eight data points with `train_test_split(x, y, test_size=0.25, random_state=0)` and fit `LinearRegression` on the training part only. Keeping a test set back is what lets me check the model on data it has not seen, and `random_state` makes the split the same every run.
- 24 Oct 2026: **LLM APIs (message history, tokens):** I wrapped `client.chat.completions.create` in a `call(messages)` helper, sent "Hi i am shubham" and "whats my name" as two separate calls, then sent one `messages` list holding a `system` prompt and both user turns. Each call is stateless, so the model can only know my name when the earlier turn is in the same list. I also encoded a sentence with `tiktoken.get_encoding("cl100k_base")`, printed `len(tokens)` and decoded each id with `encoding.decode([t])`, because context limits and prices are counted in tokens, not words.
- 23 Oct 2026: **Find Pivot Index (prefix sums, brute force first):** I wrote `pivot_index` that checks every index `i` and compares `sum(nums[:i])` with `sum(nums[i+1:])`, returning `-1` when no index balances, with test calls for edge cases like `[5]` and `[2, 1, -1]`. Each slice and sum is O(n), so this version is O(n^2) time with O(n) extra space per slice, which is why the next step is a running left sum against `total - left - nums[i]` for O(n).
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
