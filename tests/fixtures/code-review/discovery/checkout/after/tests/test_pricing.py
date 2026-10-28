import unittest
from pricing import total


class PricingTests(unittest.TestCase):
    def test_integer_cents(self):
        result = total([{'unit_cents': 1250, 'quantity': 2}])
        self.assertEqual(result, 2500)
        self.assertIsInstance(result, int)

    def test_empty(self):
        self.assertEqual(total([]), 0)
