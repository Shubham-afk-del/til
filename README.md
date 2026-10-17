# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 17 Oct 2026: I grouped anagrams by using the sorted letters of each word, joined back with `"".join(sorted(word))`, as a dictionary key and appending matching words to a list under that key.
- 17 Oct 2026: I practised setting up an `AzureOpenAI` client with `api_key`, `azure_endpoint` and `api_version`, then calling `client.chat.completions.create` with the deployment name passed as `model`. Along the way I noticed that importing `OpenAI` instead of `AzureOpenAI`, or writing the version as `2024-8-01-preview`, breaks the setup.
- 16 Oct 2026: I solved the intersection of two arrays in Python by turning `nums2` into a set for fast membership checks and collecting matches from `nums1` into another set, so each common value appears only once in the result.
- 16 Oct 2026: I practised setting up an `AzureOpenAI` client in Python, reading the API key and endpoint from environment variables and passing `api_key`, `azure_endpoint` and `api_version` for a `gpt-5-mini` deployment. I haven't made a call with it yet.
- 15 Oct 2026: I solved the majority element problem by counting each number in a dictionary, then returning the one whose count is more than `len(nums)/2`, with `None` as the fallback when no such element exists.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
