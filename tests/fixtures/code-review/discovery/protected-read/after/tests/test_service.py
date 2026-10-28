import unittest
from service import get_order


class OrderTests(unittest.TestCase):
    def test_owner(self):
        self.assertEqual(get_order({'o1': {'tenant': 'a', 'total': 120}}, 'a', 'o1'),
                         {'id': 'o1', 'total': 120})

    def test_other_tenant(self):
        with self.assertRaises(PermissionError):
            get_order({'o1': {'tenant': 'b', 'total': 120}}, 'a', 'o1')

    def test_missing(self):
        self.assertIsNone(get_order({}, 'a', 'missing'))
