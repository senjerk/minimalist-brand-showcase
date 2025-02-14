# Generated by Django 4.2.16 on 2024-12-28 10:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("catalog", "0024_order_phone_alter_order_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cart",
            name="user",
            field=models.OneToOneField(
                help_text="пользователь корзины",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="cart",
                related_query_name="cart",
                to=settings.AUTH_USER_MODEL,
                verbose_name="пользователь",
            ),
        ),
    ]
