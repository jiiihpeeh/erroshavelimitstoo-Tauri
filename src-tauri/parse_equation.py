 
from sympy.parsing.maxima import parse_maxima 
from sympy import diff
from sympy.parsing.sympy_parser import parse_expr
from sympy.printing.latex import print_latex
from sympy import Symbol
from  sympy import latex
from sympy import sqrt, simplify
from re import compile 
from sympy import symbols

DELTA= 'ERRORdeltaEXPRESSION'
lambda_find= compile('(?<=[\*\-+\\\\\s=\(/])lambda(?=[\*\-+\\\\\s=\)/])')
symbol_dict = {'C': Symbol('C', positive=True, real=True), 'O': Symbol('O', positive=True, real=True), 'Q': Symbol('Q', positive=True, real=True),
               'N': Symbol('N', positive=True, real=True), 'I': Symbol('I', positive=True, real=True), 'E': Symbol('E', positive=True, real=True), 
               'S': Symbol('S', positive=True, real=True), 'beta': Symbol('beta', positive=True, real=True), 'zeta': Symbol('zeta', positive=True, real=True), 
               'gamma': Symbol('gamma', positive=True, real=True), 'pi': Symbol('pi', positive=True, real=True), 'lambdaG': Symbol('lambda', positive=True, real=True)}
symbol_dict_values = {'C': Symbol('C'), 'O': Symbol('O'), 'Q': Symbol('Q'),
               'N': Symbol('N'), 'I': Symbol('I'), 'E': Symbol('E'), 
               'S': Symbol('S'), 'beta': Symbol('beta'), 'zeta': Symbol('zeta'), 
               'gamma': Symbol('gamma'), 'pi': Symbol('pi'), 'lambdaG': Symbol('lambda')}               
class Evaluator:
    def __init__(self, eq, conversion_dict = symbol_dict) -> None:
        self.eq_prefix=''
        self.used_symbols = {}
        self.eq_prefix_tex = ''
        self.error_equation = None
        self.error_equation_simplified = None
        self.symbol_list = None
        self.error_equation_construct =''
        self.conversion_dict = conversion_dict
        self.eq = self.parse(eq)
        self.eq_simplified = self.parse(eq, True)
        self.symbols = self.parsed_symbols()
        self.tex_symbols = [latex(i) for i in self.symbols.keys()]
        


    def parse(self, eq, evaluate=False):
        eq= lambda_find.sub('lambdaG'," "+eq+" ")
        eq_parts = eq.split('=')
        if len(eq_parts) >1:
            self.eq_prefix=parse_expr(eq_parts[0], local_dict=self.conversion_dict)
            self.eq_prefix_tex=latex(self.eq_prefix)
        first_parse = parse_expr(eq_parts[len(eq_parts) - 1], evaluate=evaluate,  local_dict=self.conversion_dict)
        new_symbol_dict = {}
        new_parse = lambda_find.sub('lambdaG'," "+str(first_parse)+" ")
        for k in first_parse.free_symbols:
            if str(k) != 'lambda':
                new_symbol_dict[str(k)] = Symbol(str(k), positive=True, real=True)
        self.conversion_dict.update(new_symbol_dict)
        return parse_expr(new_parse, evaluate=evaluate,  local_dict=self.conversion_dict)

    def parsed_symbols(self):
        symbol_list = list(self.eq.free_symbols)
        symbols_dict = {}
        for l in symbol_list:
            error_symbol = str(l)
            if latex(l) != str(l):
                error_symbol = latex(l).replace('\\', 'ExtraTeXPart').replace('}','').replace('{','')
            symbols_dict[l] = {'symbol':l, 'error_symbol': Symbol(DELTA +error_symbol, positive=True, real=True)}
            self.used_symbols[str(l)] = [str(l), DELTA +error_symbol, latex(l)]
        self.symbol_list = [ [str(i), latex(i)] for i in symbols_dict.keys()]
        return symbols_dict

    def parsed_tex(self, simplified = False):
        if simplified:
            return latex(self.eq_simplified)
        else:
            return latex(self.eq)

    def differentiated_parts(self):
        for i in self.symbols.keys():
            yield diff(self.eq, self.symbols[i]['symbol']) * self.symbols[i]['error_symbol']

    def differentiated_parts_squared(self):
        return [ i**2 for i in self.differentiated_parts()]

    def error_eq(self):
        error_term = parse_expr("0")
        for i in  self.differentiated_parts():
            error_term += i**2
        self.error_equation = sqrt(error_term)
        self.error_equation_simplified = simplify(self.error_equation)
        
        error_equation_list = ['\\left( \\frac{\\partial ' + self.eq_prefix_tex +' }{\\partial ' + i[1] + ' } \\delta ' + i[1]+' \\right)^2' for i in self.symbol_list]
        self.error_equation_construct = '\\sqrt{'+ '+'.join(error_equation_list) +'}'

def evaluation_dict(values,used_symbols):
    new_dict= {}
    eq_values = {}
    for k in used_symbols.keys():
        new_dict[k] = Symbol(used_symbols[k][0])
        new_dict[used_symbols[k][1]] = Symbol(used_symbols[k][1])
        eq_values[Symbol(used_symbols[k][1])] = float(values[k][1])
        eq_values[Symbol(used_symbols[k][0])] = float(values[k][0])
    new_dict.update(symbol_dict_values)
    return new_dict, eq_values


def evaluate_eq(eq, value_dict, eq_values):
    eq= lambda_find.sub('lambdaG'," "+eq+" ")
    
    parsed=parse_expr(eq.split('=')[-1], local_dict=value_dict)
    try:
        return float(parsed.subs(eq_values))
    except:
        return None
    

def tenExp(s:str)->str:
    if s == 'None':
        return s
    k= s.split('e')
    if len(k) != 2:
        return s
    return k[0] + '\cdot 10 ^ {'+ k[1].replace('+','') + '}'

def parse(eq):
    original_eq = eq    
    evaluator = Evaluator(eq)
    evaluator.error_eq()

    return {
            "original_equation": original_eq,
            "tex": evaluator.parsed_tex(), 
            "tex_eval": evaluator.parsed_tex(simplified=True), 
            "tex_prefix" : evaluator.eq_prefix_tex,
            "tex_error_prefix": '\\delta '+ evaluator.eq_prefix_tex if  evaluator.eq_prefix_tex != '' else '',
            "diff_parts_tex": [latex(i).replace(DELTA,'\\delta ').replace('ExtraTeXPart','\\') for i in evaluator.differentiated_parts()],
            "error_term_tex": latex(evaluator.error_equation).replace(DELTA,'\\delta ').replace('ExtraTeXPart','\\'),
            "error_term_simplified_tex": latex(evaluator.error_equation_simplified).replace(DELTA,'\\delta ').replace('ExtraTeXPart','\\'),
            "error_equation": evaluator.error_equation_construct,
            "error_str": str(evaluator.error_equation),
            "used_symbols": evaluator.used_symbols
            }

def calculate(body):
    eq=body["original_equation"]
    error_eq=body["original_error"]
    values = body["values"]
    used_symbols=body["used_symbols"]
    new_dict, eq_values = evaluation_dict(values,used_symbols)
    return {'result': tenExp(str(evaluate_eq(eq,new_dict, eq_values))), "error": tenExp(str(evaluate_eq(error_eq, new_dict, eq_values)))}
