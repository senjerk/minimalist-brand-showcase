# Generated by Django 4.2.16 on 2024-12-29 17:56

import catalog.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0028_alter_order_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="confirmation_url",
            field=models.URLField(
                blank=True,
                help_text="url для подтверждения платежа",
                null=True,
                verbose_name="url для подтверждения платежа",
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_id",
            field=models.CharField(
                blank=True,
                help_text="идентификатор платежа в платежной системе",
                max_length=255,
                null=True,
                verbose_name="идентификатор платежа",
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_status",
            field=models.CharField(
                choices=[
                    ("pending", "В ожидании"),
                    ("succeeded", "Успешно"),
                    ("canceled", "Отменён"),
                ],
                default="pending",
                help_text="статус платежа в платежной системе",
                max_length=20,
                verbose_name="статус платежа",
            ),
        ),
        migrations.AlterField(
            model_name="order",
            name="phone",
            field=models.CharField(
                default=1,
                help_text="номер телефона пользователя",
                max_length=15,
                validators=[catalog.validators.validate_russian_phone],
                verbose_name="номер телефона",
            ),
            preserve_default=False,
        ),
    ]
