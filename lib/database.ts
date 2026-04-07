/**
 * 🗄️ Database - Inicialização e Schema
 * ════════════════════════════════════════════════════
 * Gerencia SQLite para armazenar transações PIX
 */

import Database from 'better-sqlite3';
import * as path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'transactions.db');

/**
 * Inicializa ou conecta ao banco de dados
 */
let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeSchema();
  }
  return db;
}

/**
 * Cria schema das tabelas
 */
function initializeSchema() {
  const db = getDatabase();

  // Tabela de Transações PIX
  db.exec(`
    CREATE TABLE IF NOT EXISTS pix_transactions (
      id TEXT PRIMARY KEY,
      txId TEXT UNIQUE NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      plan TEXT NOT NULL,
      description TEXT,
      pixKey TEXT NOT NULL,
      brCode TEXT,
      
      -- Dados do pagador (preenchido no webhook)
      payer_cpf TEXT,
      payer_name TEXT,
      payer_email TEXT,
      payer_phone TEXT,
      
      -- Datas
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      confirmed_at DATETIME,
      
      -- Dados do webhook
      webhook_data TEXT,
      
      -- Status de controle
      retry_count INTEGER DEFAULT 0,
      last_error TEXT,
      
      -- Índices
      CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'failed', 'expired'))
    );

    -- Índices para buscar transações rapidamente
    CREATE INDEX IF NOT EXISTS idx_status ON pix_transactions(status);
    CREATE INDEX IF NOT EXISTS idx_created_at ON pix_transactions(created_at);
    CREATE INDEX IF NOT EXISTS idx_txId ON pix_transactions(txId);
    CREATE INDEX IF NOT EXISTS idx_expires_at ON pix_transactions(expires_at);

    -- Tabela de Histórico de Webhooks
    CREATE TABLE IF NOT EXISTS webhook_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tx_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'processed',
      error TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (tx_id) REFERENCES pix_transactions(txId)
    );

    -- Índices para webhooks
    CREATE INDEX IF NOT EXISTS idx_webhook_tx_id ON webhook_events(tx_id);
    CREATE INDEX IF NOT EXISTS idx_webhook_event_type ON webhook_events(event_type);
    CREATE INDEX IF NOT EXISTS idx_webhook_created_at ON webhook_events(created_at);

    -- Tabela de Usuários/Clientes
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      cpf TEXT,
      name TEXT NOT NULL,
      active BOOLEAN DEFAULT 1,
      subscription_status TEXT DEFAULT 'inactive',
      subscription_expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_customer_email ON customers(email);
    CREATE INDEX IF NOT EXISTS idx_customer_cpf ON customers(cpf);
  `);

  console.log('✅ Schema do banco de dados inicializado');
}

/**
 * Tipos TypeScript para transações
 */
export interface PixTransaction {
  id: string;
  txId: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed' | 'expired';
  plan: string;
  description?: string;
  pixKey: string;
  brCode?: string;
  payer_cpf?: string;
  payer_name?: string;
  payer_email?: string;
  payer_phone?: string;
  created_at: string;
  expires_at?: string;
  confirmed_at?: string;
  webhook_data?: string;
  retry_count: number;
  last_error?: string;
}

export interface WebhookEvent {
  id: number;
  tx_id: string;
  event_type: string;
  payload: string;
  status: string;
  error?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  email: string;
  phone?: string;
  cpf?: string;
  name: string;
  active: boolean;
  subscription_status: string;
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Funções CRUD para Transações
 */

export function createTransaction(txData: Partial<PixTransaction>): PixTransaction {
  const db = getDatabase();
  const id = txData.id || `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  const stmt = db.prepare(`
    INSERT INTO pix_transactions (
      id, txId, amount, status, plan, description, pixKey, brCode, expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    txData.txId,
    txData.amount,
    'pending',
    txData.plan,
    txData.description,
    txData.pixKey,
    txData.brCode,
    txData.expires_at
  );

  return getTransaction(txData.txId!)!;
}

export function getTransaction(txId: string): PixTransaction | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM pix_transactions WHERE txId = ?');
  const row = stmt.get(txId) as any;

  if (!row) return null;

  return {
    ...row,
    webhook_data: row.webhook_data ? JSON.parse(row.webhook_data) : null,
  };
}

