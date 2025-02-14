# Generated by Django 4.2.16 on 2024-12-27 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0023_order_address_alter_order_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="phone",
            field=models.CharField(blank=True, max_length=16, null=True),
        ),
        migrations.AlterField(
            model_name="order",
            name="status",
            field=models.CharField(
                choices=[
                    ("WP", "Ожидает оплаты"),
                    ("PD", "Оплачен"),
                    ("ID", "В доставке"),
                    ("DV", "Доставлен"),
                    ("CN", "Отменён"),
                ],
                default="WP",
                help_text="статус заказа",
                max_length=2,
                verbose_name="статус заказа",
            ),
        ),
    ]
