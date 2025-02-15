# Generated by Django 5.2a1 on 2025-02-03 22:35

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date_creation', models.DateField(default=datetime.datetime.now)),
                ('active', models.BooleanField(default=True)),
                ('user_followed', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='followers', to=settings.AUTH_USER_MODEL)),
                ('user_follower', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='follows', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date_creation', models.DateField(default=datetime.datetime.now)),
                ('active', models.BooleanField(default=True)),
                ('content', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='posts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date_creation', models.DateField(default=datetime.datetime.now)),
                ('active', models.BooleanField(default=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='likes', to=settings.AUTH_USER_MODEL)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='likes', to='network.post')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
