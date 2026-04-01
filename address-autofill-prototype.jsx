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
};

// ─── Styles ───
const colors = {
  teal: "#3a8fa3",
  tealLight: "#edf6f9",
  tealDark: "#2a7a8e",
  gray: "#d0d0d0",
  grayDark: "#333",
  grayMed: "#888",
  grayLight: "#bbb",
  grayBg: "#efefef",
  sidebar: "#3d4548",
  sidebarActive: "#4caf50",
  greenLabel: "#3a8fa3",
  error: "#ea1d35",
  warn: "#fffbe6",
  warnBorder: "#eed86a",
  warnText: "#665a00",
};

const s = {
  wrapper: { fontFamily: "'Prompt', sans-serif", maxWidth: 860, margin: "0 auto", padding: "0", background: colors.grayBg, minHeight: "100vh" },
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
  crmFrame: { background: "white", overflow: "hidden", border: `1px solid #ddd`, marginTop: 0 },
  crmTopBar: { background: "white", borderBottom: "1px solid #e0e0e0", padding: "10px 0", display: "flex", justifyContent: "center", alignItems: "center" },
  crmTopSearch: { width: 340, height: 34, border: "1px solid #d0d0d0", borderRadius: 4, padding: "0 14px", fontSize: 13, color: "#aaa", background: "white", boxSizing: "border-box", fontFamily: "'Prompt', sans-serif", display: "flex", alignItems: "center" },
  crmLayout: { display: "flex" },
  sidebar: { width: 64, background: colors.sidebar, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14, gap: 16, flexShrink: 0, minHeight: 460 },
  sideIcon: (active) => ({ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderLeft: active ? `3px solid ${colors.sidebarActive}` : "3px solid transparent", paddingLeft: 2 }),
  body: { flex: 1, background: "white", display: "flex" },
  main: { flex: 1, padding: "18px 24px 24px" },
  rightPanel: { width: 240, borderLeft: "1px solid #e5e5e5", padding: "16px 18px", background: "white" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  title: { fontSize: 18, fontWeight: 500, color: colors.grayDark },
  btnCancel: { fontSize: 12, padding: "6px 16px", borderRadius: 3, border: "1px solid #ccc", background: "white", color: "#555", cursor: "pointer", marginRight: 6, fontFamily: "'Prompt', sans-serif" },
  btnSave: { fontSize: 12, padding: "6px 16px", borderRadius: 3, border: "none", background: colors.teal, color: "white", cursor: "pointer", fontFamily: "'Prompt', sans-serif" },
  field: { marginBottom: 14 },
  label: { fontSize: 12, color: colors.grayMed, marginBottom: 4, display: "block" },
  labelGreen: { fontSize: 12, color: colors.greenLabel, marginBottom: 4, display: "block" },
  input: (variant) => ({
    width: "100%",
    height: 36,
    border: `1px solid ${variant === "autofill" ? colors.teal : variant === "focus" ? colors.teal : variant === "error" ? colors.error : colors.gray}`,
    padding: "0 10px",
    fontSize: 13,
    color: variant === "autofill" ? colors.tealDark : variant === "placeholder" ? colors.grayLight : variant === "dim" ? colors.grayLight : colors.grayDark,
    background: variant === "autofill" ? colors.tealLight : variant === "dim" ? "#fafafa" : "white",
    borderRadius: 3,
    boxSizing: "border-box",
    fontFamily: "'Prompt', sans-serif",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
    opacity: variant === "dim" ? 0.45 : 1,
    boxShadow: variant === "focus" ? `0 0 0 2px rgba(74,155,142,0.15)` : "none",
  }),
  select: (variant) => ({
    width: "100%",
    height: 36,
    border: `1px solid ${variant === "autofill" ? colors.teal : colors.gray}`,
    borderRadius: 3,
    padding: "0 28px 0 10px",
    fontSize: 13,
    color: variant === "autofill" ? colors.tealDark : variant === "placeholder" ? colors.grayLight : colors.grayDark,
    background: `${variant === "autofill" ? colors.tealLight : "white"} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 10px center`,
    boxSizing: "border-box",
    fontFamily: "'Prompt', sans-serif",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
    opacity: variant === "dim" ? 0.45 : 1,
  }),
  row: { display: "flex", gap: 12 },
  searchWrap: { marginBottom: 10 },
  searchLabel: { fontSize: 12, color: colors.grayMed, marginBottom: 4, display: "block" },
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
    fontFamily: "'Prompt', sans-serif",
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
  const icons = [
    // home
    <svg key="home" viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M3 9l7-6 7 6v8a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" stroke="white" strokeWidth="1.4"/></svg>,
    // people (active)
    <svg key="people" viewBox="0 0 20 20" fill="none" width="18" height="18"><circle cx="8" cy="7" r="3" stroke="white" strokeWidth="1.4"/><circle cx="13" cy="7" r="3" stroke="white" strokeWidth="1.4"/><path d="M1 17c0-3 3-5 7-5s7 2 7 5" stroke="white" strokeWidth="1.4"/></svg>,
    // campaigns (asterisk/star)
    <svg key="camp" viewBox="0 0 20 20" fill="none" width="18" height="18"><circle cx="10" cy="10" r="2" stroke="white" strokeWidth="1.4"/><path d="M10 3v4M10 13v4M3 10h4M13 10h4M5.6 5.6l2.8 2.8M11.6 11.6l2.8 2.8M14.4 5.6l-2.8 2.8M8.4 11.6l-2.8 2.8" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>,
    // reports (pie)
    <svg key="rep" viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M10 10L10 3A7 7 0 0117 10z" stroke="white" strokeWidth="1.4"/><circle cx="10" cy="10" r="7" stroke="white" strokeWidth="1.4"/></svg>,
    // messages
    <svg key="msg" viewBox="0 0 20 20" fill="none" width="18" height="18"><rect x="2" y="4" width="16" height="11" rx="1.5" stroke="white" strokeWidth="1.4"/><path d="M6 15l4 3 4-3" stroke="white" strokeWidth="1.4"/></svg>,
    // payments
    <svg key="pay" viewBox="0 0 20 20" fill="none" width="18" height="18"><rect x="2" y="5" width="16" height="12" rx="1.5" stroke="white" strokeWidth="1.4"/><path d="M2 9h16" stroke="white" strokeWidth="1.4"/></svg>,
    // settings
    <svg key="set" viewBox="0 0 20 20" fill="none" width="18" height="18"><circle cx="10" cy="10" r="2.5" stroke="white" strokeWidth="1.4"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  ];
  return (
    <div style={s.sidebar}>
      {icons.map((icon, i) => (
        <div key={i} style={s.sideIcon(i === 1)}>
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18" style={{ opacity: i === 1 ? 1 : 0.35 }}>
            {icon.props.children}
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

function Checks({ primaryChecked = true }) {
  return (
    <div style={s.checkRow}>
      <div style={s.checkItem}>
        <div style={s.checkBox(primaryChecked)}>{primaryChecked ? "✓" : ""}</div> Primary?
      </div>
    </div>
  );
}

function SearchField({ active, value, idle, sublabel }) {
  return (
    <div style={s.searchWrap}>
      <div style={s.searchLabel}>
        Search for an Address{" "}
        {sublabel && <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: colors.grayLight }}>{sublabel}</span>}
      </div>
      <div style={{ position: "relative" }}>
        <div style={s.searchInput(active)}>
          <SearchIcon />
          <span style={{ marginLeft: 22 }}>{idle ? "Start typing an address..." : value}</span>
        </div>
      </div>
      {idle && <SearchTips />}
    </div>
  );
}

function SearchTips() {
  return (
    <div style={{ marginTop: 6, padding: "8px 10px", background: "#f9f9f9", border: "1px solid #eee", borderRadius: 3, fontSize: 11, lineHeight: 1.7, color: colors.grayMed }}>
      <div style={{ fontWeight: 600, color: "#555", marginBottom: 3 }}>Tips</div>
      <div><span style={{ color: "#3a9a4a", marginRight: 5 }}>✓</span>Enter a street address (e.g. "123 Main St, Indianapolis")</div>
      <div><span style={{ color: "#3a9a4a", marginRight: 5 }}>✓</span>Include city or ZIP to narrow results</div>
      <div><span style={{ color: colors.error, marginRight: 5 }}>✗</span>PO Boxes aren't supported — use a deliverable street address</div>
      <div><span style={{ color: colors.error, marginRight: 5 }}>✗</span>Skip apartment or suite numbers</div>
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

function ConfirmBar({ address, onReplace, onCancel }) {
  return (
    <div style={s.confirm}>
      Replace current address with <strong style={{ color: colors.grayDark }}>{address.line1}, {address.city}, {address.state} {address.zip}</strong>?
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

function POBoxWarning() {
  return (
    <div style={{ ...s.noResults, background: "#fff8e1", border: `1px solid ${colors.warnBorder}`, borderTop: "none", color: colors.warnText }}>
      <strong style={{ color: "#665a00" }}>PO Boxes aren't supported.</strong>
      <br />
      Please enter a deliverable street address instead.
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
          <Field label="Address" value="" variant="placeholder" />
          <Field label="City" value="" variant="placeholder" />
          <SelectField label="State" value="" variant="placeholder" />
          <Field label="ZIP Code" value="" variant="placeholder" />
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
            <div style={s.searchLabel}>Search for an Address</div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>135 N Penn</span>
              </div>
              <DropdownResults results={MOCK_RESULTS} onSelect={() => {}} />
            </div>
          </div>
          <Field label="Address" value="" variant="placeholder" />
          <Field label="City" value="" variant="placeholder" />
          <SelectField label="State" value="" variant="placeholder" />
          <Field label="ZIP Code" value="" variant="placeholder" />
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
          <Field label="Address" value="135 N Pennsylvania St" variant="autofill" />
          <Field label="City" value="Indianapolis" variant="autofill" />
          <SelectField label="State" value="IN" variant="autofill" />
          <Field label="ZIP Code" value="46204" variant="autofill" />
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
          <Field label="Address" value={EXISTING_ADDRESS.line1} />
          <Field label="City" value={EXISTING_ADDRESS.city} />
          <SelectField label="State" value={EXISTING_ADDRESS.state} />
          <Field label="ZIP Code" value={EXISTING_ADDRESS.zip} />
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked />
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ marginBottom: 10 }}>
            <div style={s.searchLabel}>Search for an Address</div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>135 N Pennsylvania</span>
              </div>
            </div>
            <ConfirmBar
              address={MOCK_RESULTS[0]}
              onReplace={() => {}}
              onCancel={() => {}}
            />
          </div>
          <Field label="Address" value={EXISTING_ADDRESS.line1} variant="dim" />
          <Field label="City" value={EXISTING_ADDRESS.city} variant="dim" />
          <SelectField label="State" value={EXISTING_ADDRESS.state} variant="dim" />
          <Field label="ZIP Code" value={EXISTING_ADDRESS.zip} variant="dim" />
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked />
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <SearchField idle sublabel="— or edit fields below" />
          <Field label="Address" value="135 N Pennsylvania St" variant="autofill" />
          <Field label="City" value="Indianapolis" variant="autofill" />
          <SelectField label="State" value="IN" variant="autofill" />
          <Field label="ZIP Code" value="46204" variant="autofill" />
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked />
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
            <div style={s.searchLabel}>Search for an Address</div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>2891 Elm St Springfield</span>
              </div>
              <NoResultsMessage />
            </div>
          </div>
          <Field label="Address" value="" variant="placeholder" />
          <Field label="City" value="" variant="placeholder" />
          <SelectField label="State" value="" variant="placeholder" />
          <Field label="ZIP Code" value="" variant="placeholder" />
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
          <Field label="Address" value="2891 Elm St" variant="focus" />
          <Field label="City" value="Springfield" />
          <SelectField label="State" value="" variant="placeholder" />
          <Field label="ZIP Code" value="" variant="placeholder" />
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ ...s.searchWrap, borderBottom: "none", paddingBottom: 0, marginBottom: 6 }}>
            <div style={s.searchLabel}>Search for an Address</div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>PO Box 1234 Zionsville</span>
              </div>
              <POBoxWarning />
            </div>
          </div>
          <Field label="Address" value="" variant="placeholder" />
          <Field label="City" value="" variant="placeholder" />
          <SelectField label="State" value="" variant="placeholder" />
          <Field label="ZIP Code" value="" variant="placeholder" />
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
    if (step === 3) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <SearchField idle />
          <Field label="Address" value="618 N Elm St" variant="focus" />
          <Field label="City" value="Zionsville" />
          <SelectField label="State" value="IN" />
          <Field label="ZIP Code" value="46077" />
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
            <label style={s.label}>Address</label>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(false)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>Start typing a street address...</span>
              </div>
            </div>
            <SearchTips />
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
            <label style={s.label}>Address</label>
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
          <Field label="Address" value="135 N Pennsylvania St" variant="autofill" />
          <Field label="City" value="Indianapolis" variant="autofill" />
          <SelectField label="State" value="IN" variant="autofill" />
          <Field label="ZIP Code" value="46204" variant="autofill" />
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
          <Field label="Address" value={EXISTING_ADDRESS.line1} />
          <Field label="City" value={EXISTING_ADDRESS.city} />
          <SelectField label="State" value={EXISTING_ADDRESS.state} />
          <Field label="ZIP Code" value={EXISTING_ADDRESS.zip} />
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked />
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ marginBottom: 10 }}>
            <div style={s.searchLabel}>Search for an Address</div>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>135 N Pennsylvania</span>
              </div>
            </div>
            <ConfirmBar
              address={MOCK_RESULTS[0]}
              onReplace={() => {}}
              onCancel={() => {}}
            />
          </div>
          <Field label="Address" value={EXISTING_ADDRESS.line1} variant="dim" />
          <Field label="City" value={EXISTING_ADDRESS.city} variant="dim" />
          <SelectField label="State" value={EXISTING_ADDRESS.state} variant="dim" />
          <Field label="ZIP Code" value={EXISTING_ADDRESS.zip} variant="dim" />
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked />
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <SearchField idle sublabel="— or edit fields below" />
          <Field label="Address" value="135 N Pennsylvania St" variant="autofill" />
          <Field label="City" value="Indianapolis" variant="autofill" />
          <SelectField label="State" value="IN" variant="autofill" />
          <Field label="ZIP Code" value="46204" variant="autofill" />
          <SelectField label="Type" value="Home" green />
          <Checks primaryChecked />
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
            <label style={s.label}>Address</label>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>2891 Elm St Springfield</span>
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
          <Field label="Address" value="2891 Elm St" variant="focus" />
          <Field label="City" value="Springfield" />
          <SelectField label="State" value="" variant="placeholder" />
          <Field label="ZIP Code" value="" variant="placeholder" />
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <div style={{ marginBottom: 10 }}>
            <label style={s.label}>Address</label>
            <div style={{ position: "relative" }}>
              <div style={s.searchInput(true)}>
                <SearchIcon />
                <span style={{ marginLeft: 22 }}>PO Box 1234 Zionsville</span>
              </div>
              <POBoxWarning />
            </div>
          </div>
          <SelectField label="Type" value="Home" green />
          <Checks />
        </>
      );
    }
    if (step === 3) {
      return (
        <>
          <SelectField label="Country" value="United States" />
          <Field label="Address" value="618 N Elm St" variant="focus" />
          <Field label="City" value="Zionsville" />
          <SelectField label="State" value="IN" />
          <Field label="ZIP Code" value="46077" />
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
      "Form loads blank. Search field sits between Country and Address. All fields visible and empty.",
      "User types in search. Dropdown shows validated address suggestions with matching text bolded.",
      "User selects a result. Fields populate instantly — no confirmation needed.",
    ],
    edit: [
      "Form loads with existing data. Note 'Indpls' in City (non-standard).",
      "User selects from search — confirmation bar appears inline. Existing fields dim.",
      "After Replace: all address fields updated with the validated address.",
    ],
    noResults: [
      "User searches a real address — no results found. Message prompts manual entry.",
      "User fills in fields manually. Search remains available to retry.",
      "User types 'PO Box...' — warning appears. Fields below remain empty.",
      "User types a street address manually. Search remains available to retry.",
    ],
  },
  B: {
    new: [
      "Only Country and Street Address field visible. Minimal form — rest of fields are hidden until an address is entered.",
      "User types — dropdown appears inline on the street field. Same validated suggestions.",
      "User selects a result. Address, City, State, ZIP fields appear and populate. Progressive disclosure.",
    ],
    edit: [
      "Existing address shows all fields. Search field sits above, same as new address flow.",
      "User types in search. Confirmation bar appears. Existing fields dim.",
      "After Replace: fields updated with validated address.",
    ],
    noResults: [
      "User searches a real address — no results found. Message prompts manual entry.",
      "User fills in fields manually. Search available above to retry.",
      "User types 'PO Box...' — warning appears. Fields below remain empty.",
      "User types a street address manually. Search available above to retry.",
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
        <div style={s.crmTopBar}>
          <div style={s.crmTopSearch}>Search for constituents</div>
        </div>
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
              <div style={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#333", padding: "10px 14px", borderBottom: "1px solid #e0e0e0" }}>Other Addresses</div>
                <div style={{ fontSize: 13, color: "#999", padding: "10px 14px" }}>None</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
