export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function createDiacriticRegex(text: string): RegExp {
    let pattern = escapeRegExp(text);
    
    const replacements = [
        { base: /[aáàâãä]/gi, chars: '[aáàâãä]' },
        { base: /[eéèêë]/gi, chars: '[eéèêë]' },
        { base: /[iíìîï]/gi, chars: '[iíìîï]' },
        { base: /[oóòôõö]/gi, chars: '[oóòôõö]' },
        { base: /[uúùûü]/gi, chars: '[uúùûü]' },
        { base: /[cç]/gi, chars: '[cç]' },
    ];
    
    replacements.forEach(({ base, chars }) => {
        pattern = pattern.replace(base, chars);
    });
    
    return new RegExp(pattern, 'i');
}
