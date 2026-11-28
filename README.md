# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 28 Nov 2026: **LLM-as-judge (the shape you ask for):** I wrote my judge loop from memory with a new question of my own, how many t's are in "letters". My first letter asked the judge for explanations and showed the format as `{"ranking":[answer,numbers]}`, so gpt-5-mini sent the ranking back as dicts holding the answers, and `entries[n - 1]` crashed with a TypeError. My coach's rule fixed it: the shape you ask for must be the shape your code reads. With `{"ranking": [answer numbers], "reason": "one sentence"}` in the letter, it returned `[2, 1]` and both numbers mapped to the right model names.
- 27 Nov 2026: **Valid Palindrome (clean, then two pointers):** I built a cleaned copy that keeps only `isalnum()` characters, lowercased, then moved `L` from the start and `R` from the end while `L < R`, returning False at the first pair of letters that differ. It took nine hints from my coach, and two bugs taught me the most: `L == R` compares positions, not letters, so "abc" came out True, and `return True` has to wait until after the loop, or "abca" passes after one matching pair. One pass to clean and one to compare is O(n) time, not O(n²), and the cleaned copy is O(n) space.
- 22 Nov 2026: **Gradio streaming (L05 finished):** I finished my chai stall chat UI with a line-by-line walk-through, typing every line myself. `chat(message, history)` now calls the model with `stream=True` and works as a generator: each chunk's `delta.content or ""` goes onto a `reply` string and I `yield reply`, the whole answer so far, so Gradio redraws the reply as it arrives. The bot remembers because Gradio passes `history` in on every turn and I put it between the system prompt and the new message. It answered "Your name is Shubham! A samosa is 25 rupees." from a name I gave it earlier in the chat.
- 20 Nov 2026: **Gradient descent (chai sugar):** I wrote `complaint(sugar) = 2 * (sugar - 3)`, which says how far the sugar is from the best amount and in which direction, then ran 20 steps of `sugar = sugar - 0.1 * complaint(sugar)` starting from 0 and got 2.965, close to the best amount of 3. The minus sign moves the sugar against the complaint, and the 0.1 learning rate sets the step size: too big a step jumps past 3 and never settles.
- 20 Nov 2026: **Chat UI (Gradio, first launch):** I launched my first `gr.ChatInterface(fn=chat)` for a chai stall helper. Gradio calls `chat(message, history)` on every turn, and my function rebuilds the model's `messages` from the system prompt, the earlier turns in `history` and the new message. It does not answer yet, because the streaming loop that should `yield` the growing reply is still outside the function, so that is the next fix.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. If a note with the same bold label is already in the log, the script stops and says when that one was written, since it is usually the same lesson again; `./til --again "..."` files it anyway. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
