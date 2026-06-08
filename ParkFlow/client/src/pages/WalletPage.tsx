import { useEffect, useMemo, useState } from 'react';
import { createPaymentOrder, listMyPayments, type PaymentOrder } from '../lib/api';
import Button from '../components/Button';
import Card from '../components/Card';
import { IconWallet } from '../components/Icon';

export default function WalletPage() {
  const [amount, setAmount] = useState(500);
  const [payments, setPayments] = useState<PaymentOrder[]>([]);
  const [message, setMessage] = useState('');

  const balanceHint = useMemo(() => {
    const capturedCredits = payments.filter((payment) => payment.status === 'captured' && payment.referenceType === 'wallet_topup').reduce((total, payment) => total + payment.amount, 0);
    return `Captured top-ups total Rs. ${capturedCredits.toFixed(2)}`;
  }, [payments]);

  async function loadPayments() {
    const response = await listMyPayments();
    if (response.success && response.data) {
      setPayments(response.data.payments);
    }
  }

  useEffect(() => {
    void loadPayments();
  }, []);

  async function handleTopUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await createPaymentOrder({
      referenceType: 'wallet_topup',
      amount,
      currency: 'INR',
    });

    setMessage(response.message);

    if (response.success) {
      await loadPayments();
    }
  }

  return (
    <section>
      <h2 className="text-lg font-bold">Wallet</h2>
      <p className="text-sm text-gray-600">Wallet balance, payment orders, and webhook processing live here.</p>
      <p className="text-sm text-gray-500">{balanceHint}</p>

      <form onSubmit={handleTopUp} className="grid gap-3 max-w-md mt-4">
        <label>
          Top-up amount
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
          />
        </label>
        <div className="flex gap-3">
          <Button type="submit"> <IconWallet size={16} variant="solid"/> Create payment order</Button>
          <Button type="button" variant="ghost" onClick={() => { setAmount(500); setMessage(''); }}>Reset</Button>
        </div>
      </form>

      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}

      <div className="mt-6">
        <h3 className="text-md font-semibold">Recent payment orders</h3>
        <ul className="list-clean mt-3 space-y-3">
          {payments.map((payment) => (
            <li key={payment.id} className="list-item">
              <Card>
                <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <IconWallet variant="solid" />
                    <div>
                      <div className="font-semibold">{payment.referenceType.replace('_', ' ')}</div>
                      <div className="text-sm text-gray-500">{payment.provider} • {payment.providerOrderId}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">Rs. {payment.amount.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{payment.status}</div>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Webhook scaffold</h3>
        <p className="muted">POST captured or failed events to <code>/api/payments/webhook</code> with the <code>x-parkflow-signature</code> header.</p>
      </div>
    </section>
  );
}
