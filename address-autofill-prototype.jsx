import { useState, useEffect } from "react";

const MOCK_RESULTS = [
  { line1: "135 N Pennsylvania St", city: "Indianapolis", state: "IN", zip: "46204" },
  { line1: "135 N Pennsylvania Ave", city: "Lansing", state: "MI", zip: "48912" },
  { line1: "135 N Penn St", city: "York", state: "PA", zip: "17401" },
];

const EXISTING_ADDRESS = {
  line1: "42 Wallaby Way",
  line2: "Apt 4B",
  city: "Indpls",
  state: "IN",
  zip: "46201",
  badAddress: true,
};

// ─── Styles ───
const colors = {
  teal: "#4a9b8e",
  tealLight: "#f0f9f5",
  tealDark: "#2d7a6a",
  gray: "#d0d0d0",
  grayDark: "#333",
  grayMed: "#888",
  grayLight: "#bbb",
  grayBg: "#f7f7f7",
  sidebar: "#3d4548",
  greenLabel: "#4a9b8e",
  error: "#ea1d35",
  warn: "#fffbe6",
  warnBorder: "#eed86a",
  warnText: "#665a00",
};

const s = {
  wrapper: { fontFamily: "Arial, sans-serif", maxWidth: 780, margin: "0 auto", padding: "0" },
  tabBar: { display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${colors.gray}` },
  tab: (active) => ({
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? colors.teal : colors.grayMed,
    background: active ? colors.tealLight : "transparent",
    border: "none",
    borderBottom: active ? `2px solid ${colors.teal}` : "2px solid transparent",
    cursor: "pointer",
    marginBottom: -2,
    transition: "all 0.15s",
  }),
  flowBar: { display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" },
  flowBtn: (active) => ({
    padding: "6px 14px",
    fontSize: 11,
    fontWeight: 500,
    color: active ? "white" : colors.grayDark,
    background: active ? colors.teal : "white",
    border: `1px solid ${active ? colors.teal : colors.gray}`,
    borderRadius: 4,
    cursor: "pointer",
    transition: "all 0.15s",
  }),
  stepBar: { display: "flex", gap: 6, marginBottom: 16 },
  stepBtn: (active, available) => ({
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: `1.5px solid ${active ? colors.teal : available ? colors.gray : "#eee"}`,
    background: active ? colors.teal : "white",
    color: active ? "white" : available ? colors.grayDark : colors.grayLight,
    fontSize: 12,
    fontWeight: 600,
    cursor: available ? "pointer" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
    opacity: available ? 1 : 0.4,
  }),
  stepLabel: { fontSize: 12, color: colors.grayMed, marginBottom: 12, lineHeight: 1.5 },
  crmFrame: { background: colors.grayBg, borderRadius: 8, overflow: "hidden", border: `1px solid #e0e0e0` },
  crmLayout: { display: "flex" },
  sidebar: { width: 40, background: colors.sidebar, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 14, flexShrink: 0, minHeight: 400 },
  sideIcon: (active) => ({ width: 18, height: 18, opacity: active ? 1 : 0.3 }),
  body: { flex: 1, background: "white", display: "flex" },
  main: { flex: 1, padding: "14px 20px 20px" },
  rightPanel: { width: 190, borderLeft: "1px solid #e5e5e5", padding: "14px 16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { fontSize: 17, fontWeight: 400, color: colors.grayDark, fontStyle: "italic" },
  btnCancel: { fontSize: 12, padding: "5px 14px", borderRadius: 3, border: "1px solid #ccc", background: "white", color: "#555", cursor: "pointer", marginRight: 6 },
  btnSave: { fontSize: 12, padding: "5px 14px", borderRadius: 3, border: "none", background: colors.teal, color: "white", cursor: "pointer" },
  field: { marginBottom: 10 },
  label: { fontSize: 11, color: colors.grayMed, marginBottom: 3, display: "block" },
  labelGreen: { fontSize: 11, color: colors.greenLabel, marginBottom: 3, display: "block" },
  input: (variant) => ({
    width: "100%",
    height: 32,
    border: `1px solid ${variant === "autofill" ? colors.teal : variant === "focus" ? colors.teal : variant === "error" ? colors.error : colors.gray}`,
    padding: "0 10px",
    fontSize: 13,
    color: variant === "autofill" ? colors.tealDark : variant === "placeholder" ? colors.grayLight : variant === "dim" ? colors.grayLight : colors.grayDark,
    background: variant === "autofill" ? colors.tealLight : variant === "dim" ? "#fafafa" : "white",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
    opacity: variant === "dim" ? 0.45 : 1,
    boxShadow: variant === "focus" ? `0 0 0 2px rgba(74,155,142,0.15)` : "none",
  }),
  select: (variant) => ({
    width: "100%",
    height: 32,
    border: `1px solid ${variant === "autofill" ? colors.teal : colors.gray}`,
    padding: "0 28px 0 10px",
    fontSize: 13,
    color: variant === "autofill" ? colors.tealDark : variant === "placeholder" ? colors.grayLight : colors.grayDark,
    background: `${variant === "autofill" ? colors.tealLight : "white"} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 10px center`,
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
    opacity: variant === "dim" ? 0.45 : 1,
  }),
  row: { display: "flex", gap: 12 },
  searchWrap: { marginBottom: 10, paddingBottom: 10, borderBottom: "1px dashed #ddd" },
  searchLabel: { fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", color: "#999", marginBottom: 3 },
  searchInput: (active) => ({
    width: "100%",
    height: 34,
    border: `1px solid ${active ? colors.teal : colors.gray}`,
    borderRadius: 3,
    padding: "0 10px 0 32px",
    fontSize: 13,
    color: active ? colors.grayDark : colors.grayLight,
    background: "white",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    position: "relative",
    display: "flex",
    alignItems: "center",
    transition: "all 0.15s",
  }),
  dropdown: { background: "white", border: `1px solid ${colors.gray}`, borderTop: "none", boxShadow: "0 3px 10px rgba(0,0,0,0.08)", overflow: "hidden" },
  dropdownItem: (first) => ({
    padding: "8px 10px",
    fontSize: 12,
    color: colors.grayDark,
    borderBottom: "1px solid #f2f2f2",
    cursor: "pointer",
    background: first ? colors.tealLight : "white",
    transition: "background 0.1s",
  }),
  noResults: { background: "#fafafa", border: `1px solid #e0e0e0`, borderTop: "none", padding: "10px 12px", fontSize: 12, color: colors.grayMed, lineHeight: 1.5 },
  confirm: { background: colors.warn, border: `1px solid ${colors.warnBorder}`, borderRadius: 3, padding: "10px 12px", marginTop: 6, fontSize: 12, color: colors.warnText, lineHeight: 1.5 },
  confirmNote: { fontSize: 11, color: "#998a00", marginTop: 3, fontStyle: "italic" },
  confirmBtns: { display: "flex", gap: 6, marginTop: 8 },
  dot: { display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: colors.teal, marginLeft: 5, verticalAlign: "middle" },
  checkRow: { display: "flex", gap: 24, marginTop: 4 },
  checkItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#999" },
  checkBox: (checked) => ({
    width: 16,
    height: 16,
    border: "1px solid #ccc",
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    color: colors.teal,
    background: checked ? colors.tealLight : "white",
  }),
  optionDesc: { fontSize: 12, color: "#666", lineHeight: 1.6, marginBottom: 14, padding: "10px 14px", background: "#fafafa", borderRadius: 6, border: "1px solid #eee" },
};

// ─── Components ───
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", left: 10, top: 10, color: "#999" }}>
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function Dot() {
  return <span style={s.dot} />;
}

function SidebarNav() {
  return (
    <div style={s.sidebar}>
      {["M3 8l7-5 7 5v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z", null].map((_, i) => (
        <div key={i} style={s.sideIcon(i === 1)}>
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
            {i === 0 && <path d="M3 8l7-5 7 5v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" stroke="white" strokeWidth="1.3" />}
            {i === 1 && (
              <>
                <circle cx="8" cy="7" r="3" stroke="white" strokeWidth="1.3" />
                <circle cx="13" cy="7" r="3" stroke="white" strokeWidth="1.3" />
                <path d="M2 17c0-3 3-5 6-5s6 2 6 5" stroke="white" strokeWidth="1.3" />
              </>
            )}
          </svg>
        </div>
      ))}
    </div>
  );
}

function CRMHeader() {
  return (
    <div style={s.header}>
      <div style={s.title}>Edit Address</div>
      <div>
        <button style={s.btnCancel}>Cancel</button>
        <button style={s.btnSave}>Save</button>
      </div>
    </div>
  );
}

function Field({ label, value, variant = "default", green, hint, style: extraStyle }) {
  return (
    <div style={{ ...s.field, ...extraStyle }}>
      <label style={green ? s.labelGreen : s.label}>
        {label} {hint && <span style={{ color: colors.grayLight, fontWeight: 400 }}>{hint}</span>}
      </label>
      <div style={s.input(variant)}>
        {value}
        {variant === "autofill" && <Dot />}
      </div>
    </div>
  );
}

function SelectField({ label, value, variant = "default", green, style: extraStyle }) {
  return (
    <div style={{ ...s.field, ...extraStyle }}>
      <label style={green ? s.labelGreen : s.label}>{label}</label>
      <div style={s.select(variant)}>
        {value}
        {variant === "autofill" && <Dot />}
      </div>
    </div>
  );
}

function Checks({ primaryChecked = true, badChecked = false }) {
  return (
    <div style={s.checkRow}>
      <div style={s.checkItem}>
        <div style={s.checkBox(primaryChecked)}>{primaryChecked ? "✓" : ""}</div> Primary?
      </div>
      <div style={s.checkItem}>
        <div style={s.checkBox(badChecked)}>{badChecked ? "✓" : ""}</div> Bad Address?
      </div>
    </div>
  );
}

function SearchField({ active, value, idle, sublabel }) {
  return (
    <div style={s.searchWrap}>
      <div style={s.searchLabel}>
        Search for an address{" "}
        {sublabel && <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: colors.grayLight }}>{sublabel}</span>}
      </div>
      <div style={{ position: "relative" }}>
        <div style={s.searchInput(active)}>
          <SearchIcon />
          <span style={{ marginLeft: 22 }}>{idle ? "Start typing an address..." : value}</span>
        </div>
      </div>
    </div>
  );
}

function DropdownResults({ results, onSelect }) {
  return (
    <div style={s.dropdown}>
      {results.map((r, i) => (
        <div key={i} style={s.dropdownItem(i === 0)} onClick={() => onSelect(r)}>
          <strong>{r.line1}</strong>, {r.city}, {r.state} {r.zip}
        </div>
      ))}
    </div>
  );
}

function ConfirmBar({ address, hasLine2, hasBadFlag, onReplace, onCancel }) {
  return (
    <div style={s.confirm}>
      Replace current address with <strong style={{ color: colors.grayDark }}>{address.line1}, {address.city}, {address.state} {address.zip}</strong>?
      <div style={s.confirmNote}>
        {hasLine2 && "Apt/suite info will need to be re-entered. "}
        {hasBadFlag && '"Bad Address" flag will be cleared.'}
      </div>
      <div style={s.confirmBtns}>
        <button onClick={onReplace} style={{ ...s.btnSave, fontSize: 12, padding: "5px 14px" }}>Replace</button>
        <button onClick={onCancel} style={{ ...s.btnCancel, fontSize: 12, padding: "5px 14px", marginRight: 0 }}>Cancel</button>
      </div>
    </div>
  );
}

function NoResultsMessage() {
  return (
    <div style={s.noResults}>
      <strong style={{ color: "#555" }}>No matching addresses found.</strong>
      <br />
      Enter the address manually in the fields below.
    </div>
  );
}

// ─── Option A: Full form with search ───
function OptionAForm({ flow, step }) {
  const isEdit = flow === "edit";
  const isNoResults = flow === "noResults";
  const showExisting = isEdit;

  // Step logic
  if (flow === "new") {
    if (step === 0) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <SearchField idle sublabel="" />
          <Field label="Address Line 1" value="" variant="placeholder" />
          <Field label="Address Line 2" value="" variant="placeholder" hint="(Apt, Suite, Unit)" />
          <Field label="City" value="" variant="placeholder" />
          <div style={s.row}>
            <SelectField label="State" value="—" variant="placeholder" style={{ flex: 1 }} />
            <Field label="ZIP Code" value="" variant="placeholder" style={{ flex: 1 }} />
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ ...s.searchWrap, borderBottom: "none", paddingBottom: 0, marginBottom: 6 }}>
            <div style={s.searchLabel}>Search for an address</div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>135 N Penn</span>
              </div>
              <DropdownResults results={MOCK_RESULTS} onSelect={() => {}} />
            </div>
          </div>
          <div style={{ borderTop: "1px dashed #ddd", paddingTop: 8 }}>
            <Field label="Address Line 1" value="" variant="placeholder" />
            <Field label="Address Line 2" value="" variant="placeholder" hint="(Apt, Suite, Unit)" />
            <Field label="City" value="" variant="placeholder" />
            <div style={s.row}>
              <SelectField label="State" value="—" variant="placeholder" style={{ flex: 1 }} />
              <Field label="ZIP Code" value="" variant="placeholder" style={{ flex: 1 }} />
            </div>
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <SearchField idle />
          <Field label="Address Line 1" value="135 N Pennsylvania St" variant="autofill" />
          <Field label="Address Line 2" value="" variant="placeholder" hint="(Apt, Suite, Unit)" />
          <Field label="City" value="Indianapolis" variant="autofill" />
          <div style={s.row}>
            <SelectField label="State" value="IN" variant="autofill" style={{ flex: 1 }} />
            <Field label="ZIP Code" value="46204" variant="autofill" style={{ flex: 1 }} />
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
  }

  if (flow === "edit") {
    if (step === 0) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <SearchField idle sublabel="— or edit fields below" />
          <Field label="Address Line 1" value={EXISTING_ADDRESS.line1} />
          <Field label="Address Line 2" value={EXISTING_ADDRESS.line2} />
          <Field label="City" value={EXISTING_ADDRESS.city} />
          <div style={s.row}>
            <SelectField label="State" value={EXISTING_ADDRESS.state} style={{ flex: 1 }} />
            <Field label="ZIP Code" value={EXISTING_ADDRESS.zip} style={{ flex: 1 }} />
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked badChecked />
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ marginBottom: 10 }}>
            <div style={s.searchLabel}>Search for an address</div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>135 N Pennsylvania</span>
              </div>
            </div>
            <ConfirmBar
              address={MOCK_RESULTS[0]}
              hasLine2={true}
              hasBadFlag={true}
              onReplace={() => {}}
              onCancel={() => {}}
            />
          </div>
          <Field label="Address Line 1" value={EXISTING_ADDRESS.line1} variant="dim" />
          <Field label="Address Line 2" value={EXISTING_ADDRESS.line2} variant="dim" />
          <Field label="City" value={EXISTING_ADDRESS.city} variant="dim" />
          <div style={s.row}>
            <SelectField label="State" value={EXISTING_ADDRESS.state} variant="dim" style={{ flex: 1 }} />
            <Field label="ZIP Code" value={EXISTING_ADDRESS.zip} variant="dim" style={{ flex: 1 }} />
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked badChecked />
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <SearchField idle sublabel="— or edit fields below" />
          <Field label="Address Line 1" value="135 N Pennsylvania St" variant="autofill" />
          <Field label="Address Line 2" value="" variant="placeholder" hint="(Apt, Suite, Unit)" />
          <Field label="City" value="Indianapolis" variant="autofill" />
          <div style={s.row}>
            <SelectField label="State" value="IN" variant="autofill" style={{ flex: 1 }} />
            <Field label="ZIP Code" value="46204" variant="autofill" style={{ flex: 1 }} />
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked badChecked={false} />
        </>
      );
    }
  }

  if (flow === "noResults") {
    if (step === 0) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ ...s.searchWrap, borderBottom: "none", paddingBottom: 0, marginBottom: 6 }}>
            <div style={s.searchLabel}>Search for an address</div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>PO Box 1234 Zionsville</span>
              </div>
              <NoResultsMessage />
            </div>
          </div>
          <div style={{ borderTop: "1px dashed #ddd", paddingTop: 8 }}>
            <Field label="Address Line 1" value="" variant="placeholder" />
            <Field label="Address Line 2" value="" variant="placeholder" hint="(Apt, Suite, Unit)" />
            <Field label="City" value="" variant="placeholder" />
            <div style={s.row}>
              <SelectField label="State" value="—" variant="placeholder" style={{ flex: 1 }} />
              <Field label="ZIP Code" value="" variant="placeholder" style={{ flex: 1 }} />
            </div>
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <SearchField idle />
          <Field label="Address Line 1" value="PO Box 1234" variant="focus" />
          <Field label="Address Line 2" value="" variant="placeholder" hint="(Apt, Suite, Unit)" />
          <Field label="City" value="Zionsville" />
          <div style={s.row}>
            <SelectField label="State" value="IN" style={{ flex: 1 }} />
            <Field label="ZIP Code" value="46077" style={{ flex: 1 }} />
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
  }

  return null;
}

