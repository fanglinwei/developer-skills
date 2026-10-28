# 导出功能扩展

审查 `before/` 到 `after/`，需求见 requirements.md，改动见 review.diff。运行环境为本地 Python，记录列表就是完整数据源，不存在额外过滤层。现有检查：在 after 目录运行 `python3 -B -m unittest discover -s tests`，仅使用内存数据。
