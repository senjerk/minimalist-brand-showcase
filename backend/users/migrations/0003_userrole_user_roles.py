# Generated by Django 4.2.16 on 2025-01-01 08:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_alter_user_email_alter_user_username"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserRole",
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
                    "role",
                    models.CharField(
                        choices=[
                            ("moderator", "Модератор"),
                            ("designer", "Дизайнер"),
                            ("embroiderer", "Вышивальщик"),
                            ("courier", "Курьер"),
                        ],
                        max_length=32,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="user",
            name="roles",
            field=models.ManyToManyField(
                related_name="users", to="users.userrole", verbose_name="роли"
            ),
        ),
    ]
