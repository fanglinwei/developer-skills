def load_order(records, tenant, order_id):
    order = records.get(order_id)
    if order is not None and order['tenant'] != tenant:
        raise PermissionError('order belongs to another tenant')
    return order
