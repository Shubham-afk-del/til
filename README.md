# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 6 Nov 2026: **Encode and Decode Strings (decode by slicing):** I finished `decode`: `j = strs.index("#", i)` finds the next separator, `length = int(strs[i:j])` reads the number in front of it, `strs[j+1:j+1+length]` takes exactly that many characters, and `i = j + 1 + length` jumps to the next number. Reading by length is what makes it safe, because a `#` inside a word like `"a#b"` is just one of the counted characters, so my tests pass for that word, an empty string and an empty list.
- 6 Nov 2026: **LLM-as-judge (truncated JSON):** I built a small judge: I numbered the three models' answers with `enumerate(..., start=1)`, asked `qwen/qwen3.8-27b` on Groq to rank them and reply with JSON only, parsed the reply with `json.loads` and mapped each ranked number back to its model with `[n-1]`. On one run the judge's reason rambled and the reply stopped before its closing quote, probably at `max_tokens=500`, so `json.loads` failed with `JSONDecodeError`; the token budget has to fit the whole answer, and the reply needs a check before it is parsed.
- 5 Nov 2026: **Encode and Decode Strings (length prefix, decode in progress):** I wrote `encode` from memory to put `str(len(s)) + "#"` in front of every string, so a `#` inside a word like `"a#b"` cannot break the format. My `decode` finds the separator with `strs.index("#", i)` but then slices with the length text itself instead of `int(strs[i:j])`, so the fix I am working on is to read exactly that many characters after `j + 1` and move `i` past them.
- 3 Nov 2026: **Contains Duplicate (set, stop at the first repeat):** I rewrote it with a set instead of a count dict: for each number I return `True` as soon as it is already in the set, otherwise `box.add(i)`, and `return False` only after the loop. It stops at the first repeat instead of counting every number first, but the set can still grow to hold all n numbers, so the extra space is O(n), not O(1).
- 30 Oct 2026: **Contains Duplicate (hash map count):** I counted each number in a dict with `box[i] += 1` (or `box[i] = 1` the first time), then looped over the dict and returned `True` as soon as a count was `>= 2`. `return False` has to sit after the loop: inside an `else` it would end the function on the first number that is not a duplicate, which my own test `[1, 2, 2, 4]` catches. Both time and extra space are O(n).
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. If a note with the same bold label is already in the log, the script stops and says when that one was written, since it is usually the same lesson again; `./til --again "..."` files it anyway. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
