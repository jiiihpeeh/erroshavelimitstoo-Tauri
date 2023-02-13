import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
import 'mathjax-full/js/input/tex/base/BaseConfiguration.js';
import 'mathjax-full/js/input/tex/ams/AmsConfiguration.js';
import 'mathjax-full/js/input/tex/amscd/AmsCdConfiguration.js';
import 'mathjax-full/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import 'mathjax-full/js/input/tex/braket/BraketConfiguration.js';
import 'mathjax-full/js/input/tex/bussproofs/BussproofsConfiguration.js';
import 'mathjax-full/js/input/tex/cancel/CancelConfiguration.js';
import 'mathjax-full/js/input/tex/centernot/CenternotConfiguration.js';
import 'mathjax-full/js/input/tex/color/ColorConfiguration.js';
import 'mathjax-full/js/input/tex/colortbl/ColortblConfiguration.js';
import 'mathjax-full/js/input/tex/gensymb/GensymbConfiguration.js';
import 'mathjax-full/js/input/tex/mathtools/MathtoolsConfiguration.js';
import 'mathjax-full/js/input/tex/mhchem/MhchemConfiguration.js';
import 'mathjax-full/js/input/tex/newcommand/NewcommandConfiguration.js';
import 'mathjax-full/js/input/tex/noerrors/NoErrorsConfiguration.js';
import 'mathjax-full/js/input/tex/noundefined/NoUndefinedConfiguration.js';
import 'mathjax-full/js/input/tex/setoptions/SetOptionsConfiguration.js';
import 'mathjax-full/js/input/tex/textcomp/TextcompConfiguration.js';
import 'mathjax-full/js/input/tex/textmacros/TextMacrosConfiguration.js';
import 'mathjax-full/js/input/tex/upgreek/UpgreekConfiguration.js';
import 'mathjax-full/js/input/tex/verb/VerbConfiguration.js';

//# Create DOM adaptor and register it for HTML documents
let adaptor = liteAdaptor();

RegisterHTMLHandler(adaptor);

//AssistiveMmlHandler handler

//# Create input and output jax and a document using them on the content from the HTML file
let tex = new TeX({
  packages: ['base', 'ams', 'amscd', 'boldsymbol', 'braket', 'bussproofs',
             'cancel', 'centernot', 'color', 'colortbl', 'gensymb', 'mathtools', 
             'mhchem', 'newcommand', 'noerrors', 'noundefined', 'setoptions', 'textcomp', 
             'textmacros', 'upgreek', 'unicode', 'verb']
});

let svg = new SVG({
  fontCache: 'local'
});

let html = mathjax.document('', {
  InputJax: tex,
  OutputJax: svg
});

const mathJaxSVGConverter = (formula:string|null):string|null => {
  if (!formula) {
    return '<svg></svg>';
  }
  let em = null
  let ex = null
  let containerWidth = null
  let node = html.convert(formula, {
    display: true,
    em: em != null ? em : 16,
    ex: ex != null ? ex : 8,
    containerWidth: containerWidth != null ? containerWidth : 80 * 16
  });
  let svgString  = adaptor.innerHTML(node);
  if(svgString){
    return svgString;
  }
  return null;
};

export default mathJaxSVGConverter;