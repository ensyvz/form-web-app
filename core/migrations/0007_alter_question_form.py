# Generated by Django 3.2.6 on 2021-08-26 11:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_remove_form_creation_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='form',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='core.form'),
        ),
    ]