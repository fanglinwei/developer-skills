from exporter import export_amount

def export_summary(rows):
    return ['amount'] + [export_amount(row['amount_cents']) for row in rows]
