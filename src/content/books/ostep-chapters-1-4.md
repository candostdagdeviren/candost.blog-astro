---
title: "OSTEP: Chapters 1-4"
description: "Operating Systems: Three Easy Pieces, Chapters 1-4"
tags:
  - chapter-notes
date: 2026-02-01T16:46:00.000+01:00
updateDate: 2026-02-01T16:46:00.000+01:00
external: false
draft: true
---
I've recently started reading the [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/) by [Remzi H. Arpaci-Dusseau](https://www.cs.wisc.edu/~remzi) and [Andrea C. Arpaci-Dusseau](https://www.cs.wisc.edu/~dusseau). The book is, to my surprise, free. This is probably one of the biggest contributions to the computer science community. I first saw the book when I came across Phil Eaton's book club. I'm reading the book together with hundreds of people in this book club.

It’s been more than a decade since I read anything about Operating  Systems. I also don’t work in the area. It’s purely an interest and curiosity that I'm reading this book. I really liked book’s language, which is very different than any other book I've read in computer science. You're having a conversation with authors and it's really fun.

It was great to finally understand what virtualization mean, especially on the memory side. Looking forward to learning with you and from you all.

Here are my notes from first chapters:

### Chapter 2

#### Virtualizing CPU

While running multiple programs on a single CPU, the Operating System (OS) creates the illusion that the machine has multiple CPUs. That is done via virtualizing the CPU. For example, if you run multiple commands in the CLI on a single CPU, the CPU will switch execution between these programs until all are finished. That creates an illusion that they run in parallel.

#### Virtualizing Memory

When a program tries to access memory, the OS creates a virtual memory and assigns it a private virtual address space.

Even if multiple processes run in parallel and try to create a new allocation, they each get their own private address space. That’s why, when we request memory with malloc() in C for two processes simultaneously, they can get the same address, indicating both programs are assigned to the same address space. Actually, they both have their own virtual address space. For the program, it appears to have access to physical memory (and it does), but the OS manages the actual access while the program is in its virtual address space. So, one program can’t affect another.

### Chapter 4

* The Operating System (OS) creates the illusion of multiple CPUs (even when there is only one) by using a technique called time-sharing.
* CPU needs low-level methods or protocols called mechanisms and high-level intelligence called policies.

#### Running a process

![](/images/content/books/ostep-running-a-process.png "Running a program")

Before running a program, the OS needs to create the process:

1. Load the process’s code and data from disk to memory
2. Allocate memory for the program’s stack
3. Allocate memory for the program’s heap
4. Initialization of I/O
5. Start the program (call `main()`) and transfer the control of the CPU

#### Process States

![Process States](/images/content/books/ostep-process-states.png "Process States")

* The OS has data structures, such as “Process List,” to keep track of important operations. Each process has a data structure representation that includes context, memory location and size, state, parent process, and more.
