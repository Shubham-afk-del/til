# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 3 Nov 2026: **Contains Duplicate (set, stop at the first repeat):** I rewrote it with a set instead of a count dict: for each number I return `True` as soon as it is already in the set, otherwise `box.add(i)`, and `return False` only after the loop. It stops at the first repeat instead of counting every number first, but the set can still grow to hold all n numbers, so the extra space is O(n), not O(1).
- 30 Oct 2026: **Contains Duplicate (hash map count):** I counted each number in a dict with `box[i] += 1` (or `box[i] = 1` the first time), then looped over the dict and returned `True` as soon as a count was `>= 2`. `return False` has to sit after the loop: inside an `else` it would end the function on the first number that is not a duplicate, which my own test `[1, 2, 2, 4]` catches. Both time and extra space are O(n).
- 30 Oct 2026: **FizzBuzz (order of checks):** I wrote `fizzBuzz(n)` HackerRank style, printing one line for each `i` in `range(1, n + 1)`, since `range` stops one before its end. The `i % 3 == 0 and i % 5 == 0` check has to come first: in an `if`/`elif` chain, 15 would otherwise stop at `i % 3 == 0` and print `Fizz` instead of `FizzBuzz`.
- 29 Oct 2026: **LLM APIs (one client, many providers):** I wrote a `PROVIDERS` dict mapping `ollama`, `groq` and `gemini` to a `(base_url, key_name)` pair, a `get_client(provider)` that returns `OpenAI(base_url=base_url, api_key=api_key)` with a placeholder key for local Ollama, and an `ask()` helper that adds `reasoning_effort="low"` only for `openai/gpt-oss` models. Then I sent one two-coin probability question to `qwen2.5:3b-instruct-q4_0`, `llama3.2:3b-instruct-q4_0` and Groq's `openai/gpt-oss-120b`: both 3B models said 0.5 and gpt-oss-120b said 2/3, the answer when "one of them is heads" means at least one (HH, HT and TH are equally likely). Every provider speaks the same chat completions format, so changing models is only a new URL and key.
- 29 Oct 2026: **LLM-as-judge (reading the verdict):** I practised the last step of a judge on a hand-written verdict: `json.loads('{"ranking":[3,1,2],"reason":"Answer 3 is correct"}')` turns the judge's text into a dict, and `verdict["ranking"][0]` gives the winning answer number. The ranking counts answers from 1 but Python lists start at 0, so `names[n-1]` maps answer 3 to `"gpt-oss-120b"`.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
