from django.conf.urls import url
from ccdb5_ui.views import CCDB5MainView

urlpatterns = [
    url(r'^.*$', CCDB5MainView.as_view()),
]
