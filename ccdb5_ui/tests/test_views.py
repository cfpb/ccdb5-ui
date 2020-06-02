from unittest.mock import patch

from ccdb5_ui.views import CCDB5MainView
from django.test import RequestFactory, SimpleTestCase


class CCDB5MainViewTest(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.view = CCDB5MainView.as_view()

    @patch('ccdb5_ui.views.flag_enabled')
    def test_get_supported_user_agent(self, mock_flag_enabled):
        mock_flag_enabled.return_value = True

        request = self.factory.get('/', HTTP_USER_AGENT="Foo")
        response = self.view(request)
        self.assertContains(response, "Search the Consumer Complaint Database")
        mock_flag_enabled.assert_called_once_with('CCDB5_TRENDS')

    @patch('ccdb5_ui.views.flag_enabled')
    def test_get_unsupported_user_agent(self, mock_flag_enabled):
        mock_flag_enabled.return_value = True

        request = self.factory.get('/', HTTP_USER_AGENT="MSIE 8.0;")
        response = self.view(request)
        self.assertContains(response, "A more up-to-date browser is required")
        mock_flag_enabled.assert_called_once_with('CCDB5_TRENDS')

    @patch('ccdb5_ui.views.flag_enabled')
    def test_get_no_user_agent(self, mock_flag_enabled):
        mock_flag_enabled.return_value = True

        request = self.factory.get('/')
        response = self.view(request)
        self.assertContains(response, "Search the Consumer Complaint Database")
        mock_flag_enabled.assert_called_once_with('CCDB5_TRENDS')
