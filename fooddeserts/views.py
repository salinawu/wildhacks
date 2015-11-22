from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib import auth, messages
from django.core import serializers
from fooddeserts.models import Stores
import sqlite3

def home(request):
	# json_serializer = serializers.get_serializer("json")()
	# g_stores = json_serializer.serialize(Stores.objects.all())

	conn = sqlite3.connect('db.sqlite3')
	c = conn.cursor()
	stores = c.execute("SELECT * FROM stores")
	stores = stores.fetchall()
	groc_stores = []
	for i in stores:
		groc_stores.append([i[0], 'grocery', i[2], i[3]])

	conn.commit()
	conn.close()

	return render_to_response('home.html',
		locals(),
		context_instance=RequestContext(request))
