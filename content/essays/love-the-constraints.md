---
title: "Love the Constraints"
description: "Constraints are everywhere. We live and work with them. There is no other way than to love them. Otherwise, they will chase us and pull us down."
tags:
slug: love-the-constraints
date: 2023-05-16
updateDate: 2023-05-16
external: false
---

When I look back at the topics I covered in Mektup, I wrote about energy and time management, habits, multitasking, mentoring, remote work, process thinking, and many more. If I take one step back, a challenge becomes visible: I'm in the middle of all, trying to navigate, mediate and negotiate within some constraints to find my way. That's why I renamed this blog to *Mediations* (not *Medi**t**ations*). Today, I will talk about how to understand and work with constraints in our work life.

If we look at constraints from a higher perspective, time, people, and money are the biggest ones. Whatever we want to do, we are dependent on time and other people. We all have working hours (constrained by how much money we earn, less money = less time) to achieve a goal. How much a team achieves in these hours decides the team's success. Moreover, anyone in the team is also constrained by others to deliver their work in collaboration. Thus, we must find ways to understand these constraints and find an optimal solution, just like we do in software engineering.

While building any software, we have limitations, such as memory, CPU power, the maximum number of parallel processes, accumulated tech debt, network latency, programming language limitations, and many more. If we make a pass at building anything, we must consider all of these constraints. For a mobile application, battery consumption is a concept we must consider and plan not to consume too much. For a backend application, we must decide the size of the database and not waste money by buying the biggest machine (and sometimes, they are also not enough). If the aim is to serve a million requests in a second, we have to find ways to eliminate failures and increase the resiliency of the system. It doesn't stop there. The same applies to organizational design.

Deciding how many engineers are needed for a project is one of the most fundamental challenges. Amazon uses the [two-pizza team analogy](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/two-pizza-teams.html) (two pizzas should be enough to feed the team), while startups don't have this chance to hire that many people. The companies in between two scales (startups <-> [MAANG](https://scripbox.com/pf/maang-companies/)) struggle with finding the right balance. I've worked in teams with sizes ranging from two to ten. In almost all teams, hiring is a big topic because there are always more things to do than we can handle with the existing team size. We never have enough engineers on the team (even with ten people), and projects are always late or delivered on time with accumulated tech debt.

Organizations still add more engineers to already-full teams by thinking that the delayed project will go faster, the accumulated [accidental complexity](https://en.wikipedia.org/wiki/No_Silver_Bullet) will be resolved, and everything will be alright. And this mindset always proves wrong and often makes things even worse.

The team culture and health of its members will face troubles when there are more than ten engineers on the team. It's challenging to agree on anything with ten people; any small change in working agreements needs to be followed up with everyone, the number of meetings increases (while productive meetings decrease), unhealthy conflicts emerge, and solving them becomes much more difficult. Eventually, leading the team to a halt instead of speeding up the delivery. There is one (but not the only one) reason behind adding one more engineer to the team.

We were taught the economy of scale: the more, the merrier. Especially industry evolving from manufacturing taught us the bigger the capacity, the less cost of producing an item. However, in software engineering, it's the contrary; we have a [diseconomy of scale](https://en.wikipedia.org/wiki/Diseconomies_of_scale). The bigger the organization, the bigger the cost of delivering anything. Startups can deliver products and features with light speed, while MAANG takes years to produce anything. The bigger the team, the quicker the software complexity increases. Once the software is big, it takes more time to add new features due to its complexity. Thus, reduces the delivery speed. There is one way to calm our minds in this complicated world and put all constraints into a picture.

We can think about everything we do as a system that operates independently. The global economy is a system in the same way a country's economy or a company is a system. Each system is part of a bigger system, has its subsystems, and, at the same time, works semi-independently of other systems.

A software engineering team is also a system. It has its own processes, projects, working style, resources, [people](https://mediations.candost.blog/p/mektup-35), rhythm, and limitations. The output of this system is what the team delivers. Adding one more engineer to an already-full team will increase only one parameter—the number of engineers. However, it *may* or *may not* increase delivery capacity due to increased complexity in processes, communication, and team rituals.

Many organizations assume they will operate well if they hire more people. I believe this thinking is flawed. If a team has enough engineers, the constraints are somewhere else. If the team is staffed, they will still have many other challenges in delivery.

> "Having “enough” engineers for a project is usually a terrible idea; you want to be constrained, you want to have to make hard decisions about where to spend your time and where to invest development cycles." — [Charity Majors](https://charity.wtf/2022/10/03/every-achievement-has-a-denominator/)

The increasing communication overhead will balance the system and prevent growth in delivery. Understanding the system, its inputs, outputs, and parameters impacting these inputs and outputs helps us understand our constraints. Yet there is one more caveat: the constraints change all the time.

Changes in the economy after the pandemic altered [companies' strategies (link paywalled)](https://newsletter.pragmaticengineer.com/p/wartime-vs-peacetime). The desired growth mindset left its place for financial stability and profitability, leaving teams working with a different set of constraints. There is no more adding another engineer to the team, growing teams, and splitting them into multiple. Instead, there are new strategies (but not so new; the world economy always had ups and downs) to increase delivery with fewer people. Adaption to new constraints is now mandatory.

In the post's title, I said, "Love the constraints" because these constraints drive creativity. Adapting to a different economy and life demands dealing with various challenges. As these challenges are evolving, we have to find other ways. Finding new paths is a creative process. "Best" practices to increase delivery with limited staff and resources have been there for decades (The Goal by Eliyahu Goldrat is a great book to read for understanding bottlenecks and throughput relationships). We only need to find which practices fit our situation, the people on the team, and the company culture and strategy.

There is no other way than to love all these changing constraints if we want to lead people to success in turbulent times. Any leader (or aspiring leader) must spend time finding out the constraints (albeit they won't find all, some black boxes need to stay as black boxes). Once the constraints are visible, creating a strategy and driving the team to success is much easier. Knowing them is like seeing the path and obstacles clearly in a hurdle. We might not become the winner and get a gold medal in every race, but we can definitely complete the race without falling.

***P.S.** I recommend reading Thinking in Systems by Donella Meadows to learn more about how systems work and how to understand them and not be victims.*

***P.P.S.** After two and a half years and 53 issues, [Mektup](https://mediations.candost.blog/s/mektup) says goodbye to its readers. Mediations will be the only newsletter from now on (including occasional book notes). The archive of Mektup is always available.*

> _There_ are _no separate systems_. The _world_ is a _continuum_. Where to _draw_ a _boundary around_ a _system depends_ on the _purpose_ of the _discussion_.
> — Donella Meadows.
