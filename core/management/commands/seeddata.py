from django.core.management.base import BaseCommand
from core.models import Company, IPO, Announcement
from django.utils import timezone
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seeds the database with dummy IPO-related data'

    def handle(self, *args, **options):
        industries = ['FinTech', 'Healthcare', 'AI/ML', 'Energy', 'Retail']
        company_names = ['Quantify Ltd.', 'MedX Labs', 'NeuroNet AI', 'Solarium Energy', 'RetailRocket']

        # Create Companies
        companies = []
        for name in company_names:
            c = Company.objects.create(
                name=name,
                industry=random.choice(industries),
                logo_url='https://via.placeholder.com/150',
                description=f'{name} is transforming the {random.choice(industries)} sector.'
            )
            companies.append(c)
        self.stdout.write(self.style.SUCCESS(f'✔ Created {len(companies)} companies'))

        # Create IPOs
        for company in companies:
            IPO.objects.create(
                company=company,
                issue_price=round(random.uniform(120, 480), 2),
                opening_date=timezone.now().date(),
                closing_date=timezone.now().date() + timedelta(days=5),
                total_shares=random.randint(100000, 300000),
                status=random.choice(['upcoming', 'ongoing', 'closed'])
            )
        self.stdout.write(self.style.SUCCESS(f'✔ IPOs created for each company'))

        # Create Announcements
        for company in companies:
            Announcement.objects.create(
                company=company,
                title=f'{company.name} IPO News',
                content=f'{company.name} has filed for an IPO. Stay tuned for the opening date!'
            )
        self.stdout.write(self.style.SUCCESS(f'✔ Announcements added for each company'))