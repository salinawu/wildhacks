from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib import auth, messages

def home(request):
	return render_to_response('home.html', 
			locals(),
			context_instance=RequestContext(request))
