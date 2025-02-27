# Generated by Django 4.2.16 on 2024-12-30 10:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0030_remove_order_unique_user_waiting_payment"),
    ]

    operations = [
        migrations.AddConstraint(
            model_name="order",
            constraint=models.UniqueConstraint(
                condition=models.Q(("status", "WP")),
                fields=("user", "status"),
                name="unique_user_waiting_payment",
            ),
        ),
    ]
