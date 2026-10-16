# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 16 Oct 2026: I solved the intersection of two arrays in Python by turning `nums2` into a set for fast membership checks and collecting matches from `nums1` into another set, so each common value appears only once in the result.
- 15 Oct 2026: I solved the majority element problem by counting each number in a dictionary, then returning the one whose count is more than `len(nums)/2`, with `None` as the fallback when no such element exists.
- 15 Oct 2026: I worked on the valid anagram problem by building a letter count dictionary for each string and returning `box==box2`, since two dictionaries compare equal when they hold the same keys with the same counts.
- 14 Oct 2026: Chained two LLM calls: the first model writes a hard maths question and the second solves it. The second call's content has to be the variable holding the first answer, not the text in quotes.
- 14 Oct 2026: In `AzureOpenAI(...)`, `api_version` takes a date like `2024-08-01-preview`. The model's name goes in `deployment_name` instead.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
