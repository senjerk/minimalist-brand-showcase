# Generated by Django 4.2.16 on 2025-01-04 11:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0004_user_telegram_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="telegram_id",
            field=models.IntegerField(
                blank=True,
                help_text="ID в Telegram",
                null=True,
                verbose_name="ID в Telegram",
            ),
        ),
    ]
