from decimal import Decimal


def total(items):
    cents = sum(item['unit_cents'] * item['quantity'] for item in items)
    return Decimal(cents) / 100
