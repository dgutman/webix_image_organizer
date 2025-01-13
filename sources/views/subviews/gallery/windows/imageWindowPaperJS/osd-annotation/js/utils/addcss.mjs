/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.12
 * 
 * Includes additional open source libraries which are subject to copyright notices
 * as indicated accompanying those segments of code.
 * 
 * Original code:
 * Copyright (c) 2022-2024, Thomas Pearce
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * 
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * 
 * * Neither the name of osd-paperjs-annotation nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */
const localImportsCompleted = typeof importedCSS !== 'undefined';
/**
 * 
 * A regular expression pattern to check for in existing CSS links in the document, used to avoid duplicating CSS files. If the pattern is found in the document, the new link is not added. For consistency, the pattern is also checked against the url parameter to make sure it will exist in the document after adding the new link. If the pattern is not found in the url, an error is logged to the console and the file is not added
 * test
 * @memberof OSDPaperjsAnnotation#
 * @param {string} url - The URL of the CSS file to add.
 * @param {string} [nameToCheck] - The name pattern to check in the URL. If provided,
 * @returns {void}
 */
function addCSS(url, nameToCheck){
    if(localImportsCompleted){
        // console.log('Already imported', url);
        return;
    }
    // convert relative url to absolute
    
    if(!url.startsWith('http')){
        url = `${import.meta.url.match(/(.*?)js\/utils\/[^\/]*$/)[1]}css/${url}`;
    }

    

    if(nameToCheck){
        let pattern=`\/${nameToCheck}\.(?:min\.)?css`;
        let urlMatchesPattern = url.match(pattern);

        if(!urlMatchesPattern){
            console.error(`addCSS error: pattern(${pattern}) not found in url (${url})`)
            return;
        }

        let found = Array.from(document.head.getElementsByTagName('link')).filter(link=>{
            return link.href.match(pattern)
        });

        if(found.length>0){
            return;
        }
        
    }
    
    let link = document.createElement('link');
    link.rel='stylesheet';
    link.href=url;
    document.head.appendChild(link);
    
}

export {addCSS}