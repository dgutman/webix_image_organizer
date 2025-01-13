export function domObjectFromHTML(html){
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.children.length === 1 ? template.content.children[0] : template.content.children;
}