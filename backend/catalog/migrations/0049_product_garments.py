# Generated by Django 4.2.16 on 2025-01-18 12:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0048_remove_product_garments"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="garments",
            field=models.ManyToManyField(
                help_text="одежда товара",
                related_name="products",
                related_query_name="products",
                to="catalog.garment",
                verbose_name="одежды",
            ),
        ),
    ]
