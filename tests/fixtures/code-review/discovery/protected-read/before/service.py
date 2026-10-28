from repository import load_order


def get_order(records, tenant, order_id):
    order = load_order(records, tenant, order_id)
    return None if order is None else {'id': order_id, 'total': order['total']}