export function getTransactionById(id: string): PixTransaction | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM pix_transactions WHERE id = ?');
  const row = stmt.get(id) as any;

  if (!row) return null;

  return {
    ...row,
    webhook_data: row.webhook_data ? JSON.parse(row.webhook_data) : null,
  };
}

export function confirmTransaction(
  txId: string,
  payerData: { cpf?: string; name?: string; email?: string; phone?: string },
  webhookData: any
): PixTransaction | null {
  const db = getDatabase();

  const stmt = db.prepare(`
    UPDATE pix_transactions 
    SET 
      status = 'confirmed',
      confirmed_at = CURRENT_TIMESTAMP,
      payer_cpf = ?,
      payer_name = ?,
      payer_email = ?,
      payer_phone = ?,
      webhook_data = ?
    WHERE txId = ?
  `);

  stmt.run(
    payerData.cpf,
    payerData.name,
    payerData.email,
    payerData.phone,
    JSON.stringify(webhookData),
    txId
  );

  return getTransaction(txId);
}

export function updateTransactionStatus(
  txId: string,
  status: 'pending' | 'confirmed' | 'failed' | 'expired',
  errorMessage?: string
): void {
  const db = getDatabase();

  const stmt = db.prepare(`
    UPDATE pix_transactions 
    SET status = ?, last_error = ?, retry_count = retry_count + 1
    WHERE txId = ?
  `);

  stmt.run(status, errorMessage, txId);
}

export function getAllPendingTransactions(): PixTransaction[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM pix_transactions WHERE status = ? ORDER BY created_at DESC');
  const rows = stmt.all('pending') as any[];

  return rows.map((row) => ({
    ...row,
    webhook_data: row.webhook_data ? JSON.parse(row.webhook_data) : null,
  }));
}

export function getExpiredTransactions(): PixTransaction[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM pix_transactions 
    WHERE status = 'pending' AND expires_at < CURRENT_TIMESTAMP
    ORDER BY expires_at DESC
  `);
  const rows = stmt.all() as any[];

  return rows.map((row) => ({
    ...row,
    webhook_data: row.webhook_data ? JSON.parse(row.webhook_data) : null,
  }));
}

/**
 * Funções para Webhook Events
 */

export function recordWebhookEvent(
  txId: string,
  eventType: string,
  payload: any
): WebhookEvent {
  const db = getDatabase();

  const stmt = db.prepare(`
    INSERT INTO webhook_events (tx_id, event_type, payload, status)
    VALUES (?, ?, ?, 'processed')
  `);

  const result = stmt.run(txId, eventType, JSON.stringify(payload));

  return {
    id: result.lastInsertRowid as number,
    tx_id: txId,
    event_type: eventType,
    payload: JSON.stringify(payload),
    status: 'processed',
    created_at: new Date().toISOString(),
  };
}

/**
 * Funções para Customers
 */

export function createOrUpdateCustomer(customerData: Partial<Customer>): Customer {
  const db = getDatabase();
  const id = customerData.id || `cust_${Date.now()}`;

  const existing = db.prepare('SELECT id FROM customers WHERE email = ?').get(customerData.email);

  if (existing) {
    const stmt = db.prepare(`
      UPDATE customers 
      SET phone = ?, cpf = ?, name = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `);

    stmt.run(customerData.phone, customerData.cpf, customerData.name, 1, customerData.email);
    return getCustomerByEmail(customerData.email!)!;
  } else {
    const stmt = db.prepare(`
      INSERT INTO customers (id, email, phone, cpf, name, active)
      VALUES (?, ?, ?, ?, ?, 1)
    `);

    stmt.run(id, customerData.email, customerData.phone, customerData.cpf, customerData.name);
    return getCustomerByEmail(customerData.email!)!;
  }
}

export function getCustomerByEmail(email: string): Customer | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM customers WHERE email = ?');
  return stmt.get(email) as Customer | null;
}

export function updateSubscription(
  customerId: string,
  status: string,
  expiresAt?: string
): void {
  const db = getDatabase();

  const stmt = db.prepare(`
    UPDATE customers 
    SET subscription_status = ?, subscription_expires_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(status, expiresAt, customerId);
}

/**
 * Fecha conexão com banco
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
  }
}
