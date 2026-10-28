# 当前需求

本次将 pricing.total 的返回契约从以元计的 Decimal 改为以分计的整数。商品字典的 unit_cents 始终以分计，quantity 为正整数。所有结算入口必须保持实际收取金额不变；支付接口 charge 接受以分计的整数。worker.run_checkout 是当前结算入口，普通订单会调用此路径。
