---
title: "Who has the knowledge? Me? Or the LLM?"
description: "Learning from a single AI prompt that cost $35."
tags:
  - mediations
  - artificial-intelligence
  - personal-growth_learning
newsletterName: "Mediations"
issueNumber: "36"
date: 2026-04-14T09:05:00.000Z
updateDate: 2026-04-14T09:05:00.000Z
---

I couldn’t send the last few Mediations due to sickness and not getting enough rest to recover fully. I kept telling myself that I should write and send something, but I didn’t want to send anything half-baked. Also, I realized that I still don’t have a stable mechanism for sending this newsletter biweekly to keep the show going. But, so be it. We’ll get there. I’m also a human after all.

---

Three weeks ago, I was trying to add new metrics to our system to track the types of validation errors the API returns and to create an alert based on specific validation errors. Until that moment, these errors were written as text to be returned to the client, explicitly stating the problem with the request they sent.

Providing text in the response and clearly explaining the problem helped a lot to the engineers integrate with the APIs. However, when creating metrics and dashboards, vanilla text with varying parameters is not ideal due to its high cardinality. Grouping errors by text was not an option.

So, I fired an Al agent to implement key/value pairs for all validation errors, use those keys for metric collection, and keep the values as human-readable text. It did. However, the solution was not elegant at all. I had to perform various iterations.

I gave one prompt (on a GitHub pull request) to iterate, left the agent and came back 25 mins later. 💸 $35 💸 was gone. For a moment, I was like: WTF-has-happened-here.

I was surprised because Cursor (Cloud Agent) decided to run the prompt with the highest available LLM model with the highest thinking variant, ignoring my default settings (side learning: always explicitly tell which model you want to use). The bigger problem was that it still produced poor results, which I wouldn’t expect from that model.

I could curse the LLM’s inability at that stage, but then I read a short article on the Internet (which I can’t find anymore to link here).

The big question the article asked was, “**Who has the knowledge, LLM or humans operating them?**” I interpreted the article according to my situation.

What information was I relying on to build the key/value pairs? Was it me? Was it the LLM’s training dataset? Or was it the context files like AGENTS.md? Or was it the prompt I gave?

In my failed scenario, I solely relied on the LLM’s training dataset. I neither gave enough nor correct knowledge in the prompt, nor was the knowledge available in any context files (such as AGENTS.md or skills). I didn’t even know how to implement the changes, as my Kotlin (the language we use) coding skills are rusty.

After that, **I learned to ask myself every time which knowledge I am relying on**. If that knowledge is in my head, I have to spell it out in my prompt. If I’m relying on some knowledge that is recurringly needed, that needs to be added to AGENTS.md or as a new skill for AI.

If I rely on the LLM’s training dataset because I don’t know how to implement something specific, I need to approach it differently. The LLM’s training dataset is rich, but all models still operate with probabilistic resolution. The training dataset is generic and not tailored to the context I’m working in. Therefore, I have to narrow the AI’s playing ground so it doesn’t deviate too much and can remain creative within those bounds.

Considering all, these days, this is the prioritized order of the knowledge I am relying on while working with AI:

Context files > Prompt (all knowledge in my head) > LLM training data set

Also, I shift the knowledge to the left as much as I can. When I discover something in my prompt that will be needed later, I add it to AGENTS.md or create a new skill for it (or ask AI to do it for me). Over time, with some additional tools, I aim to create a good agent harness.

Agent harness became the differentiator as the difference between foundational models became indistinguishable. With a good harness, we can manage the knowledge, context, and tools the model has access to and guide the LLM in the right direction—providing the customization layer based on the project context.

For example, when I realize the model is repeating the same steps often and producing different results (or wasting time generating the same output again and again), I aim to extract that operation into the agent’s harness to improve determinism. Sometimes the answer is a new skill; sometimes it’s a single-line addition to AGENTS.md or a specific function as a plugin, and telling the agent to use it.

Now that I think about my $35 failed AI run, was it a failure? I don’t think so. Because it made me think and helped me gain a new mental model. If it had cost $0.5, I probably would have neglected being diligent and couldn’t have connected the dots like this.

While these are still new for me (and I have other costly failures), I always thought I missed the golden age of software engineering (90s & 00s) as I caught the bug at the end of the 00s. These days, I often think that we’re living in an industry and world-changing time. Now, with AI, the software world is changing on a grand scale, way bigger than before.

None of us knows what’s “the best.” We need to keep talking and sharing what we discover and learn. We have to share the failures with a slight optimism. We must ask questions, be skeptical and be _mindful_ simultaneously to evaluate every step we take. We shouldn’t hand over our judgment to AI, but we can hand over structured knowledge and guide it well to use that information. Then sit back to see the amazing results it gives back.

## Good to Great

I share up to three things I found interesting, sorted from good to great.

**_Good:_** While living in EU, I can see so many problems with how the corporate structures work across countries and regimes. [EU Inc. A new harmonised corporate legal regime](https://commission.europa.eu/topics/business-and-industry/doing-business-eu/company-law-and-corporate-governance/eu-inc-new-harmonised-corporate-legal-regime_en) is in the plans of EU Commission. If you’re outside of EU, this might still be crucial for you as it might allow your company to expand to EU with a single entity instead of many. I’m waiting for its positive impact in the market. It’s sad that this came late. But better late than never.

**_Better:_** I read [this](http://hintjens.com/blog:16) again after a while. Very good reminder: start with solving the problem with smallest effort. Once your solution proves itself, you can advance it.

**_Great:_** Let me take you away from technology a bit. I came across [this](https://lookingatpicturebooks.com/p/the-very-hungry-caterpillar). The interpretation of the book, the conversation, the thought flow, the picture book itself, what can I say; everything is pure gold. How not to love it?

Do you have suggestions for great things? Send me a message (or email).
