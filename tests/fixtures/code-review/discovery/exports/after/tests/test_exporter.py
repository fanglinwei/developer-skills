import unittest
from exporter import export_rows


class ExportTests(unittest.TestCase):
    def test_default(self):
        rows = [{'id': 1, 'amount': 20, 'status': 'paid', 'archived': False},
                {'id': 2, 'amount': 30, 'status': 'paid', 'archived': True}]
        self.assertEqual(export_rows(rows), [{'id': 1, 'amount': 20, 'status': 'paid'}])

    def test_empty(self):
        self.assertEqual(export_rows([]), [])
