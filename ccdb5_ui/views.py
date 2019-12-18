from django.views.generic.base import TemplateView
from django.conf import settings

try:
    STANDALONE = settings.STANDALONE
except:  # pragma: no cover
    STANDALONE = False


if STANDALONE:
    BASE_TEMPLATE = 'ccdb5_ui/standalone_base.html'
else:  # pragma: no cover
    BASE_TEMPLATE = 'front/base_update.html'


no_support = [
    'MSIE 8.0;',
    'MSIE 7.0b;',
    'MSIE 7.0;',
]

class CCDB5MainView(TemplateView):
    template_name = 'ccdb5_ui/ccdb-main.html'
    base_template = BASE_TEMPLATE

    def get_context_data(self, **kwargs):
        # See if an unsupported browser is making the request
        browser = self.request.META.get('HTTP_USER_AGENT', '')
        path = self.request.get_full_path()
        noindex = False

        if 'detail' in path:
            noindex = True

        unsupported = any([x for x in no_support if x in browser])
        context = super(CCDB5MainView, self).get_context_data(**kwargs)
        context['noindex'] = noindex
        context['path'] = path = self.request.get_full_path()
        context['ccdb5_base_template'] = self.base_template
        context['unsupported_browser'] = unsupported
        return context
