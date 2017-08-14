from django.views.generic.base import TemplateView
from django.conf import settings

try:
    STANDALONE = settings.STANDALONE
except:  # pragma: no cover
    STANDALONE = False


if STANDALONE:
    BASE_TEMPLATE = 'standalone_base.html'
else:  # pragma: no cover
    BASE_TEMPLATE = 'front/base_update.html'


class CCDB5MainView(TemplateView):
    template_name = 'ccdb-main.html'
    base_template = BASE_TEMPLATE

    def get_context_data(self, **kwargs):
        context = super(CCDB5MainView, self).get_context_data(**kwargs)
        context['ccdb5_base_template'] = self.base_template
        return context
