# 结算金额契约改动

审查 `before/` 到 `after/`，当前需求见 requirements.md；review.diff 是这两个版本的比较。源代码是完整的最小结算路径。现有检查：在 after 目录运行 `python3 -B -m unittest discover -s tests`。gateway.py 是本地假实现，只返回传入字段，不发起支付或网络请求。
