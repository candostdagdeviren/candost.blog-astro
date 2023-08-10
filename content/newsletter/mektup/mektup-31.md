---
title: "Mektup #31: Non-Engineers Leading Engineering Teams"
tags:
date: 2022-05-17
updateDate: 2022-05-17
external: false
---

Hey friend,

We started reading Team Topologies in a book club at work. I'm still in the first 100 pages of the book, but one chapter changed my perspective, and I want to share that with you.

Before, I thought that not all engineering managers (or team leaders) needed to be great engineers. To be more specific, I thought about leadership as a separate profession. When we think about how these people managers work, they have no time to write code; they focus on people, roadmap, and organizational work. On top of that, not all positions require technical knowledge. Of course, there are companies where these leaders code, but there is an implicit agreement that leaders can't lead the team and simultaneously code in a project.

So, in my perspective, **I believed that even non-engineers could successfully lead the team(s) because no coding is involved. And I have seen it work.** The validation enforced my controversial thoughts, and I sought to become a leader of a team whose area of expertise is different than my engineering background—I have an iOS engineering background, and I'm leading a backend-heavy, non-mobile team. Now, I think a bit differently.

Well, what changed my mind? Why do I think leaders should have good technical knowledge of the topic their team is working on?

In Team Topologies, the authors talk about **team-first design**. When we think about Conway's Law (_"Any organization that designs a system will produce a design whose structure is a copy of the organization's communication structure."_), we design systems starting from the team structure. **Instead of beginning with the software architecture design, team-first design applies Conway's law first.** For example, if we want to create a mobile application, the system design will look different when we embed a backend engineer in the team rather than separating teams into the backend and mobile engineers. When the team is cross-functional (has an embedded backend engineer), the system will be designed in a way that maximizes the communication between mobile and backend systems (and engineers). The backend application and mobile client will be coupled. When no backend engineers are embedded in the team, mobile and backend applications will be much more independent. You might be thinking, "Why not let the engineers design the system that fulfills the business need and solves the problems instead of creating premature structures?"

It's where the problems begin. When there are separate backend and mobile teams, the system will continuously evolve to support this structure. Even if the engineers design a coupled system, Conway's law states that teams will continue separating their work on the way. Creating an initial software architecture design that demands close communication will fail in the long run. The same applies the other way around; if we have a cross-functional team, the systems will evolve to support this structure, even if it's built decoupled.

When we think about this picture, a non-technical leader probably cannot foresee it. Although they may know by experiencing these problems, **it's essential to understand the system's technical fundamentals when designing teams.**

As leaders have long-term visions, they have to know the technical side well enough to anticipate these problems before they appear.

**There is still one scenario non-technical leaders can still be successful: they lead with great sidekicks.** If a non-technical leader has a person or two next to them with whom they partner up, then it may work. If you watched Ted Lasso, Ted is an American football coach who goes to the United Kingdom to coach a football (soccer) team. Ted has no experience leading a football team. However, he creates a solid group that knows football by heart. Then he uses this group to support him in leading the team to success.

Okay, my friend, you might think about what this situation means to you. If you have a non-technical leader (first, be nice to them), try to be the one who supports them; be their partner. That way, you'll be involved in various leading activities and gain experience before becoming a leader. And in case you have an opportunity to lead a team where you have no deep expertise, find a partner or create a group that can help you on the technical side. Work very closely with them to become successful together.

Until next time, take care!

Candost

_**P.S.**_ _[Understand how distributed systems work if you're working with one](https://mediations.candost.blog/p/24-understanding-distributed-systems)._
