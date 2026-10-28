def export_rows(records):
    return [{'id': row['id'], 'amount': row['amount']}
            for row in records if not row['archived']]
