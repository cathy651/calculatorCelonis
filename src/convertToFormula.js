
const convertToFormula = (tree) => {
    //border lay
    if(!tree || tree.length === 0) return ;
     switch(tree.type) {
        case 'PAREN': 
            return '(' + convertToFormula(tree.expression) +')';
        case 'FUNCTION':
            return tree.name + '(' + convertToFormula(tree.arguments[0]) + ')';
        case 'ADDITION':
            return convertToFormula(tree.left) + ' + ' +convertToFormula(tree.right);
        case 'SUBTRACTION':
            return convertToFormula(tree.left) + ' - ' +convertToFormula(tree.right);
        case 'MULTIPLICATION':
            return convertToFormula(tree.left) + ' * ' +convertToFormula(tree.right);
        case 'DIVISION':
            return convertToFormula(tree.left) + ' / ' +convertToFormula(tree.right);
        case 'NEGATION':
            return '-' + tree.expression.value;
        case 'POWER':
            return convertToFormula(tree.expression) + '^' + tree.power.value.toString();
        case 'VARIABLE':
            return tree.name;
       	case 'NUMBER':
        		return tree.value;
    }
}


export default convertToFormula;