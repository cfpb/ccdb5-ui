from django.views.generic.base import TemplateView


class IndexView(TemplateView):
    template_name = 'index.html'
    base_template = 'base.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['maria_base_template'] = self.base_template
        return context
