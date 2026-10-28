# 订单读取改动

审查 `before/` 到 `after/` 的改动，需求见 requirements.md。文件目录是两个固定版本，没有 Git 历史；使用 review.diff 和完整源码判断影响。相关现有检查：在 after 目录运行 `python3 -B -m unittest discover -s tests`，只使用内存数据，不访问网络、数据库或环境凭据。
