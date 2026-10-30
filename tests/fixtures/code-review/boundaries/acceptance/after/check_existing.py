from routes import export_summary
assert export_summary([{'amount_cents': 199}])[0] == 'amount'
print('CSV header check passed')