// ─── Option B: Street-first progressive disclosure ───
function OptionBForm({ flow, step }) {
  if (flow === "new") {
    if (step === 0) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ marginBottom: 10 }}>
            <label style={{ ...s.label, fontSize: 11, fontWeight: 500 }}>Street Address</label>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(false)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>Start typing a street address...</span>
              </div>
            </div>
            <div style={{ fontSize: 10, color: colors.grayLight, marginTop: 4 }}>
              Type to search, or enter a full address manually
            </div>
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ marginBottom: 10 }}>
            <label style={{ ...s.label, fontSize: 11, fontWeight: 500 }}>Street Address</label>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>135 N Penn</span>
              </div>
              <DropdownResults results={MOCK_RESULTS} onSelect={() => {}} />
            </div>
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <Field label="Address Line 1" value="135 N Pennsylvania St" variant="autofill" />
          <Field label="Address Line 2" value="" variant="placeholder" hint="(Apt, Suite, Unit)" />
          <Field label="City" value="Indianapolis" variant="autofill" />
          <div style={s.row}>
            <SelectField label="State" value="IN" variant="autofill" style={{ flex: 1 }} />
            <Field label="ZIP Code" value="46204" variant="autofill" style={{ flex: 1 }} />
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
  }

  if (flow === "edit") {
    if (step === 0) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <Field label="Address Line 1" value={EXISTING_ADDRESS.line1} />
          <Field label="Address Line 2" value={EXISTING_ADDRESS.line2} />
          <Field label="City" value={EXISTING_ADDRESS.city} />
          <div style={s.row}>
            <SelectField label="State" value={EXISTING_ADDRESS.state} style={{ flex: 1 }} />
            <Field label="ZIP Code" value={EXISTING_ADDRESS.zip} style={{ flex: 1 }} />
          </div>
          <div style={{ marginBottom: 10, marginTop: 4 }}>
            <div style={{ fontSize: 10, color: colors.teal, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>
              Search for a new address
            </div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(false)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>Type to search and replace...</span>
              </div>
            </div>
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked badChecked />
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <Field label="Address Line 1" value={EXISTING_ADDRESS.line1} variant="dim" />
          <Field label="Address Line 2" value={EXISTING_ADDRESS.line2} variant="dim" />
          <Field label="City" value={EXISTING_ADDRESS.city} variant="dim" />
          <div style={s.row}>
            <SelectField label="State" value={EXISTING_ADDRESS.state} variant="dim" style={{ flex: 1 }} />
            <Field label="ZIP Code" value={EXISTING_ADDRESS.zip} variant="dim" style={{ flex: 1 }} />
          </div>
          <div style={{ marginBottom: 10, marginTop: 4 }}>
            <div style={{ fontSize: 10, color: colors.teal, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>
              Search for a new address
            </div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>135 N Pennsylvania</span>
              </div>
            </div>
            <ConfirmBar
              address={MOCK_RESULTS[0]}
              hasLine2={true}
              hasBadFlag={true}
              onReplace={() => {}}
              onCancel={() => {}}
            />
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked badChecked />
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <Field label="Address Line 1" value="135 N Pennsylvania St" variant="autofill" />
          <Field label="Address Line 2" value="" variant="placeholder" hint="(Apt, Suite, Unit)" />
          <Field label="City" value="Indianapolis" variant="autofill" />
          <div style={s.row}>
            <SelectField label="State" value="IN" variant="autofill" style={{ flex: 1 }} />
            <Field label="ZIP Code" value="46204" variant="autofill" style={{ flex: 1 }} />
          </div>
          <div style={{ marginBottom: 10, marginTop: 4 }}>
            <div style={{ fontSize: 10, color: colors.teal, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>
              Search for a new address
            </div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(false)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>Type to search and replace...</span>
              </div>
            </div>
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked badChecked={false} />
        </>
      );
    }
  }

  if (flow === "noResults") {
    if (step === 0) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ marginBottom: 10 }}>
            <label style={{ ...s.label, fontSize: 11, fontWeight: 500 }}>Street Address</label>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>PO Box 1234 Zionsville</span>
              </div>
              <NoResultsMessage />
            </div>
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ marginBottom: 10, padding: "8px 10px", background: "#f9f9f9", borderRadius: 4, border: "1px solid #eee" }}>
            <div style={{ fontSize: 10, color: colors.grayMed, marginBottom: 4 }}>Search didn't find a match. Entering manually:</div>
          </div>
          <Field label="Address Line 1" value="PO Box 1234" variant="focus" />
          <Field label="Address Line 2" value="" variant="placeholder" hint="(Apt, Suite, Unit)" />
          <Field label="City" value="Zionsville" />
          <div style={s.row}>
            <SelectField label="State" value="IN" style={{ flex: 1 }} />
            <Field label="ZIP Code" value="46077" style={{ flex: 1 }} />
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
  }

  return null;
}

