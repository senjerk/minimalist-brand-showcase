# Generated by Django 4.2.16 on 2025-01-02 13:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0038_productembroideryfile_category"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="productembroideryfile",
            options={
                "verbose_name": "файл вышивки",
                "verbose_name_plural": "файлы вышивки",
            },
        ),
        migrations.AlterUniqueTogether(
            name="productembroideryfile",
            unique_together={("product", "category")},
        ),
    ]
