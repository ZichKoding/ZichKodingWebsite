from django import template
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
import mistune

register = template.Library()

class HighLightRenderer(mistune.HTMLRenderer):
    def block_code(self, code, info=None):
        # Default to 'bash' if no language is specified
        lang = info or 'bash'
        try:
            lexer = get_lexer_by_name(lang, stripall=True)
        except Exception:
            # Fallback to a generic text lexer if the specified language is not found
            lexer = get_lexer_by_name('text', stripall=True)
        formatter = HtmlFormatter()
        highlighted_code = highlight(code, lexer, formatter)
        return f'<div class="codehilite">{highlighted_code}</div>'

@register.filter
def markdown(value):
    renderer = HighLightRenderer()
    markdown = mistune.create_markdown(renderer=renderer)
    return markdown(value)