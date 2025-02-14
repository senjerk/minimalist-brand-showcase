# Generated by Django 4.2.16 on 2025-01-01 08:26

import catalog.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0031_order_unique_user_waiting_payment"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="embroidery",
            field=models.FileField(
                blank=True,
                help_text="файл вышивки товара",
                null=True,
                upload_to=catalog.models.get_path_file,
                verbose_name="файл вышивки",
            ),
        ),
    ]
