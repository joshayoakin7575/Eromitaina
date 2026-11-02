export type MeterType = 'prepaid' | 'postpaid';

export interface Disco {
  id: string;
  name: string;
  code: string;
  shortName: string;
  stateCoverage: string[];
  billItemCodePrepaid: string;
  billItemCodePostpaid: string;
  billerCode?: string;
  tariffPerKwh: number; // Band A default rate in NGN
  tariffBandB: number;
  tariffBandC: number;
  minAmount: number;
  maxAmount: number;
  customerCare: string;
  website: string;
}

export interface MeterValidationResult {
  isValid: boolean;
  meterNumber: string;
  customerName: string;
  address: string;
  discoCode: string;
  discoName: string;
  meterType: MeterType;
  arrears: number;
  tariffBand: string; // e.g. "Band A (20hrs+)"
  tariffRate: number; // e.g. 209.50
  accountNumber?: string;
  message?: string;
}

export type PaymentMethodType = 'card' | 'bank_transfer' | 'ussd' | 'flutterwave_inline';

export interface VendingTransaction {
  id: string;
  reference: string;
  flwRef: string;
  discoCode: string;
  discoName: string;
  meterNumber: string;
  meterType: MeterType;
  customerName: string;
  customerAddress: string;
  phone: string;
  email: string;
  amount: number;
  energyAmount: number;
  vatAmount: number; // 7.5%
  fee: number;
  unitsKwh: number;
  token?: string; // 20 digits for prepaid
  resetToken?: string;
  receiptNumber: string;
  status: 'successful' | 'pending' | 'failed';
  paymentMethod: PaymentMethodType;
  timestamp: string;
  debtDeduction: number;
}

export interface SavedMeter {
  id: string;
  label: string; // e.g., "Home Main Meter", "Office Ikeja"
  meterNumber: string;
  discoCode: string;
  meterType: MeterType;
  customerName: string;
  address: string;
  lastVendedAmount?: number;
  lastVendedDate?: string;
}

export interface TariffBandInfo {
  band: string;
  label: string;
  hours: string;
  averageRate: number; // NGN per kWh
  description: string;
}

export interface FlutterwaveConfig {
  isConfigured: boolean;
  isSandbox: boolean;
  publicKeyMasked: string;
  apiBaseUrl: string;
  vendingEngine: 'flutterwave_direct' | 'flutterwave_sandbox_simulator';
  interserverIp?: string;
  currentOutboundIp?: string;
  combinedWhitelist?: string;
}

export type RecurringAmount = 2500 | 5000 | 7500 | 10000 | 12500 | 15000;

export interface CustomerPreferences {
  userId: string;
  reminderEnabled: boolean;
  reminderDayOfMonth: number; // 1 to 28
  reminderEmail: string;
  recurringEnabled: boolean;
  recurringAmount: RecurringAmount; // capped at 15,000 NGN
  recurringInterval: 'weekly' | 'monthly';
  targetMeterNumber?: string;
  targetDiscoCode?: string;
  flwPlanId?: string | number;
  flwPlanStatus?: 'active' | 'cancelled' | 'pending';
  mandateAuthorized?: boolean;
  lastReminderSent?: string;
  updatedAt: string;
}

