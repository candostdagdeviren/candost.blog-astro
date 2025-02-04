---
title: "Engineering Managers Leading a Big Project—Step by Step"
description: "How engineering managers lead cross-team projects: aligning problems, stakeholders, solutions and everyone in between."
tags:
  - project-management
  - mediations
newsletterName: "Mediations"
issueNumber: "12"
date: 2025-01-21T08:30:00.000Z
updateDate: 2025-01-21T08:30:00.000Z
---


When I [​peaked into​](/studying-and-learning-leadership/) the engineering management role, one of my biggest challenges was learning how to lead projects involving multiple teams.

Delivering a project from scratch to production is a big challenge, especially for big organizations. It takes months to move a needle due to the complexity. Clarifying the why and the what, identifying risks, setting expectations, and convincing people require a lot of time.

Although it can be overwhelming, there are strategies to ease the burden and organize this complexity. Many organizations expect Engineering Managers (EM) to develop strategies so they can lead complex projects. EMs learn how to fulfill these expectations over time.

When software engineers grow into senior roles, they are expected to deliver on their promises and divide the work into smaller pieces so that others can understand the scope and what needs to be done. They are expected to develop these skills further when they become EMs. Instead of splitting tasks into smaller pieces, they begin leading complicated projects and dividing the work into ambiguous chunks for which senior engineers can take responsibility.

Then, when projects involve many departments, EM’s job becomes understanding complexity and creating a high-level solution. This leaves some ambiguity for the teams to pick up, investigate, organize, and start working on.

I learned that once leading a complex project across a few teams becomes the responsibility, the work differs from leading a project with a single team. From then on, it focuses on setting and fulfilling expectations, clarifying open questions, driving other engineering leaders to shape up target software architecture, aligning timelines, [​prioritizing​](/prioritization-skills-for-senior-and-staff-software-engineers), [​negotiating​](/how-to-solve-and-prevent-conflicts), adapting to changes, and [​managing communication​](/communicating-decisions-in-the-organizations).

EMs are bridges between stakeholders, product managers, designers, and engineers. They guide engineers by helping them [​design better solutions​](/journal/missing-product-engineering-partnership/), [​ensuring the right collaboration model is in place​](/journal/too-much-collaboration-is-detrimental/), and ensuring the team implements them in the correct order. They support product managers by providing input about feasibility, challenging their approach, de-risking the identified risks, raising the later-discovered unknowns during implementation and adjusting the course accordingly. They help other stakeholders by coordinating the work and constantly communicating progress.

How they do all of these things will depend on the organization. Some organizations rely on meetings to coordinate the work; some coordinate everything over spreadsheets, emails, or chat apps like Slack; some [​choose a mix​](/managing-partially-distributed-teams); and some do everything via written and asynchronous communication. Regardless of the approach, EM’s job boils down to managing delivery, as their success is measured by what their team(s) deliver.

Success starts with knowing the fundamentals of project management.

## Project Management

If there were a few silver bullets in project management, they would be to ensure everyone has the same understanding of the current status, find risks early and manage dependencies well.

Although all project management frameworks (Scrum, Kanban, Scrumban, Lean, etc.) aim to address those silver bullets in one way or another, what matters for an EM is when and how to choose one. As messing up on a project is a scary experience, I recommend learning different frameworks and discovering commonalities, having a conversation with an experienced peer in the same organization and asking for advice. Moreover, aligning with the leading product manager (PM) or product owner (PO) is the first and most fundamental step.

My perspective changed most significantly when I first aligned with the product and design counterparts on **how** _**we**_ **distribute the work between ourselves**. As EMs can't lead projects without these partners, setting the expectations right in the first place makes a lot of things easier.

Agreeing on how we’ll manage the project is crucial because we’ll focus on the product and the problem together with them.

## Product and Problem

Solving a problem end to end is a team effort; it doesn’t belong solely to anyone. Product and design teams often handle documents like product requirements documents, press releases, user story mapping, wireframe designs, etc., that explain what a product or feature should do in detail. These artifacts are the guideposts for understanding how everything should work from the user’s side. **EM’s job is to explain the problem from a delivery perspective—the how part of the problem.**

EMs focus on solving implementation problems, determining [​whether more feasible solutions exist​](/why-cant-this-be-done-sooner) and providing feedback to product and design teams so that they can adjust their solutions.

