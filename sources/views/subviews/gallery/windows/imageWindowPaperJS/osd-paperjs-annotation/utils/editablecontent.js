export class EditableContent{
    constructor(opts){
        let defaultOpts = {
            initialContent:'Enter text...',
        }
        opts = Object.assign({}, defaultOpts, opts);

        this._element = document.createElement('span');
        this._ec = document.createElement('span');
        this._button = document.createElement('span');
        this._element.appendChild(this._ec);
        this._element.appendChild(this._button);
        this._oldtext='';

        this._element.classList.add('editablecontent');
        this._ec.classList.add('text-content');
        this._button.classList.add('fa', 'fa-edit', 'edit-button', 'onhover');

        this._ec.textContent = opts.initialContent;
        //this._ec.setAttribute('contenteditable',true);

        this._element.addEventListener('focusout',()=>{
            if(!this._element.classList.contains('editing')){
                return;
            }
            let newtext = this._ec.textContent.trim();
            if(newtext !== this.oldtext){
                this.onChanged && this.onChanged(newtext);
            }
            this._element.classList.remove('editing');
            this._ec.setAttribute('contenteditable',false);
        });

        this._element.addEventListener('keypress',ev=>{
            if(!this._element.classList.contains('editing')){
                return;
            }
            ev.stopPropagation();
            if(ev.key=='Enter'){
                ev.preventDefault();
                this._ec.blur();
            }
        });

        this._element.addEventListener('keydown keyup',ev=>{
            if(!this._element.classList.contains('editing')){
                return;
            }
            ev.stopPropagation();
        });

        this._button.addEventListener('click',()=>this._editClicked());


    }
    get element(){
        return this._element;
    }
    get onChanged(){
        return this._onChanged;
    }
    set onChanged(func){
        if(typeof func === 'function' || func === null){
            this._onChanged=func;
        } else {
            throw('Value must be a function or null');
        }
    }
    setText(text){
        this._ec.textContent = text;
    }
    _editClicked(){
        this._element.classList.add('editing');
        this._ec.setAttribute('contenteditable',true);
        this._oldtext = this._ec.textContent.trim();
        let range = document.createRange();
        range.selectNodeContents(this._ec);
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        // let header = this._element.find('.editablecontent');
        // header.addClass('editing');
        // let ce = header.find('.edit').attr('contenteditable',true).focus();
        // ce.data('previous-text',ce.text());
        // let range = document.createRange();
        // range.selectNodeContents(ce[0]);
        // let selection = window.getSelection();
        // selection.removeAllRanges();
        // selection.addRange(range);
    }
}