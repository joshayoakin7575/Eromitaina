import React, { useState } from 'react';
import { Header } from './components/Header';
import { LedScroller } from './components/LedScroller';
import { HeroBanner } from './components/HeroBanner';
import { VendingForm } from './components/VendingForm';
import { FlutterwaveCheckoutModal } from './components/FlutterwaveCheckoutModal';
import { ReceiptView } from './components/ReceiptView';
import { TokenRetrieval } from './components/TokenRetrieval';
import { SavedMeters } from './components/SavedMeters';
import { TariffCalculator } from './components/TariffCalculator';
import { CustomerDashboard } from './components/CustomerDashboard';
import { NigeriaGridMaps } from './components/NigeriaGridMaps';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Disco, MeterType, VendingTransaction, SavedMeter } from './types/utility';
import { AuthProvider, useAuth } from './context/AuthContext';
import { saveUserMeter, saveUserTransaction } from './services/firebase';

function CaseBoxApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'vend' | 'lookup' | 'saved' | 'tariff' | 'dashboard' | 'maps' | 'admin'>('vend');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string | undefined>();
  
  // Vending & Checkout Modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [pendingVendingData, setPendingVendingData] = useState<{
    disco: Disco;
    meterType: MeterType;
    meterNumber: string;
    amount: number;
    customerName: string;
    customerAddress: string;
    phone: string;
    email: string;
    unitsKwh: number;
    energyAmount: number;
    vatAmount: number;
    fee: number;
  } | null>(null);

  // Active Receipt / Transaction Display
  const [currentReceipt, setCurrentReceipt] = useState<VendingTransaction | null>(null);

  // Prefill meter for quick re-order
  const [prefillMeter, setPrefillMeter] = useState<{
    meterNumber: string;
    discoCode: string;
    meterType: MeterType;
  } | null>(null);

  const handleInitiatePayment = (data: typeof pendingVendingData) => {
    setPendingVendingData(data);
    setCheckoutModalOpen(true);
  };

  const handlePaymentSuccess = async (transaction: VendingTransaction) => {
    setCheckoutModalOpen(false);
    setCurrentReceipt(transaction);

    // If user is authenticated, automatically save the transaction to their private protected Firestore ledger
    if (user) {
      await saveUserTransaction(user.uid, transaction);
    }
  };

  const handleQuickVendFromSaved = (meter: { meterNumber: string; discoCode: string; meterType: MeterType }) => {
    setPrefillMeter(meter);
    setCurrentReceipt(null);
    setActiveTab('vend');
  };

  const handleSaveMeterFromReceipt = async (tx: VendingTransaction) => {
    const newMeter: SavedMeter = {
      id: `sm_${Date.now()}`,
      label: `${tx.discoCode} Meter (${tx.meterNumber.slice(-4)})`,
      meterNumber: tx.meterNumber,
      discoCode: tx.discoCode,
      meterType: tx.meterType,
      customerName: tx.customerName,
      address: tx.customerAddress,
      lastVendedAmount: tx.amount,
      lastVendedDate: new Date().toISOString().slice(0, 10)
    };

    if (user) {
      await saveUserMeter(user.uid, newMeter);
    } else {
      try {
        const stored = localStorage.getItem('casebox_saved_meters');
        const list: SavedMeter[] = stored ? JSON.parse(stored) : [];
        const exists = list.some(m => m.meterNumber === tx.meterNumber);
        if (!exists) {
          localStorage.setItem('casebox_saved_meters', JSON.stringify([newMeter, ...list]));
        }
      } catch (err) {
        console.error('Error saving meter:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1528] flex flex-col text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      {/* 3-Zone Customer Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setCurrentReceipt(null);
        }}
        onQuickReorder={() => {
          setActiveTab('saved');
          setCurrentReceipt(null);
        }}
        onOpenAuth={() => {
          setAuthReason('Sign in with Google or Microsoft to encrypt your meter numbers and protect your personal electricity tokens.');
          setAuthModalOpen(true);
        }}
      />

      {/* Full-Width LED Scroller: ERO MITA INA extending from right to left screen margin */}
      <LedScroller />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* If user is viewing a generated receipt, display it prominently */}
        {currentReceipt ? (
          <ReceiptView
            transaction={currentReceipt}
            onBackToVend={() => setCurrentReceipt(null)}
            onSaveMeter={handleSaveMeterFromReceipt}
          />
        ) : (
          <>
            {/* Customer Tab 1: Vend Electricity Form */}
            {activeTab === 'vend' && (
              <>
                <HeroBanner />
                <VendingForm
                  onInitiatePayment={handleInitiatePayment}
                  prefillMeter={prefillMeter}
                />
              </>
            )}

            {/* Customer Tab 2: Retrieve Token / Transaction History */}
            {activeTab === 'lookup' && (
              <TokenRetrieval
                onSelectTransaction={(tx) => setCurrentReceipt(tx)}
              />
            )}

            {/* Customer Tab 3: Saved Meters */}
            {activeTab === 'saved' && (
              <SavedMeters
                onQuickVend={handleQuickVendFromSaved}
                onOpenAuth={() => {
                  setAuthReason('Sign in to synchronize your saved meters securely to your personal account.');
                  setAuthModalOpen(true);
                }}
              />
            )}

            {/* Customer Tab 4: NERC Tariff & Appliance Calculator */}
            {activeTab === 'tariff' && (
              <TariffCalculator />
            )}

            {/* Customer Tab 5: Customer Dashboard (Preferences, Reminders, Capped Recurring Payment) */}
            {activeTab === 'dashboard' && (
              <CustomerDashboard
                onBuyToken={() => {
                  setActiveTab('vend');
                  setCurrentReceipt(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onViewReceipt={(tx) => {
                  setCurrentReceipt(tx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAuth={() => {
                  setAuthReason('Sign in to access your protected personal dashboard and configure recurring recharge.');
                  setAuthModalOpen(true);
                }}
              />
            )}

            {/* Customer Tab 6: Nigeria Grid Maps (36 States + FCT, Substations & Injection Points) */}
            {activeTab === 'maps' && (
              <NigeriaGridMaps />
            )}

            {/* Isolated Admin Dashboard: Protected Flutterwave Backend */}
            {activeTab === 'admin' && (
              <AdminDashboard
                onBackToCustomerView={() => setActiveTab('vend')}
              />
            )}
          </>
        )}
      </main>

      {/* Customer Checkout Modal (Card, Dynamic Bank Transfer, USSD) */}
      {pendingVendingData && (
        <FlutterwaveCheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
          vendingData={pendingVendingData}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Auth Modal (Google & Microsoft account login) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        reasonText={authReason}
      />

      {/* Clean Footer */}
      <Footer
        onSelectDisco={(discoCode) => {
          setPrefillMeter({
            meterNumber: '',
            discoCode,
            meterType: 'prepaid'
          });
          setActiveTab('vend');
          setCurrentReceipt(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          setActiveTab('admin');
          setCurrentReceipt(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDashboard={() => {
          if (user) {
            setActiveTab('dashboard');
          } else {
            setAuthReason('Sign in to access your personal customer dashboard.');
            setAuthModalOpen(true);
          }
          setCurrentReceipt(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setCurrentReceipt(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CaseBoxApp />
    </AuthProvider>
  );
}
