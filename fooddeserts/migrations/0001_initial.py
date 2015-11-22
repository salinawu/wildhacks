# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Stores',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('index', models.IntegerField(null=True, blank=True)),
                ('store_type', models.TextField(null=True, db_column='STORE_TYPE', blank=True)),
                ('latitude', models.FloatField(null=True, db_column='LATITUDE', blank=True)),
                ('longitude', models.FloatField(null=True, db_column='LONGITUDE', blank=True)),
            ],
            options={
                'db_table': 'stores',
                'managed': False,
            },
        ),
    ]
