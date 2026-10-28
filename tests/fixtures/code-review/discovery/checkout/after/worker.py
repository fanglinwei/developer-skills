from gateway import charge
from pricing import total


def run_checkout(items):
    return charge(int(total(items) * 100))
