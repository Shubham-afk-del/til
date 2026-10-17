# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 18 Oct 2026: **Top K Frequent Elements (hash map):** I counted each number in a `box` dictionary with an `if num in box` / `else` check, then sorted `box.items()` and kept the first `k` keys. My sort uses `key=lambda x:x[0]`, which orders by the number itself instead of its count, so on `[1,1,1,2,3,3]` it returns `[3,2]` instead of `[1,3]`; switching to `x[1]` fixes it and keeps the cost at O(n log n).
- 17 Oct 2026: **Group Anagrams (hash map):** I grouped words by using `"".join(sorted(word))` as a dictionary key, so every anagram of a word lands in the same list. Sorting each word costs O(k log k), so one pass over n words is O(n k log k) instead of comparing every pair.
- 17 Oct 2026: **LLM APIs (Azure OpenAI):** I wrote a chat request to a `gpt-5-mini` deployment with `client.chat.completions.create`, passing the Azure deployment name as `model` and reading the reply from `response.choices[0].message.content`. Comparing my earlier attempts, the client has to be `AzureOpenAI`, not `OpenAI`, and `api_version` needs the full date, `2024-08-01-preview`.
- 16 Oct 2026: I solved the intersection of two arrays in Python by turning `nums2` into a set for fast membership checks and collecting matches from `nums1` into another set, so each common value appears only once in the result.
- 16 Oct 2026: I practised setting up an `AzureOpenAI` client in Python, reading the API key and endpoint from environment variables and passing `api_key`, `azure_endpoint` and `api_version` for a `gpt-5-mini` deployment. I haven't made a call with it yet.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
