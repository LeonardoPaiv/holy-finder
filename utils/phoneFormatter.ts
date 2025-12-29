/**
 * Formata um número de telefone brasileiro para exibição
 * @param phone - Número de telefone (apenas dígitos)
 * @returns Telefone formatado no padrão +55 (XX) XXXXX-XXXX ou +55 (XX) XXXX-XXXX
 */
export const formatPhoneDisplay = (phone: string | undefined): string => {
  if (!phone) return '';
  
  // Remove tudo que não é número
  const numbers = phone.replace(/\D/g, '');
  
  // Se não tiver números suficientes, retorna vazio
  if (numbers.length < 10) return phone;
  
  // Extrai DDD e número
  const ddd = numbers.substring(0, 2);
  const phoneNumber = numbers.substring(2);
  
  // Formata baseado no tamanho (9 dígitos com 9 na frente, 8 dígitos sem)
  if (phoneNumber.length === 9) {
    // Celular: +55 (XX) XXXXX-XXXX
    return `+55 (${ddd}) ${phoneNumber.substring(0, 5)}-${phoneNumber.substring(5)}`;
  } else if (phoneNumber.length === 8) {
    // Fixo: +55 (XX) XXXX-XXXX
    return `+55 (${ddd}) ${phoneNumber.substring(0, 4)}-${phoneNumber.substring(4)}`;
  }
  
  return phone;
};

/**
 * Formata o input do telefone enquanto o usuário digita
 * @param value - Valor atual do input
 * @returns Valor formatado para exibição no input
 */
export const formatPhoneInput = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos (2 DDD + 9 telefone)
  const limited = numbers.substring(0, 11);
  
  if (limited.length === 0) return '';
  
  // Formata progressivamente conforme o usuário digita
  if (limited.length <= 2) {
    return `(${limited}`;
  } else if (limited.length <= 6) {
    return `(${limited.substring(0, 2)}) ${limited.substring(2)}`;
  } else if (limited.length <= 10) {
    return `(${limited.substring(0, 2)}) ${limited.substring(2, 6)}-${limited.substring(6)}`;
  } else {
    // 11 dígitos (celular)
    return `(${limited.substring(0, 2)}) ${limited.substring(2, 7)}-${limited.substring(7)}`;
  }
};

/**
 * Remove a formatação do telefone, mantendo apenas os números
 * @param phone - Telefone formatado
 * @returns Apenas os números do telefone
 */
export const unformatPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Valida se o telefone tem o formato correto (10 ou 11 dígitos)
 * @param phone - Telefone (apenas números)
 * @returns true se válido, false caso contrário
 */
export const isValidBrazilianPhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length === 10 || numbers.length === 11;
};
