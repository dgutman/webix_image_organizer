/**
 * Bare-bones dialog implementation of a dialog
 * @param {String} innerHTML 
 */

class Dialog{
    constructor({innerHTML, title}){
        const div = document.createElement('div');
        document.querySelector('body').appendChild(div);
        div.style.position='fixed';
        div.style.width = '100vw';
        div.style.height = '100vh';
        div.style.left = 0;
        div.style.top = 0;

        const bg = document.createElement('div');
        div.appendChild(bg);
        bg.style.backgroundColor = 'gray';
        bg.style.opacity = 0.9;
        bg.style.width = '100%';
        bg.style.height = '100%';
        bg.style.position = 'absolute';

        const fg = document.createElement('div');
        fg.classList.add('ui-dialog');
        div.appendChild(fg);
        fg.style.setProperty('max-height','80%');
        fg.style.setProperty('max-width','80%');
        fg.style.left = '50%';
        fg.style.top = '50%';
        fg.style.transform = 'translate(-50%, -50%)';
        fg.style.overflow = 'auto';
        fg.style.position = 'relative';
        fg.style.backgroundColor = 'white';
        fg.style.display = 'inline-block';
        fg.style.padding = '2px';
        fg.style.borderRadius = '2px';

        const topbar=document.createElement('div');
        fg.appendChild(topbar);
        topbar.style.padding = '0.3em 0.6em';
        topbar.style.backgroundColor = 'rgb(233, 233, 233)';
        topbar.style.borderColor = 'rgb(220, 220, 220)';
        topbar.style.borderRadius = '2px';
        topbar.style.display = 'flex';

        const header = document.createElement('label');
        topbar.appendChild(header);
        header.innerText = title;
        header.style.fontWeight = 'bold';
        header.style.flexGrow = 1;

        const close = document.createElement('button');
        close.innerText='x';
        close.style.marginLeft = '1em';
        topbar.appendChild(close);
        close.addEventListener('click',()=>this.hide());

        const contents=document.createElement('div');
        fg.appendChild(contents);
        contents.innerHTML = innerHTML;

        bg.addEventListener('click',()=>this.hide());

        this.element = div;
        this.container = contents;
        this.background = bg;
        this.foreground = fg;
        this.topbar = topbar;

        this.hide();
    }
    show(){
        this.element.style.display = 'block';
    }
    hide(){
        this.element.style.display = 'none';
    }
    toggle(){
        this.element.style.display === 'none' ? this.show() : this.hide();
    }
}

export function dialog(innerHTML){
    
    return new Dialog(innerHTML);
}