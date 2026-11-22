import { useEffect } from "react";
import { useMe } from "@/app/hook/useMe";
import { useDashboardStore } from "@/app/hook/useDashboardStore";

export default function FamilyProfile() {
  const { data: me } = useMe();
  const {
    familyAddress,
    setFamilyAddress,
    familyCity,
    setFamilyCity,
    familyCountry,
    setFamilyCountry,
    familyPostalCode,
    setFamilyPostalCode,
    familyLangsInput,
    setFamilyLangsInput,
    handleProfileSave,
  } = useDashboardStore();

  useEffect(() => {
    if (me) {
      if (!familyAddress && me.address) setFamilyAddress(me.address);
      if (!familyCity && me.city) setFamilyCity(me.city);
      if (!familyCountry && me.country) setFamilyCountry(me.country);
      if (!familyPostalCode && me.postalCode) setFamilyPostalCode(me.postalCode);
      if (!familyLangsInput && me.languages) {
        setFamilyLangsInput(Array.isArray(me.languages) ? me.languages.join(", ") : me.languages);
      }
    }
  }, [me]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Family Profile Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Manage address details, languages spoken, and general home care parameters.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-100/40">
        <form onSubmit={handleProfileSave} className="space-y-6 max-w-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Street Address</label>
              <input
                type="text"
                value={familyAddress}
                onChange={(e) => setFamilyAddress(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
              <input
                type="text"
                value={familyCity}
                onChange={(e) => setFamilyCity(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Country</label>
              <input
                type="text"
                value={familyCountry}
                onChange={(e) => setFamilyCountry(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Postal Code</label>
              <input
                type="text"
                value={familyPostalCode}
                onChange={(e) => setFamilyPostalCode(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Languages (Comma separated)</label>
            <input
              type="text"
              value={familyLangsInput}
              onChange={(e) => setFamilyLangsInput(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-9 px-5 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-md cursor-pointer"
          >
            Save Profile Settings
          </button>
        </form>
      </div>
    </div>
  );
}
