// src/components/sidebar/RouteMetaForm.tsx

/**
 * CONTEXT: COMMUTEWISE ROUTE META FORM
 * ====================================
 * THIS COMPONENT RENDERS:
 * - ROUTE NAME
 * - TRANSPORT MODE
 * - FARE (PHP) + FREE RIDE TOGGLE
 * - STRICT STOPS TOGGLE
 *
 * IT IS PURELY PRESENTATIONAL AND DELEGATES STATE UP VIA setField.
 */

interface RouteMetaFormProps {
  routeName: string;
  transportMode: string;
  fare: number;
  isFree: boolean;
  isStrict: boolean;
  // CAPS LOCK COMMENT: GENERIC SETFIELD SIGNATURE SO WE DO NOT TIGHTLY COUPLE TO ZUSTAND TYPE
  setField: (field: string, value: string | number | boolean) => void;
}

export default function RouteMetaForm({
  routeName,
  transportMode,
  fare,
  isFree,
  isStrict,
  setField,
}: RouteMetaFormProps) {
  return (
    <div className="space-y-3">
      {/* ROUTE NAME */}
      <div>
        <label
          htmlFor="route-name"
          className="text-xs font-bold text-slate-500 uppercase"
        >
          Route Name
        </label>
        <input
          id="route-name"
          type="text"
          value={routeName}
          onChange={(e) => setField("routeName", e.target.value)}
          placeholder="e.g. SM North - Fairview"
          className="w-full mt-1 p-2 border rounded-lg text-sm font-semibold"
        />
      </div>

      {/* MODE + FARE */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="transport-mode"
            className="text-xs font-bold text-slate-500 uppercase"
          >
            Mode
          </label>
          <select
            id="transport-mode"
            value={transportMode}
            onChange={(e) => setField("transportMode", e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
          >
            <option>Jeepney</option>
            <option>Bus</option>
            <option>E-Jeepney</option>
            <option>Tricycle</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="fare-input"
            className="text-xs font-bold text-slate-500 uppercase"
          >
            Fare (PHP)
          </label>
          <input
            id="fare-input"
            type="number"
            min={0}
            value={fare}
            disabled={isFree}
            onChange={(e) => {
              const raw = Number(e.target.value);
              const safe = Number.isFinite(raw) ? Math.max(0, raw) : 0;
              setField("fare", safe);
            }}
            className="w-full mt-1 p-2 border rounded-lg text-sm disabled:opacity-50"
          />
        </div>
      </div>

      {/* FLAGS */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => {
              const checked = e.target.checked;
              setField("isFree", checked);
              if (checked) setField("fare", 0);
            }}
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          Free Ride
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={isStrict}
            onChange={(e) => setField("isStrict", e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          Strict Stops
        </label>
      </div>
    </div>
  );
}
