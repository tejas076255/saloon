import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { POSBillingView } from '../components/billing/POSBillingView';
import { DashboardHomeView } from '../components/billing/DashboardHomeView';
import { InvoicesHistoryView } from '../components/billing/InvoicesHistoryView';
import { CustomersView } from '../components/customers/CustomersView';
import { CatalogView } from '../components/services/CatalogView';
import { ReportsView } from '../components/reports/ReportsView';
import { SubscriptionModal } from '../components/subscriptions/SubscriptionModal';
import { SettingsView } from '../components/settings/SettingsView';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('billing');

  return (
    <DashboardLayout currentTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'billing' && <POSBillingView onViewInvoiceHistory={() => setActiveTab('invoices')} />}
      {activeTab === 'dashboard' && <DashboardHomeView onNavigateTab={setActiveTab} />}
      {activeTab === 'invoices' && <InvoicesHistoryView />}
      {activeTab === 'customers' && <CustomersView />}
      {activeTab === 'catalog' && <CatalogView />}
      {activeTab === 'reports' && <ReportsView />}
      {activeTab === 'subscriptions' && <SubscriptionModal />}
      {activeTab === 'settings' && <SettingsView />}
    </DashboardLayout>
  );
};
