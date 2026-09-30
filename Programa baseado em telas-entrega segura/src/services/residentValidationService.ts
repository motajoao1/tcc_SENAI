import type { ValidResidentUnit } from '../domain/types';

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');

export const residentValidationService = {
  validate(
    units: ValidResidentUnit[],
    condominiumId: string,
    block: string,
    apartment: string
  ): 'approved' | 'rejected' {
    return units.some(
      (unit) =>
        unit.condominiumId === condominiumId &&
        normalize(unit.block) === normalize(block) &&
        normalize(unit.apartment) === normalize(apartment)
    )
      ? 'approved'
      : 'rejected';
  },
};
