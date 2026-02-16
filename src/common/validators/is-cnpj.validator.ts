import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCnpjConstraint implements ValidatorConstraintInterface {
  validate(cnpj: string): boolean {
    if (!cnpj) return false;

    // Check format
    if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj)) {
      return false;
    }

    // Remove formatting
    const digits = cnpj.replace(/\D/g, '');

    if (digits.length !== 14) return false;

    // Reject all-same-digit CNPJs
    if (/^(\d)\1{13}$/.test(digits)) return false;

    // Validate first check digit
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(digits[i]) * weights1[i];
    }
    let remainder = sum % 11;
    const checkDigit1 = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(digits[12]) !== checkDigit1) return false;

    // Validate second check digit
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(digits[i]) * weights2[i];
    }
    remainder = sum % 11;
    const checkDigit2 = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(digits[13]) !== checkDigit2) return false;

    return true;
  }

  defaultMessage(): string {
    return 'CNPJ inválido. Use o formato 00.000.000/0000-00 com dígitos verificadores válidos';
  }
}

export function IsCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCnpjConstraint,
    });
  };
}
