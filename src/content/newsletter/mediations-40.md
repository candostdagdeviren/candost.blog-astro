---
title: "On the Changing Role of Software Engineers"
description: "Establishing an ownership mindset is more important than before. The only difference is that now it's feasible."
tags:
  - software-engineering
  - career-transition
  - career-development
  - mediations
newsletterName: "Mediations"
issueNumber: "40"
date: 2026-06-09T09:50:00.000Z
updateDate: 2026-06-09T09:50:00.000Z
---

Software engineering as we used to know it is dead. AI condensed the code-writing step of the process from days to minutes. Engineers found themselves having many tasks on their plates, running many agents in parallel. They are burning out tokens and themselves at the same speed. However, I argue that the approach is incorrect. Because one aspect of software engineering hasn’t changed: having an ownership mindset. Today, **the ownership mindset defines the role.** Although I’ve been preaching about it for a long time, **establishing an ownership mindset finally became feasible with AI.**

I had various conversations with software engineering leaders over the last few months, trying to understand the changing role of software engineers. Perhaps for the first time ever, we are in consensus about job titles: **we have no idea what to call software engineers after they powered up with AI.** Context engineers? Product engineers? AI engineers? Prompt engineers? AI-native software engineers? Full-stack builders? Or still software engineers? But our discussions don’t get stuck there; we move forward to looking at what’s behind all these titles. Because they all mean something different from writing code.

I have preached about [end-to-end ownership for software engineers](/rethinking-performance-the-real-meaning-of-a-high-bar) for a very long time. I have seen that engineers perform their jobs better when they are closer to their users, have a product sense (even platform-as-a-product), when they communicate with stakeholders and demo their own work (and ideally, directly to their users). Many, many times, **I have seen higher-quality, more reliable results that require less rework and have fewer bugs in this operating mode.** However, we couldn’t expect engineers to do all of these before.

Because typing code and staying in context to cover various edge cases in the codebase required huge time and effort. And there was nobody other than engineers who could do these. They were focused on completing this part of the work. **Organisations, naturally, added a few roles over the decades to parallelise work and let engineers take care of their parts as quickly as they could.** The product manager or owner was added to the front of the pipeline, along with someone to focus on user experience and someone to oversee quality downstream. Then we started shifting left the quality, security, and many other things until we were bottlenecked with engineering again. While this approach supported business growth, enabled fast changes and allowed engineers to design a better codebase, it’s no longer holding steady.

**As typing code has shrunk to a minimum thanks to AI, engineers have found themselves juggling multiple tasks in parallel.** Just because there was more time to do something else while the AI was working, everyone thought asking for more of the same work was a good idea, so they did. After a while, problems such as [cognitive debt](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/) (overloaded people who are getting closer to burnout) or the vibe-coding trap (AI-generated code that has never been checked) began to appear. The solution was there all along, but many decided not to see it.

It is the core idea of Kanban: **the work-in-progress (WIP) limits, but with a little caveat.** _Although unintuitive,_ **limiting the amount of work that runs in parallel is actually producing better outcomes and outputs.** I believe the idea of WIP limits must be emphasised more strongly than before. But perhaps not in the way that many people did it before.

While work is being split into multiple tasks, everyone still tries the same thing as before: splitting the work into different contexts. However, **the context one person can manage is still limited.** Many organisations expect engineers to parallelise their context and scale vertically: stack up different tasks in parallel. I argue that **they should expect engineers to manage a single context while parallelising different tasks within it.** Therefore, engineering should scale horizontally over the stack, forming a chain of tasks.

Let’s take quality assurance (QA) as an example. There are many debates about the role of QA: some teams have a separate person, some don’t. Although I see the QA team (when it exists) as enablers that help engineers manage quality, many organisations work differently: engineers hand off work to QA to run tests, report bugs and sign off releases. Even in some teams, QA is responsible for writing tests.

While handing over the work to QA was previously needed for the feasibility reasons I mentioned above (typing code taking a lot of time), it’s no longer realistic. Now, **AI requires verification layers to be up front.** The more we shift the quality left in the process, the better and faster feedback we get. The non-deterministic nature of AI forces us to build verification mechanisms first to ensure AI outputs are accurate. And there is no point in having a separate person writing tests and handing them over to software engineers. This is a single-person job. In my opinion, it has always been. But now, there is no argument left against it.

So, suddenly, software engineers have to—not should—understand their users, their product, and the business to write effective tests across the stack. Moreover, they also can’t write good specs that are prerequisites for AI agents to perform better (not everyone does spec-driven development, but the plan-and-build approach many people follow is also a form of spec-driven development). Software engineers being responsible for specifications and quality is the horizontal scaling.

This kind of **horizontal scaling reduces cognitive debt because engineers can stay in the same business/product context while using various AI agents to handle different parts of the job. This is a fundamental mindset shift: moving from building features in parallel to building a single feature end-to-end faster.** They will need to understand users, the project and scenarios to write clear specs for AI agents.

There is a counterargument that engineers now have to learn many different parts of the process and lose their speciality. The same argument also claims that they will still be overloaded across different contexts as they take on more than just coding. In my practical experience, this argument isn’t strong. I’ve been working on building this mindset at my day job, and my experience shows me otherwise.

When people are coached and mentored well, they become more specialised in what they are doing and achieve even better results. They gain the power to make more decisions independently. **Once they become a part of defining the why and the what of the job, how they build it becomes more effective.**

I also must admit that this is not everyone’s trait. Although I had more than a few people in the organisation who struggled to build the needed skills, they also admitted that they enjoyed the work more (albeit sometimes with more stress due to a steep learning curve).

If we continue [establishing an ownership mindset](/strong-ownership-culture-in-a-team) and scaling engineers horizontally over the stack (not vertically), we can’t hold ourselves from posing two big questions:

- What will happen to the people who used to “support” software engineers?
- How can software engineers adapt and learn tons of new skills?

I really have no answer for the first question as I can’t predict the future. However, today I see product people moving to “builder mode” and using AI, and quality engineers moving to “builder mode” as well, focusing on building automations end-to-end (in ways that were impossible before). So, they are spreading through the software engineering side of things. We’ll see what happens in the future.

For the second question: if the leadership sets expectations and incentives correctly and engineers are willing to build an ownership mindset, they develop these skills over time. I’ve seen it before, the AI and also observed that these engineers shine with AI. I see them enjoying the work much more when they own the entire feature end to end. All they need is a little help to identify the skills they lack and define a growth trajectory for them through training, practical experience, and mentorship.

## Good to Great

I share up to three things I found interesting, sorted from good to great.

**_Good:_** Many people are struggling to understand what they think about AI and how to approach it. Perhaps the bigger problem is that the technology is not fully deterministic but probabilistic. I quite like the framing of the idea Dan [presents](https://www.mooreds.com/wordpress/archives/3737): AI’s biggest difference is that it cannot care about anything. I certainly can relate to it and think about many scenarios where I knew something was wrong but couldn’t frame it what or why. Also, the text is crisp and on point. Dan now provided the right words for me to use in different contexts.

**_Better:_** You need a space to sit down and let yourself hear your thinking. [Beautifully written.](https://psyche.co/turning-points/everyone-needs-a-place-to-sit-and-simply-hear-themselves-think)

**_Great:_** I often don’t link popular articles here. I’ll make an exception. Read the [Patterns for Reducing Friction in AI-Assisted Development](https://martinfowler.com/articles/reduce-friction-ai/) on Martin Fowler’s website (including all sub-pages). I printed out the whole article and have been studying it for a while to understand how to establish AI in a tech organisation. It sparked so many ideas.
