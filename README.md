# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 29 Oct 2026: **LLM APIs (one client, many providers):** I wrote a `PROVIDERS` dict mapping `ollama`, `groq` and `gemini` to a `(base_url, key_name)` pair, a `get_client(provider)` that returns `OpenAI(base_url=base_url, api_key=api_key)` with a placeholder key for local Ollama, and an `ask()` helper that adds `reasoning_effort="low"` only for `openai/gpt-oss` models. Then I sent one two-coin probability question to `qwen2.5:3b-instruct-q4_0`, `llama3.2:3b-instruct-q4_0` and Groq's `openai/gpt-oss-120b`: both 3B models said 0.5 and gpt-oss-120b said 2/3, the answer when "one of them is heads" means at least one (HH, HT and TH are equally likely). Every provider speaks the same chat completions format, so changing models is only a new URL and key.
- 29 Oct 2026: **LLM-as-judge (reading the verdict):** I practised the last step of a judge on a hand-written verdict: `json.loads('{"ranking":[3,1,2],"reason":"Answer 3 is correct"}')` turns the judge's text into a dict, and `verdict["ranking"][0]` gives the winning answer number. The ranking counts answers from 1 but Python lists start at 0, so `names[n-1]` maps answer 3 to `"gpt-oss-120b"`.
- 28 Oct 2026: **LLM APIs (raw HTTP, Groq):** I called Ollama's chat endpoint by hand with `requests.post("http://localhost:11434/v1/chat/completions", json={...})` and read `r.json()["choices"][0]["message"]["content"]`, then pointed the OpenAI client at Groq with `base_url="https://api.groq.com/openai/v1"` to call `openai/gpt-oss-120b` with `reasoning_effort="low"`. Writing the request myself showed the SDK is a thin wrapper over one JSON POST, and `reasoning_effort` is just another field in that request, telling a reasoning model how much to think before it answers.
- 27 Oct 2026: **LLM APIs (scripted conversation turns):** I sent a `messages` list with a `system` prompt for a chai stall waiter, a user question, an `assistant` turn I wrote myself ("Ek chai 10 rupees ki hai.") and a follow-up asking about three chai, at `temperature=0`. The model reads earlier assistant turns as things it already said, so writing one into the history sets the price it uses in the next answer.
- 27 Oct 2026: **Logistic regression (classification):** I fit `LogisticRegression` on six points with two features each and labels `0` or `1`, then predicted the class of `[4, 1]` and `[0, 0]`. Unlike linear regression it predicts a class by turning a weighted sum into a probability between 0 and 1, which is why the targets are labels rather than numbers to estimate.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
