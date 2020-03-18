from ccdb5_ui.views import CCDB5MainView


try:
    from django.urls import re_path
except ImportError:
    from django.conf.urls import url as re_path


urlpatterns = [
    re_path(r'^.*$', CCDB5MainView.as_view()),
]
