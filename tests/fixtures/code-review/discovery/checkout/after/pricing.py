def total(items):
    return sum(item['unit_cents'] * item['quantity'] for item in items)
