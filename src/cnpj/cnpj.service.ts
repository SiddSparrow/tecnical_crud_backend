import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

export interface CnpjData {
  razaoSocial: string;
  email?: string;
  cnpj: string;
}

@Injectable()
export class CnpjService {
  private readonly baseUrl = 'https://publica.cnpj.ws/cnpj';

  async lookup(cnpj: string): Promise<CnpjData> {
    try {
      // Remove formatting from CNPJ
      const cleanedCnpj = cnpj.replace(/\D/g, '');

      if (cleanedCnpj.length !== 14) {
        throw new BadRequestException('CNPJ deve ter 14 dígitos');
      }

      const response = await axios.get(`${this.baseUrl}/${cleanedCnpj}`);

      if (!response.data) {
        throw new BadRequestException('CNPJ não encontrado');
      }

      // Format CNPJ: 00.000.000/0000-00
      const formattedCnpj = cleanedCnpj.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5',
      );

      return {
        razaoSocial: response.data.razao_social || response.data.nome || '',
        email: response.data.estabelecimento?.email || '',
        cnpj: formattedCnpj,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new BadRequestException('CNPJ não encontrado');
        }
        throw new BadRequestException(
          'Erro ao consultar CNPJ: ' + (error.message || 'Serviço indisponível'),
        );
      }
      throw error;
    }
  }
}
