# Today I learned

A short note most days on something I learned: in my MSc in AI at Northeastern University London, in my dissertation on guardrails for LLM agents, in the agentic AI course I'm working through, in data structures and algorithms practice, or while building [my portfolio assistant](https://github.com/Shubham-afk-del/portfolio-assistant). Notes are grouped by month in [`entries/`](entries), newest first.

## Latest

<!-- LATEST:START -->
- 20 Nov 2026: **Gradient descent (chai sugar):** I wrote `complaint(sugar) = 2 * (sugar - 3)`, which says how far the sugar is from the best amount and in which direction, then ran 20 steps of `sugar = sugar - 0.1 * complaint(sugar)` starting from 0 and got 2.965, close to the best amount of 3. The minus sign moves the sugar against the complaint, and the 0.1 learning rate sets the step size: too big a step jumps past 3 and never settles.
- 20 Nov 2026: **Chat UI (Gradio, first launch):** I launched my first `gr.ChatInterface(fn=chat)` for a chai stall helper. Gradio calls `chat(message, history)` on every turn, and my function rebuilds the model's `messages` from the system prompt, the earlier turns in `history` and the new message. It does not answer yet, because the streaming loop that should `yield` the growing reply is still outside the function, so that is the next fix.
- 19 Nov 2026: **What is ML (a rule vs a learned model):** I wrote a hand rule, `my_rule(temp)`, that says 80 cups below 20°C and 40 otherwise, then fit `LinearRegression` on three days of temperatures and cups sold. For 15°C the rule says 80 and the model says 70, because it learned a straight line from the examples instead of using my cut-off. The model's answer comes from the data, so more days would improve it, while the rule only changes if I rewrite it.
- 15 Nov 2026: **Features and labels (array shapes):** I put four days into `x = np.array([[10, 0], [20, 0], [20, 1], [30, 1]])`, one row per day with two features (temperature and rain), and the cups sold into `y`. `x.shape` printed `(4, 2)`, which reads as rows are examples and columns are features, while `y` holds one label per row. A hand-made model like `cups = 100 - 2 * temp + 20 * rain` turns one row's features into a prediction: 70 cups for a rainy day at 25°C.
- 13 Nov 2026: **Structured output (retries and their limits):** I ran my CV extractor with a retry loop that sends a failed `ValidationError` back to the model, then broke it on purpose. With plain JSON mode and a weak prompt, Priya's `"4 years"` was fixed on the second try but Rahul's reply kept failing and raised `ValueError` after three tries, and with `max_tokens=12` every attempt stopped at `{"name": "Priya Sharma", "` with `finish_reason` `"length"`, which, as I predicted, no retry can fix. Pydantic also accepted Rahul's 3 years of experience when the real answer is 6, because it checks the format, not the facts.
<!-- LATEST:END -->

## How I add one

```bash
./til "what I learned today"
```

The script files the note under today's date, refreshes the list above and opens a pull request for it. A check makes sure the days are in order, none is empty and the list matches, and the pull request merges once it passes. If a note with the same bold label is already in the log, the script stops and says when that one was written, since it is usually the same lesson again; `./til --again "..."` files it anyway. Away from my laptop, I open a [Today I learned issue](../../issues/new?template=til.yml) instead, from the GitHub app if need be, and a workflow files it straight to main, where the same check runs. If a day goes by without a note, another workflow opens a reminder issue in the evening and closes it once I've written one.
