import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosInstance } from 'axios';

/**
 * 🔐 API Route para gerar QR Code PIX
 * ════════════════════════════════════════════════
 * Integração COMPLETA com API do Banco EFI
 * Gera QR Code dinâmico para pagamento PIX
 */

// Importar biblioteca qrcode
let QRCode: any;
try {
  QRCode = require('qrcode');
} catch (error) {
  console.warn('QR Code library not available, using fallback');
}

// Tipo para a requisição
interface PixRequestBody {
  amount: number;
  description?: string;
  expiresIn?: number; // em segundos
  plan?: string;
}

// Configuração base de URLs da API Banco EFI
const EFI_API_URLS = {
  production: 'https://api.efipay.com.br',
  homolog: 'https://api.sandbox.efipay.com.br',
};

/**
 * Classe para integração com Banco EFI
 */
class BancoEFIPixClient {
  private client: AxiosInstance;
  private clientId: string;
  private clientSecret: string;
  private environment: 'production' | 'homolog';
  private accessToken: string | null = null;
  private lastAuthTime: number = 0;

  constructor(clientId: string, clientSecret: string, environment: 'production' | 'homolog' = 'homolog') {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.environment = environment;

    const baseURL = EFI_API_URLS[environment];

    // Criar instância do axios com configuração básica
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Autentica na API do Banco EFI e gera token de acesso
   */
  async authenticate(): Promise<string> {
    try {
      // Verificar cache do token (validade: 59 minutos)
      if (this.accessToken && Date.now() - this.lastAuthTime < 59 * 60 * 1000) {
        return this.accessToken;
      }

      console.log(`🔐 Autenticando com Banco EFI (${this.environment})...`);

      const response = await this.client.post('/oauth/token', {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: 'cob.write cob.read pix.write pix.read',
      });

      this.accessToken = response.data.access_token;
      this.lastAuthTime = Date.now();

      console.log(`✅ Token obtido com sucesso!`);
      return this.accessToken || '';
    } catch (error: any) {
      console.error('❌ Erro ao autenticar com Banco EFI:', error.response?.data || error.message);
      throw new Error(`Autenticação falhou: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Gera um QR Code PIX dinâmico (COB) via API Banco EFI
   */
  async generateQRCode(amount: number, description: string, expiresIn: number = 3600): Promise<any> {
    try {
      const token = await this.authenticate();

      // Atualizar header com token
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const txId = `${Date.now()}${Math.random().toString(36).substring(2, 9)}`;

      console.log(`📱 Gerando QR Code PIX (Valor: R$ ${amount}, Expiração: ${expiresIn}s)...`);

      const payload = {
        calendario: {
          expiracao: expiresIn,
        },
        devedor: {
          logradouro: 'N/A',
          cidade: process.env.NEXT_PUBLIC_COMPANY_CITY || 'São Paulo',
          uf: process.env.NEXT_PUBLIC_COMPANY_STATE || 'SP',
          cep: '00000000',
          cpf: '00000000000',
          nome: 'Cliente IPTV',
        },
        valor: {
          original: amount.toFixed(2),
        },
        chave: process.env.NEXT_PUBLIC_PIX_KEY || '00000000-0000-0000-0000-000000000000',
        solicitacaoPagador: description,
        infoAdicionais: [
          {
            nome: 'Tipo',
            valor: 'IPTV Subscription',
          },
        ],
      };

      const response = await this.client.post(`/v2/cob/${txId}`, payload);

      console.log(`✅ QR Code gerado com sucesso! TxId: ${txId}`);

      return {
        txId,
        pixKey: response.data.brCode || response.data.qrCode,
        qrCodeUrl: response.data.qrCode,
        copyPaste: response.data.brCode || response.data.qrCode,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
        status: response.data.status,
        amount,
      };
    } catch (error: any) {
      console.error('❌ Erro ao gerar QR Code:', error.response?.data || error.message);
      throw new Error(`Falha ao gerar QR Code: ${error.response?.data?.detalhe || error.message}`);
    }
  }
}

/**
 * Gera QR Code em base64 usando a biblioteca qrcode
 */
async function generateQRCodeImage(pixKey: string): Promise<string> {
  if (!QRCode) {
    // Fallback: retornar um placeholder se a biblioteca não estiver disponível
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="white" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-size="10" fill="black"%3EQR Code%3C/text%3E%3C/svg%3E';
  }

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(pixKey, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H',
      type: 'image/png',
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw new Error('Falha ao gerar QR Code');
  }
}

/**
 * Gera um QR Code de teste para modo desenvolvimento
 */
function generateMockQRCode(amount: number, txId: string): any {
  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || 'chave-pix-teste@seubanco';
  const brCode = `00020126580014br.gov.bcb.brcode0136${pixKey}520400005303986540510.00`;

  return {
    txId,
    pixKey,
    brCode,
    qrCode: brCode,
    copyPaste: brCode,
    status: 'ATIVA',
    amount,
  };
}

/**
 * POST /api/pix
 * 📱 Gera QR Code PIX para pagamento
 */
export async function POST(request: NextRequest) {
  try {
    const body: PixRequestBody = await request.json();
    const { 
      amount, 
      description = 'Assinatura IPTV', 
      expiresIn = 3600,
      plan = 'monthly'
    } = body;

    // Validar dados
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor inválido' },
        { status: 400 }
      );
    }

    const txId = `${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
    
    // Obter configurações de ambiente
    const environment = (process.env.NEXT_PUBLIC_EFI_ENV || 'homolog') as 'production' | 'homolog';
    const isDevelopment = process.env.NODE_ENV === 'development';

    // ⚡ MODO DESENVOLVIMENTO: Use mock QR Code se credenciais não estão configuradas
    const clientId = environment === 'production'
      ? process.env.EFI_PROD_CLIENT_ID
      : process.env.EFI_HOMOLOG_CLIENT_ID;
    
    const clientSecret = environment === 'production'
      ? process.env.EFI_PROD_CLIENT_SECRET
      : process.env.EFI_HOMOLOG_CLIENT_SECRET;

    let pixData: any;

    if (!clientId || !clientSecret) {
      if (isDevelopment) {
        console.warn('⚠️  Modo Desenvolvimento: Usando QR Code simulado (sem API Banco EFI)');
        pixData = generateMockQRCode(amount, txId);
      } else {
        console.error('❌ Credenciais do Banco EFI não configuradas');
        return NextResponse.json(
          { 
            success: false, 
            error: 'Credenciais não configuradas. Verifique variáveis de ambiente.',
          },
          { status: 500 }
        );
      }
    } else {
      try {
        // ✅ INTEGRAÇÃO COM BANCO EFI
        const efiClient = new BancoEFIPixClient(clientId, clientSecret, environment);
        pixData = await efiClient.generateQRCode(amount, description, expiresIn);
      } catch (efiError: any) {
        // Fallback para mock se Banco EFI falhar
        if (isDevelopment) {
          console.warn('⚠️  Erro ao conectar com API Banco EFI, usando QR Code simulado');
          console.error('Erro original:', efiError.message);
          pixData = generateMockQRCode(amount, txId);
        } else {
          throw efiError;
        }
      }
    }

    // Gerar QR Code em imagem
    const qrCodeImage = await generateQRCodeImage(pixData.pixKey || pixData.brCode);

    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrCodeImage,
        pixKey: pixData.pixKey || pixData.brCode,
        copyPaste: pixData.copyPaste || pixData.brCode,
        amount,
        description,
        plan,
        expiresIn,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
        txId: pixData.txId || txId,
        environment,
        mock: !clientId || !clientSecret,
      },
    });
  } catch (error: any) {
    console.error('❌ Erro ao gerar QR Code PIX:', error.message);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao processar pagamento PIX',
        development: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
