生成 IDE 代理指南 ( NOTES.md )（Gemini App / AI Studio）： 使用 part3-generate-notes-for-agent.md 。提供 PRD、步骤 2 中的技术设计文档文件以及步骤 1 中深入研究的关键发现。Gemini 将生成一个结构化的 NOTES.md 文件，用于指导 IDE 代理。

设置项目和提示 IDE 代理（AI IDE）： 设置您的本地项目，包括 PRD、技术设计文档和步骤 3 中生成的 NOTES.md 。激活您的 IDE 代理并提供初始提示，指示它基于这些文件构建 MVP。

监督代理代码生成 (AI IDE)： 监控 IDE 代理生成初始代码库、创建文件以及执行 NOTES.md 中的计划。如有需要，可通过代理的聊天界面提供说明。


## 推荐

1. 深度研究： 使用最强大的模型的 deep research 
2. PRD/Tech Design Doc/NOTES.md 生成：最强大的模型 & 强大的推理模型
3. 用于代码生成/细化：IDE 的集成 AI 代理（Copilot Chat、Cursor 等）



目标： 生成一个结构化的 NOTES.md 文件，该文件总结了关键信息，并根据提供的产品需求文档 (PRD) 和技术设计文档 (Tech Design Doc) 提供了一份高阶的实施计划。此 NOTES.md 文件将在初始代码生成阶段作为 AI IDE 代理（例如 GitHub Copilot Chat 或 Cursor）的主要指南。

你需要更具当前的模版目录结合起来解决问题。

AI 角色： 扮演一位一丝不苟的技术项目经理。你的任务是彻底分析参考的 PRD 文件和技术设计文档，并将它们合成为一个清晰、可操作、适合 AI 代理的 NOTES.md 格式的文件。