### Pragmatic Approach to Problem Solution

The problem on the delivery side often starts with unraveling the details of technical solutions. While not all questions have to be addressed upfront, those considering how applications and systems will work together and how to avoid making any system or team a bottleneck should be answered.

This initial feasibility discovery should include a high-level technical design that shows what needs to be changed and where the significant risks are. If the risks need to be eliminated, the EM organizes further discovery with engineers to find a solution. However, **it’s okay to lack some of the details on** _**how**_ **the feature will be implemented in individual applications and systems**. That part needs to be resolved within the specific team.

Together with the EM, a staff+ engineer can lead the system design. EM brings a complete understanding of the product and organizational context, and the staff+ engineer brings complete technical expertise. Furthermore, the EM can challenge engineers to find the best possible approach. Together, they can distribute the work into teams and decide on the parallelization and sequentialization of the implementation.

When each team starts implementing, engineers discover various challenges. As EMs can’t foresee every possible question before the implementation begins, they coordinate the product, design, and other counterparts and work with the engineers to answer each question.

EMs are at the center of all collaboration, primarily coordinating people and challenging solutions from a product and engineering perspective. As this work requires a lot of them, delegation and strong communication are the keys to success.

## Delegation

An EM needs to delegate system design to engineers, implementation to teams, and problem-solving to others. Their job is to coordinate and resolve risks by guiding people to a solution and managing communication. Without proper delegation, none of these will ever work.

However, [​it’s common for EMs to manage everything themselves, try to be everywhere and have a say in every tiny decision, as their name is on the project’s success.​](/the-real-difficulty-of-engineering-leadership/) This approach is a recipe for disaster. If every decision needs to involve them, they become a bottleneck.

I want to leave the topic of how and what to delegate for another post (edit: [the post is here](/how-to-delegate-anything-successfully/)), but I want to mention a few essential things. **While delegating, EMs should ensure that the expectations are clear and that the other side understands what needs to be done and the timeframe.** [​EMs must answer every question when they delegate.​](/transparency-over-context/) Also, they must set enough guardrails; others must drive the work, but it’s okay to have a certain level of protection from possible mistakes.

After delegating work to the teams and other individuals, the work evolves into full coordination and managing communication as the project progresses.

## Managing Communication and Progress

Unstructured communication is the real chaos-maker. When there is no information and communication structure, information flows in free form—the worst of all possible scenarios. Everyone has a little piece of information that the others don’t. They share the information in various mediums, and it turns into a game where you say the word from ear to ear, and what you hear in the end is different.

That’s why EMs must _manage communication_. They don’t always have to be in the room or attend all meetings. Yet, they must follow up, hold people accountable, share outcomes, progress, and problems with everyone and guide and redirect all information so that it accumulates in one place.

I use a living document to merge all information and links and make it a go-to document for all delivery-related topics until the project ends. Unlike the product requirements document describing the problem and what we are aiming for from the user’s perspective, the delivery document focuses on how we’ll approach the solution more concretely. It splits the project into milestones and clearly identifies what needs to be done and what is out of scope. Its purpose is to merge the information that has an impact on multiple work streams. It’s a go-to document when someone has a question about the _how_ part of the project (not the _what_ and definitely not the _why_ part).

The delivery document is also a communication tool for stakeholders. When the project kicks off, it becomes the go-to document for all stakeholders to grasp the project’s current status, latest timeline, risks, open and answered questions, and all the necessary reference documents from a single place. However, delivery documents don’t keep track of the status of all the small tasks; that’s the job of a delivery board.

The delivery board is simple and has four columns: Backlog, Blocked, In Progress, and Done. It includes all tasks that are in teams’ roadmaps. The board’s goal is to give an idea about the progress of each team’s tasks without asking them to share a status update. I create a custom dashboard on Jira and ask all teams to label their Jira tickets with a specific label to make it easy to follow the tasks on the board. I’m sure other project management software has a similar functionality.

## Conclusion

This approach may look like a waterfall, not agile, to some people. However, if you’re working with six or seven teams to deliver a project, you must manage the organization and communication overhead and find risks early by doing discovery work. Some organizations have program managers or release managers to do this job. If you don’t have one, this often falls on the shoulders of engineering managers (ideally partnering with product managers).

Although the responsibilities of an engineering manager differ from organization to organization, leading large projects is a core skill for any EM to develop.
