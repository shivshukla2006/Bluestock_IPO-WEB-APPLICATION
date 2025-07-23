
from django.contrib import admin
from .models import Company, IPO, Subscription, Announcement

admin.site.register(Company)
admin.site.register(IPO)
admin.site.register(Subscription)
admin.site.register(Announcement)

# Register your models here.
