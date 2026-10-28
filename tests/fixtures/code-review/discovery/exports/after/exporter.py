def export_rows(records, include_archived=False):
    return [{'id': row['id'], 'amount': row['amount'], 'status': row['status']}
            for row in records if not row['archived']]
