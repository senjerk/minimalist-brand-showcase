# Generated by Django 4.2.16 on 2024-12-26 12:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "catalog",
            "0021_remove_cart_items_cartitem_cart_cartitem_quantity_and_more",
        ),
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
