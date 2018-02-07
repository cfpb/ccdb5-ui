from __future__ import absolute_import, unicode_literals

from django.test import RequestFactory, SimpleTestCase

from ccdb5_ui.views import CCDB5MainView


class CCDB5MainViewTest(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.view = CCDB5MainView.as_view()

    def test_get_supported_user_agent(self):
        request = self.factory.get('/', HTTP_USER_AGENT="Foo")
        response = self.view(request)
        self.assertContains(response, "Search the Consumer Complaint Database")

    def test_get_unsupported_user_agent(self):
        request = self.factory.get('/', HTTP_USER_AGENT="MSIE 8.0;")
        response = self.view(request)
        self.assertContains(response, "A more up-to-date browser is required")

    def test_get_no_user_agent(self):
        request = self.factory.get('/')
        response = self.view(request)
        self.assertContains(response, "Search the Consumer Complaint Database")
