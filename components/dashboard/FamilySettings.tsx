export default function FamilySettings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Account Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure notification triggers, escrow email alerts, and payment card details.</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-100/40 space-y-4">
        <h3 className="font-extrabold text-sm text-gray-950">Notification Preferences</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary size-4" />
            <span>Send me SMS alerts when a caregiver companion accepts a shift.</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary size-4" />
            <span>Send me Stripe escrow statement invoices.</span>
          </label>
        </div>
      </div>
    </div>
  );
}
