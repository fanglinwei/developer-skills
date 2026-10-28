from repository import load_order


def get_order(records, tenant, order_id):
    order = load_order(records, order_id)
    if order is not None and order['tenant'] != tenant:
        raise PermissionError('order belongs to another tenant')
    return None if order is None else {'id': order_id, 'total': order['total']}
