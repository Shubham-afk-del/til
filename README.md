# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 20 Oct 2026: Solved pivot index with a brute-force loop: at each index I compare `sum(nums[:i])` with `sum(nums[i+1:])` and return the first index where they match, or -1. It gives 3, -1 and 0 on my three test arrays, but it re-sums both sides at every step, so it is O(n^2).
- 19 Oct 2026: **Running Sum of 1d Array (prefix sum):** I wrote `running_sum(nums)` that keeps a `total` variable, adds each `num` to it and appends the new total to `new_list`, and tested it on `[1,2,3,4]`, a longer list and an empty list. Carrying the total forward means each element is added once, so it runs in O(n) time with O(n) space for the output list, instead of re-summing the prefix for every index.
- 18 Oct 2026: **Top K Frequent Elements (hash map):** I counted each number in a `box` dictionary with an `if num in box` / `else` check, then sorted `box.items()` and kept the first `k` keys. My sort uses `key=lambda x:x[0]`, which orders by the number itself instead of its count, so on `[1,1,1,2,3,3]` it returns `[3,2]` instead of `[1,3]`; switching to `x[1]` fixes it and keeps the cost at O(n log n).
- 18 Oct 2026: **LLM APIs (chained prompts):** I asked the model for a difficult computer science question, read it from `response.choices[0].message.content`, and sent that text back as a fresh `user` message in a second `chat.completions.create` call. Each call is stateless, so the second answer only knows about the question because I put it in the new `messages` list myself.
- 17 Oct 2026: **Group Anagrams (hash map):** I grouped words by using `"".join(sorted(word))` as a dictionary key, so every anagram of a word lands in the same list. Sorting each word costs O(k log k), so one pass over n words is O(n k log k) instead of comparing every pair.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
