# Generated by Django 4.2.16 on 2025-01-04 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0003_userrole_user_roles"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="telegram_id",
            field=models.IntegerField(
                blank=True,
                help_text="ID в Telegram",
                max_length=100,
                null=True,
                verbose_name="ID в Telegram",
            ),
        ),
    ]
