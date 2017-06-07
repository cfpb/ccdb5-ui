from django.conf.urls import url
from maria.views import IndexView

urlpatterns = [
    url(r'^$', IndexView.as_view()),
]
