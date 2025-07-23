from django.db import models
from django.contrib.auth.models import User

# 🏢 Company
class Company(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    logo_url = models.URLField(blank=True)
    description = models.TextField()

    def __str__(self):
        return self.name

# 📁 Custom upload paths with fixed filenames
def upload_to_rhp(instance, filename):
    return '../frontend/public/pdfs/demo-rhp.pdf'

def upload_to_drhp(instance, filename):
    return '../frontend/public/pdfs/demo-drhp.pdf'

# 💸 IPO
class IPO(models.Model):
    STATUS_CHOICES = (
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('closed', 'Closed'),
    )

    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    issue_price = models.DecimalField(max_digits=10, decimal_places=2)
    opening_date = models.DateField()
    closing_date = models.DateField()
    total_shares = models.PositiveIntegerField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)

    rhp_file = models.FileField(upload_to=upload_to_rhp, blank=True, null=True)
    drhp_file = models.FileField(upload_to=upload_to_drhp, blank=True, null=True)

    def rhp_link(self):
        return '/pdfs/demo-rhp.pdf' if self.rhp_file else None

    def drhp_link(self):
        return '/pdfs/demo-drhp.pdf' if self.drhp_file else None

    def __str__(self):
        return f"{self.company.name} ({self.status})"

# 📥 Subscription
class Subscription(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ipo = models.ForeignKey(IPO, on_delete=models.CASCADE)
    shares_applied = models.PositiveIntegerField()
    application_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.user.username} → {self.ipo.company.name} ({self.shares_applied} shares)"

# 📣 Announcement
class Announcement(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    published_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company.name} → {self.title}"