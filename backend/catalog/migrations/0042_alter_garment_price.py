# Generated by Django 4.2.16 on 2025-01-17 05:58

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0041_alter_product_embroidery"),
    ]

    operations = [
        migrations.AlterField(
            model_name="garment",
            name="price",
            field=models.PositiveIntegerField(
                default=0,
                help_text="цена одежды",
                validators=[django.core.validators.MinValueValidator(0)],
                verbose_name="цена",
            ),
        ),
    ]