// ─── Step descriptions ───
const STEP_LABELS = {
  A: {
    new: [
      "Form loads blank. Search field sits between Country and Address Line 1. All fields visible and empty.",
      "User types in search. Dropdown shows validated address suggestions with matching text bolded.",
      "User selects a result. Fields populate instantly — no confirmation needed. Line 2 stays empty for user to add apt/suite.",
    ],
    edit: [
      "Form loads with existing data. Note 'Indpls' in City (non-standard) and 'Bad Address?' is checked. Line 2 has 'Apt 4B'.",
      "User selects from search — confirmation bar appears inline. Fields dim. Note mentions Line 2 and Bad Address flag.",
      "After Replace: all address fields updated. Line 2 cleared (user re-enters). 'Bad Address?' auto-unchecked.",
    ],
    noResults: [
      "User types in search but API returns no results. Helpful message points to manual entry below.",
      "User tabs to Address Line 1 and enters manually. Search resets. Standard form behavior — no special interactions.",
    ],
  },
  B: {
    new: [
      "Only Country and Street Address field visible. Minimal form — rest of fields are hidden until an address is entered.",
      "User types — dropdown appears inline on the street field. Same validated suggestions.",
      "User selects a result. Address Line 1, Line 2, City, State, ZIP fields appear and populate. Progressive disclosure.",
    ],
    edit: [
      "Existing address shows all fields (they have data). Search field sits below the form as 'Search for a new address'.",
      "User types in search. Confirmation bar appears. Existing fields dim. Same confirm/cancel pattern.",
      "After Replace: fields updated, Bad Address cleared. Search resets below the form.",
    ],
    noResults: [
      "User types in street address field. No results. Message tells user to enter manually.",
      "All fields expand for manual entry. User fills them in. Search field available to retry.",
    ],
  },
};

