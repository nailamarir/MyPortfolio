---
title: What "Agentic AI" Actually Means
date: 2026-05-10
tags: [agentic-ai, llm, tutorial]
excerpt: Beyond the hype — a working definition of agentic AI, the four ingredients that separate a real agent from a glorified chatbot, and why this distinction matters for safety.
icon: bot
read_time: 6
---

The phrase "agentic AI" gets thrown around a lot, and increasingly it means whatever the speaker wants it to mean. Let me try to pin it down — not as a marketing label, but as a *system property*.

## A working definition

An AI system is **agentic** to the degree that it can:

1. **Set and refine goals** without being told the exact steps.
2. **Take actions in an environment** (call tools, write files, query APIs).
3. **Observe outcomes** and update its plan accordingly.
4. **Persist across time** — remember what happened, what worked, and what didn't.

Notice none of these mention LLMs specifically. An RL policy doing robotic manipulation is agentic. A classic BDI planner is agentic. The reason today's conversation centers on LLMs is just that *recent* agents happen to use language models as their reasoning core.

## The four ingredients

To build something that meets the definition above, you need four pieces:

| Component | What it does | Common mistake |
|---|---|---|
| **Reasoning core** | Decomposes goals, chooses next action | Treating the LLM as the whole agent |
| **Tool layer** | Lets the agent act on the world | Tools without authentication = anyone's agent |
| **Memory** | Carries state across steps and sessions | Stuffing it all into the context window |
| **Evaluator / critic** | Decides whether progress is real | Skipping this and trusting the LLM's self-report |

In my own research on [BRAC](/#projects) — Byzantine-Resilient Agentic Consensus for NHL diagnosis — the critic layer is the load-bearing piece. Without it, multiple agents will *confidently* agree on the wrong answer.

## Why the distinction matters for safety

If a system has all four ingredients, the threat model is no longer "the model might say something wrong." It's:

> The model might *do* something wrong, *repeatedly*, while updating its strategy based on what it observes.

That's a different kind of problem. It's why work like [A3L](/#projects) on adversarial active learning for cyber threat intelligence treats the agent as an *MDP* — a Markov Decision Process — and not as a stateless classifier.

## The takeaway

If a chatbot can only respond to your messages, it's not an agent. If it can *initiate*, *act*, and *learn from outcomes*, then yes — and the safety questions get sharper, not softer.

I'll come back to this with a concrete code walk-through of a small four-component agent in a future post.
