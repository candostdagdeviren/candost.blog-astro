---
title: "Building an AI Hive Mind to Understand Systems as a Manager"
description: "I've built a 'hive mind' of AI agents over dozens of repositories to surface organisational and tacit knowledge without gathering a room full of engineers."
tags:
  - ai
  - ai-agents
  - engineering-management
  - knowledge-management
date: 2026-08-21T06:05:00.000Z
updateDate: 2026-08-21T06:05:00.000Z
---

From the day that I stepped into a manager role till today, I've been relying on other people to do my job. Every passing year, I sacrificed a piece of my software engineering _'expertise'_ to organisational constraints.: the work that requires me to help aligning people and problems, gathering context and structuring it for better comprehension and narrowing the problem down, listening to people daily to help in various aspects, team performance management, and more. Every step pushed me away from the writing code. But I always tried to stay close to engineering part to understand how systems actually worked, rather than _how people thought_ that they worked.

As much as I tried, I became harder every day. My work at SumUp demands working across domains. Considering each domain consisting of dozens of services and applications, I always needed engineers from each domain while working in a project to gather context and surface what needed changing. Nobody had the full knowledge of the system (still doesn't today). I always had to gather 3-4 people in a room just to figure out how the system works.

My attempts to outline systems relations made me the master of Mermaid diagrams, Miro boards (that sometimes became outdated faster than the text documentation), RFCs, PRDs, and random technical documents. All of these have succeeded thus far. However, the pace of change (especially with AI) has got higher, and it has become notoriously difficult to continue the same way. I decided to try solving it differently.

The main goal I established for myself was to eliminate the "gather 3-4 people in a room just to figure out how the system works" stage: find out how the applications, services, tools, and infrastructure connect together and combine it with the deterministic knowledge: the codebase and team structures. As a secondary goal, I wanted to build a mechanism to surface tacit knowledge—knowledge that's not written in a document, shared, or made explicit.

## First Attempt: A General Agent

I built an AI project using Notion Custom Agents (as we use Notion at SumUp). I connected GitHub and a few other tools so the agent could access the data. I wrote custom instructions to guide agents and explain the purpose and expectations as concretely as possible. I also wrote a few specific documents for agents to use while navigating a big Notion workspace and various repositories.

This approach has worked for a while. Especially when the scope was limited to a single team's domain, it was useful. However, it began limiting once it started crossing domain boundaries. The more domains and repositories I connected, the less it could surface the right information. It often missed reading documents that I explicitly directed to read. The tool invocations sometimes timed out, and sometimes agents failed randomly without much explanation. The reliability was _good enough_, but I still couldn't rely on it to do my job.

All these nudged me to look for a more concrete, reliable, and established solution. Instead of searching for the next AI SaaS product that claims to become the ultimate knowledge worker, I decided to build it myself.

## Second Attempt: Hive Mind

SumUp is a big organisation with thousands of Git repositories, thousands of Slack channels, and millions of pages of documents. I definitely didn't want to cover all of these. I limited the setup to three core components of SumUp: two domains and one shared mobile application, and I built everything around the domain that I oversee.

This approach has worked.

I created a single repository where all other repositories are connected as git submodules with their own AGENTS.md files to give context—creating, as I call it, the hive mind.

### Setup Outlook

- A single repository with all other relevant repositories (currently ~66) added as git submodules
- Four AI tools: OpenCode (the heart) connected to an LLM provider, Notion + Cursor to update knowledge weekly
- 6 custom AI Agents to help users of the hive mind
- A lot of AGENTS.md files, a MEMORY.md, and a SOUL.md file
- One AI agent to collect information, create a report and a GitHub issue
- One AI agent to update the knowledge base and AGENTS.md files by creating a new pull request from the GitHub issue
- One human to read the report, correct any mistakes, remove unnecessary parts and merge the pull request
- A custom CLI tool to manage git submodules

That's it.

Let's get into the details.

### One Git Repository to Rule Them All

I created a repository and added all the relevant repositories using git submodules. Having 60+ repositories forced me to introduce some folder structure.

I grouped repositories by **how the product and teams were structured** (not by technical structure, like Kotlin repos, Go repos, etc.). For example, Sales and Payments are two big domains at SumUp, and each is placed in its respective folders: domains/sales and domains/payments.

Then, under each domain folder, I added an AGENTS.md and the `repos/` folder. AGENTS.md file provided an overarching domain context for the folder. Instead of adding any specific repository context, it includes the domain's definition, its principles and structure, plans to retire some services (like if a team wants to remove some service but there is no active project to do so), and ongoing mid- to large-scale projects.

As I work in the sales domain and aimed to build the hive mind for this domain, I put the clients of the sales domain's APIs in the main clients/ folder, and platform infrastructure in infrastructure/ and so forth.

Some domains were big and needed subdomains. I added a subfolder within the domain, and the relevant repositories went into that subfolder. The subdomain also got an AGENTS.md file.

Example structure:
- domains
	- sales
	    - core/
		    - repos/
		    - AGENTS.md
	    - reporting/
	        - repos/
	        - AGENTS.md
	    - AGENTS.md
	- payments
		- processing
			- repos/
			- AGENTS.md
		- payouts
			- repos/
			- AGENTS.md
	- clients
		- …

Instead of adding all repositories at once, I only added a few repositories to test the system. I evaluated by looking at how a good LLM model with an OpenCode harness would handle multiple repositories when I ask a cross-domain question.

When it comes to AGENTS.md files, I created a domain template and extracted all this information from Notion & Slack using AI and validated with my own organisational knowledge and random spot checks. This part took the most of my time. I tweaked these AGENTS.md files quite a lot until I could get a good response to the cross-domain questions I asked.

(Side note: The moment Anthropic's Opus started to struggle was roughly around 10 repositories. After 10 repositories, I started creating custom agents to control dispatching subagents.)

(Another side note: Managing these submodules was quite a burden. Some users of this system won't know Git. Disk space was also a problem, as some repositories require gigabytes of storage. Therefore, I developed a custom CLI tool (details are in the appendix) to load and offload modules on the local machine as needed.)

### Custom AI Agents

I used OpenCode to create custom agents. OpenCode allows setting up instructions, models, a permission set and a few other granular settings for custom agents.

In OpenCode, I created three primary agents and two subagents:

- General Companion primary agent
- Primary Investigator
- Primary Brainstormer
- Domain Investigator subagent
- Repository Inspector subagent

A hive mind user can work with the primary agents but can't dispatch the background agents.
Why use custom agents rather than leave it to the model to decide?

Four reasons:

1. I need to dispatch an agent scoped to a single repository to keep the context small and limited.
2. Within a single repository, there is no need to use Opus of Fable; Sonnet or GPT-Terra (or even Haiku) are enough. However, Opus or GPT-Sol class LLM need to handle complexity of the whole work.
3. When generic subagents handover the work to the primary agent, their context handover is random. I needed to have a structured report from each background agent to create consistency across domains and provide the same input to the primary agent. I also wanted to make these reports accessible and readable to humans afterwards.
4. I wanted to learn how to design this kind of system with structured handovers.

### Custom Background Agents

After ~10 repositories, LLM started randomly spawning a subagent to narrow down the work, but sometimes it took on the job itself. This dynamic behaviour confused the agent because it thought the repositories in different domains were part of the same scope albeit not.

Each repository has its own bounded context, its own practices, structure, and more details. They are often in different programming languages. No matter how clearly I told the model (using words like "critical" or "must"), it made up its own "mind." So, it needed taming.

Creating custom background agents and ensuring the dispatch command is structured helped the primary agents not to go confuse the boundaries of a repository or domain, so the investigation or brainstorming was finally scoped.

Background agents also created a result report with findings and suggestions using that domain's best practices, scope, principles, goals and ongoing projects. This report became the handover document between agents. It's quite similar to how humans work in teams: each team owns a domain and repositories; they decide how to navigate the investigation/brainstorming based on that domain's context. When they handover a project or a task, there is (ideally) a handover document.

I'm not saying that LLMs cannot handle this complex task; Fable with high reasonning most likely can. Yet, it costs a fortune for my budget. In my experience, the results are also much better when the main agent dispatches a specific background agent with specific command.

Thus, I created two custom background agents (one for investigation, another for brainstorming) whose main jobs are to narrow down the work in a single repository and write up a report file. The primary agents provide these agents with a structured prompt, along with the user's initial prompt. Each background agent also produces an output report using a clear JSON structure (defined by a Zod schema).

Let's talk about how these background agents are used by primary agents.

### Primary Agents
At first, I had no primary agents. In each prompt, I told the LLM to dispatch an 'investigator' agent for each repository or domain. That worked until a certain point. It still wasn't user-friendly (as I had to repeat the same prompt), and I couldn't expect other users to know how to mention this and some other specific words. So, I started adding more to the main AGENTS.md file; it got longer and longer.

I went back to the problems I wanted to solve. The first one was: I don't want to gather 10 people in a room to learn how systems work. I could dispatch 10 background agents to understand how each one worked, but that still didn't give me anything about how they all fit together. So, I need primary agents to connect the dots.

#### The Primary Investigator Agent

The primary investigator agent oversees the whole ecosystem. It performs an initial investigation before dispatching any subagent to figure out which domains and repositories are most likely relevant. If the repositories are not loaded, it downloads them. Once it creates an investigation plan, it dispatches investigator background agents, reads their output reports, merges the whole context, connects dots, creates its reasoning about how things work and assembles a final report. It also creates Mermaid user sequence or system context diagrams if needed.

The primary investigator then also creates a final report. The final report is a single-page HTML file created using the JSON outputs. As it's a single .html file, the users can easily send the file to anyone if they want to share the knowledge.

#### The Primary Brainstorming Agent

The working mechanism of the main brainstorming agent is the same as primary investigator. However, the purpose is different. It investigates multiple domains, and also helps brainstorming on the problem with the user. This adjustment made exploring multiple solutions across domains possible.

The primary agent dispatches domain-specific brainstorming subagents, gathers back their output reports and brainstorms an overarching solution based on them rather than running a deep investigation itself.

In my experience with brainstorming workshops, evaluating the solution in each domain clearly always brought up interesting discussions and clear trade offs. When compared to listing down pros and cons of each solution across domains, the individual domain brainstormings were more comprehensive. Thus, replicating here gave advantage for each primary agent to orchestrate background agents for specific domain, then compare results with a "fresh" context window.

The background brainstorming agents try to come up with solutions according to the best practices for that domain and creates a report with multiple approaches, including the pros/cons of each and the recommended approach.

Then the primary brainstormer agent reads these reports and synthesises them to identify a few approaches that span the whole ecosystem, with their pros/cons, and recommends a solution that's better for the whole ecosystem.

#### The Mind of the Hive Agent

Focusing only on technical solutions is helpful for many problems. But not all. While trying to solve some problems, I needed to bring additional context such as organisational structure and prioritise some of the good practices or mental models I try to employ as an engineering leader (e.g., Domain-Driven Design, Conway's Law, Team Topologies)

Thus, I introduced another agent that is neither for brainstorming nor for investigation, but one that has additional organisational context and can think like an engineering leader, including team structures, SumUp's organisational values, and engineering strategy. This agent is freer than the others and can dispatch other primary agents as it sees fit. It cannot dispatch background agents alone.

All primary agents use good frontier models (e.g., Opus) as they need to handle complex queries.

## Keeping the information up-to-date

I've been a fan of creating autonomous teams, but I know it's not easy. Maintaining an autonomous team is even more challenging. I see this system (also all systems in general) is similar. After I created this system that will give a user (in this case, me) some autonomy for investigation, the system still relied on an individual to update context proactively.

At my daily work, I spend a good amount of my time and energy following the organisation and learn as much context as possible. That gives me leverage at work to find intricate details, better prioritise the work and bring a more comprehensive context to my team. However, simultaneously, the moment I stop extracting the context I gather and share with others, things slightly go south. That's the opposite of what I want.

So, I looked at what kind of information I gather in a very dynamic organisation like SumUp. A few themes popped up: how different systems between tribes and squads work together, what data they send to each other, what flows teams want to deprecate and retire, what flows they plan to kick off and what flows they have no desire to change unless absolutely needed, what challenges they are facing today and what challenges are upcoming in the future. I gather all these by following the conversations and participating in certain meetings. Extracting this siloed information became my side goal.

I first looked into creating a RAG and have all product and technical documentations along with this "tacit" knowledge and update the data dynamically. However, a RAG was an overkill. What I needed was creating the first information set and a weekly update on what happened in the last week.

So, I created an automated cron-like agent.

### Setup

- Custom AI agent researches updates in the last week across Notion and Slack (with a guided prompt)
- The agent creates a new GitHub issue on the repository with its weekly report attached.
- The agent dispatches a Cursor Cloud Agent to read the report and update context in the repository.
- The Cursor agent picks up the task, reads the issue description, the report, researches the relevant context files and creates a pull request to update them.
- A human reads the pull request, makes changes if needed, merges the PR and closes the GitHub issue.

To create initial context and also set up the prompt for custom AI agent to use every week, I searched Slack and Notion to find each domain's and team's Slack channels (including private ones I'm part of) and the Notion team spaces. Then, for each domain, I followed the same folder structure in the hive mind repository and created all context and agent's prompt to use every week (now anyone in the organisation can also see how the information is collected).

The custom AI agent reviews changes from the last week only, creates a report based on the folder structure in the hive mind repository. The agent uses an LLM model with 1M context window (LLMs with lower context have failed).

Once the agent run is completed, it creates a new GitHub issue and tags Cursor and asks to update the context files using the information in the report and create a pull request. There is no customization for the Cursor cloud agent. Once Cursor is done, it tags me for review.

I review both the report and the pull request. I make slight changes as needed, then merge the pull request and close the issue.

Then I update all submodules once per week (I'll automate this soon, too).

That's it. Although there are tons of improvements, I'm happy with the whole setup. I think 80% of the setup is complete. The last 20% might consume 80% of my time yet yield little benefit compared to the whole project. I will slowly develop it furher.

We'll see.

_P.S. I didn't mention any specific LLM model because that's the dynamic piece of this setup. No need to stick to one, I defined some defaults but change it depending on the job._

---

## Appendix

I want to add a few more details about the setup and aim to expand this section going forward.

### Custom JSON Reports & Final Report

I created a Zod JSON schema for handover reports, a few custom tools to create and read JSON reports using the schema, and "told" agents to use the tools when working with reports.

That allowed primary agents to also load the same schema to understand the format and to directly read the relevant part of the report when they needed information. That made the agents faster as they no longer had to discover the report’s structure.

It also allowed me to create an overarching HTML report to share with others. When I run an investigation and find something I want to share with others, the best option I have is either to send the outcome of the conversation or to ask AI to summarise it again. However, that also lacks context for each domain.

I created a new tool in OpenCode that generates a single HTML file from all reports from subagents and the main agent. The primary agents create these HTML files as a result of the investigation using the tool. I read this HTML file to learn the investigation result and also send it to anyone when I want to share, and they can see the whole thing: key findings, listed pros/cons for each domain, final result, and my prompts, what the primary agent told the subagents, etc.

This way, I don't need to worry about another write-up, and the HTML serves multiple purposes by definition. It has a key summary for people who need the result and detailed findings for those who need more.

### Why OpenCode?

I got this question from one of the readers of this blog after a few email exchanges. I chose OpenCode for one specific reason: I can change my LLM models and find what fits best. Claude locks me into Anthropic models, Codex locks me into OpenAI, and Gemini locks me into Google. While I can test and play around with many models, why would I lock myself into a single one?

While Claude Code is a really good harness, it becomes non-functional when it's down. I use Claude Code with my personal subscription. With OpenCode at work, I switch my LLM model provider and continue working.

OpenCode has an opinionated approach while still being customizable, which is good enough. It also has a desktop app (although not great) that non-developers can install and use, like my Product Manager. I would love to try as many tools as possible, but who has that much time? I would rather keep my focus on building what I need. Then I can ask AI to move my opencode.json file to whatever the next tool we choose, if we want to change.

Last but not least, OpenCode is open source and has a strong, active developer ecosystem that keeps it well-maintained and rich in plugins. 

### Custom CLI Tool

After having 10 repositories, it became problematic to manage the whole submodules. So, I built a custom CLI tool. It is nothing fancy, and I don't even know how it works as I vibe-coded it. It only needed a few simple functionalities:

- Load/Unload modules
- Load/Unload predefined groups of modules
- Load/Unload all repositories under a single domain
- Status of loaded/unloaded modules
- Delete modules (without disconnecting them) to save space
- Define new groups of modules to load/unload with one command

It works very smoothly and is super easy to use. The custom AI agents I created also use the CLI tool instead of using git directly to load groups of modules with a single command (increasing token efficiency).

### Future Improvements

I'll keep this section up to date with the latest status. Here are the next improvements I'm considering.

- I am thinking of adding an update-all-needed submodules step before any primary agent run, and maybe a GitHub action to update the submodules with a cron job, then push to the main branch right away. But it will also require everyone to pull the changes. So, I'm more inclined to add it as a task to the agent. BUT it will make the agent run longer, as there are almost 60 repositories to review. Maybe a cron job to update modules and commit to the main branch, and then an agent to review for new commits on the main branch, would be sufficient.
- I want to be able to run the investigation without access to GitHub and in the cloud. Although this is not a primary goal right now, it will definitely come in handy for people who are not familiar with the terminal.
- Updating MEMORY.md in every run and from everyone using the repository, and automatically pushing to the repository.
- Use Primary Agents via @-mentioning them on Slack. This is my ultimate goal.