// ─── Main App ───
export default function App() {
  const [option, setOption] = useState("A");
  const [flow, setFlow] = useState("new");
  const [step, setStep] = useState(0);

  const maxSteps = STEP_LABELS[option][flow].length;

  useEffect(() => {
    setStep(0);
  }, [option, flow]);

  const optionDescs = {
    A: "Search field is a separate element between Country and Address fields. All form fields are always visible. Search is an optional shortcut — user can skip it and type directly into fields.",
    B: "Street Address field doubles as the search input. For new addresses, only the street field shows initially — City, State, ZIP appear after a selection (progressive disclosure). For edits, all fields show since they have data, with search below as a 'replace' action.",
  };

  return (
    <div style={s.wrapper}>
      {/* Option tabs */}
      <div style={s.tabBar}>
        <button style={s.tab(option === "A")} onClick={() => setOption("A")}>
          Option A: Separate Search Field
        </button>
        <button style={s.tab(option === "B")} onClick={() => setOption("B")}>
          Option B: Street-First Progressive
        </button>
      </div>

      <div style={s.optionDesc}>{optionDescs[option]}</div>

      {/* Flow selector */}
      <div style={s.flowBar}>
        <button style={s.flowBtn(flow === "new")} onClick={() => setFlow("new")}>
          New Address
        </button>
        <button style={s.flowBtn(flow === "edit")} onClick={() => setFlow("edit")}>
          Edit Existing
        </button>
        <button style={s.flowBtn(flow === "noResults")} onClick={() => setFlow("noResults")}>
          No Results / Manual
        </button>
      </div>

      {/* Step selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={s.stepBar}>
          {Array.from({ length: maxSteps }, (_, i) => (
            <button key={i} style={s.stepBtn(step === i, true)} onClick={() => setStep(i)}>
              {i + 1}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{ ...s.btnCancel, opacity: step === 0 ? 0.3 : 1, fontSize: 11, padding: "3px 10px" }}
          >
            ← Prev
          </button>
          <button
            onClick={() => setStep(Math.min(maxSteps - 1, step + 1))}
            disabled={step >= maxSteps - 1}
            style={{ ...s.btnSave, opacity: step >= maxSteps - 1 ? 0.3 : 1, fontSize: 11, padding: "3px 10px" }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Step description */}
      <div style={s.stepLabel}>
        <strong>Step {step + 1}:</strong> {STEP_LABELS[option][flow][step]}
      </div>

      {/* CRM Frame */}
      <div style={s.crmFrame}>
        <div style={s.crmLayout}>
          <SidebarNav />
          <div style={s.body}>
            <div style={s.main}>
              <CRMHeader />
              {option === "A" ? (
                <OptionAForm flow={flow} step={step} />
              ) : (
                <OptionBForm flow={flow} step={step} />
              )}
            </div>
            <div style={s.rightPanel}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 8 }}>Other Addresses</div>
              <div style={{ fontSize: 13, color: "#999" }}>None</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
