# Generated by Django 4.2.16 on 2024-12-25 17:06

import core.models
from django.db import migrations, models
import django.db.models.deletion
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0012_garment_price"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="cartitem",
            options={
                "verbose_name": "предмет корзины",
                "verbose_name_plural": "пред��еты корзины",
            },
        ),
        migrations.RemoveField(
            model_name="product",
            name="category",
        ),
        migrations.AddField(
            model_name="product",
            name="garments",
            field=models.ManyToManyField(
                help_text="футболки товара",
                related_name="products",
                related_query_name="products",
                to="catalog.garment",
                verbose_name="футболки",
            ),
        ),
        migrations.CreateModel(
            name="ProductAdditionalImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "image",
                    sorl.thumbnail.fields.ImageField(
                        help_text="загрузите изображение",
                        upload_to=core.models.get_path_image,
                        verbose_name="изображение",
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        help_text="товар изображения",  
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="additional_images",
                        related_query_name="additional_images",
                        to="catalog.product",
                        verbose_name="товар",
                    ),
                ),
            ],
            options={
                "verbose_name": "дополнительное изображение товара",
                "verbose_name_plural": "дополнительные изображения товаров",
            },
        ),
    ]
