class ReportStore:
    def __init__(self, reports):
        self.reports = reports

    def for_user(self, principal):
        return self.reports[principal]
