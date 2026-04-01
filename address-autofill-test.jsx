import { useState, useEffect, useRef } from "react";

// Mock data matching Smarty US Autocomplete Pro API response format
// Fields: street_line, secondary, city, state, zipcode, entries
const MOCK_RESULTS = [
  { street_line: "135 N Pennsylvania St", secondary: "", city: "Indianapolis", state: "IN", zipcode: "46204", entries: 0 },
  { street_line: "135 N Pennsylvania Ave", secondary: "", city: "Lansing", state: "MI", zipcode: "48912", entries: 0 },
  { street_line: "135 N Penn St", secondary: "Apt", city: "York", state: "PA", zipcode: "17401", entries: 4 },
];

const EXISTING_ADDRESS = {
  street_line: "42 Wallaby Way",
  secondary: "",
  city: "Indpls",
  state: "IN",
  zipcode: "46201",
};

const colors = {
  teal: "#3a8fa3",           // Replace button only
  green: "#4caf50",          // interactive states, autofill, hover
  greenLight: "#eaf6ea",     // autofill bg
  dropdownHover: "#D9E9CD", // dropdown item hover
  greenDark: "#2d7a30",      // autofill text
  gray: "#d0d0d0",
  grayDark: "#333",
  inputText: "#202020",
  grayMed: "#999",
  grayLight: "#aaa",
  grayBg: "#efefef",
  sidebar: "#3d4548",
  greenLabel: "#4caf50",
  link: "#298BAB",
  linkHover: "#1f6d87",
  error: "#ea1d35",
};

const s = {
  wrapper: { fontFamily: "'Prompt', sans-serif", maxWidth: 860, margin: "0 auto", background: colors.grayBg, minHeight: "100vh" },
  taskBanner: { background: "#1a3a4a", color: "white", padding: "14px 24px", fontSize: 13, lineHeight: 1.6 },
  taskLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7ecbe0", marginBottom: 4 },
  crmFrame: { background: "white", overflow: "hidden", border: "1px solid #ddd" },
  crmTopBar: { background: "white", borderBottom: "1px solid #e0e0e0", padding: "10px 0", display: "flex", justifyContent: "center", alignItems: "center" },
  crmTopSearch: { width: 340, height: 34, border: "1px solid #d0d0d0", borderRadius: 4, padding: "0 14px", fontSize: 13, color: "#aaa", background: "white", boxSizing: "border-box", fontFamily: "'Prompt', sans-serif", display: "flex", alignItems: "center" },
  crmLayout: { display: "flex" },
  sidebar: { width: 64, background: colors.sidebar, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14, gap: 16, flexShrink: 0, minHeight: 500 },
  sideIcon: (active) => ({ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: active ? "3px solid #4caf50" : "3px solid transparent", paddingLeft: 2 }),
  body: { flex: 1, background: "white", display: "flex", flexDirection: "column" },
  contentRow: { display: "flex", flex: 1 },
  main: { flex: 1, padding: "18px 24px 24px" },
  rightPanel: { width: 240, borderLeft: "1px solid #e0e0e0", padding: "16px 18px", background: "white" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #e0e0e0" },
  title: { fontSize: 18, fontWeight: 500, color: colors.grayDark },
  btnCancel: { fontSize: 12, padding: "6px 16px", borderRadius: 3, border: "1px solid #ccc", background: "white", color: "#555", cursor: "pointer", marginRight: 6, fontFamily: "'Prompt', sans-serif" },
  btnSave: { fontSize: 12, padding: "6px 16px", borderRadius: 3, border: "none", background: colors.teal, color: "white", cursor: "pointer", fontFamily: "'Prompt', sans-serif" },
  field: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: 500, color: colors.grayMed, marginBottom: 4, display: "block" },
  labelGreen: { fontSize: 14, fontWeight: 500, color: colors.greenLabel, marginBottom: 4, display: "block" },
  input: {
    width: "100%",
    height: 36,
    border: "1px solid #d0d0d0",
    borderRadius: 3,
    padding: "0 10px",
    fontSize: 13,
    color: "#202020",
    background: "white",
    boxSizing: "border-box",
    fontFamily: "'Prompt', sans-serif",
    outline: "none",
  },
  inputTall: {
    width: "100%",
    height: 72,
    border: "1px solid #d0d0d0",
    borderRadius: 3,
    padding: "8px 10px",
    fontSize: 13,
    color: "#202020",
    background: "white",
    boxSizing: "border-box",
    fontFamily: "'Prompt', sans-serif",
    outline: "none",
    resize: "none",
  },
  select: { width: "100%", height: 36, border: "1px solid " + colors.gray, borderRadius: 3, padding: "0 28px 0 10px", fontSize: 13, color: colors.inputText, background: "white url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E\") no-repeat right 10px center", boxSizing: "border-box", fontFamily: "'Prompt', sans-serif" },
  searchWrap: { marginBottom: 10 },
  searchLabel: { fontSize: 14, fontWeight: 500, color: colors.grayMed, marginBottom: 4, display: "block" },
  searchInput: (active) => ({ width: "100%", height: 36, border: "1px solid " + (active ? colors.green : colors.gray), borderRadius: 3, padding: "0 10px 0 32px", fontSize: 13, color: active ? colors.grayDark : colors.grayLight, background: "white", boxSizing: "border-box", fontFamily: "'Prompt', sans-serif", outline: "none", boxShadow: "none" }),
  dropdown: { position: "absolute", width: "100%", zIndex: 10, background: "white", border: "1px solid " + colors.gray, borderTop: "none", boxShadow: "0 3px 10px rgba(0,0,0,0.08)", overflow: "hidden" },
  dropdownItem: (hover) => ({ padding: "8px 10px", fontSize: 12, color: colors.grayDark, borderBottom: "1px solid #f2f2f2", cursor: "pointer", background: hover ? colors.dropdownHover : "white" }),
  confirm: { background: "#fafafa", border: "1px solid #e0e0e0", borderRadius: 3, padding: "10px 12px", marginTop: 6, fontSize: 12, color: "#555", lineHeight: 1.5 },
  confirmBtns: { display: "flex", gap: 6, marginTop: 8 },
  noResults: { position: "absolute", width: "100%", zIndex: 10, background: "#fafafa", border: "1px solid #e0e0e0", borderTop: "none", padding: "10px 12px", fontSize: 12, color: "#555", lineHeight: 1.5, boxSizing: "border-box" },
  row: { display: "flex", gap: 12 },
  checkRow: { display: "flex", gap: 24, marginTop: 4 },
  checkItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#999" },
  checkBox: (checked, flash) => ({
    width: 16, height: 16,
    border: "1px solid #ccc",
    borderRadius: 2,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11,
    color: colors.green,
    background: flash ? "#b8f0d0" : (checked ? colors.greenLight : "white"),
    cursor: "pointer",
    transition: "background 0.4s ease, box-shadow 0.4s ease",
    boxShadow: flash ? "0 0 0 4px rgba(58,143,163,0.3)" : "none",
  }),
  manualLink: {
    color: colors.link,
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 500,
    background: "none",
    border: "none",
    padding: "4px 0",
    fontSize: 12,
    fontFamily: "'Prompt', sans-serif",
  },
};

function SearchIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", left: 10, top: 11, color: active ? colors.green : "#999", pointerEvents: "none" }}>
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SidebarNav() {
  const icons = [
    <path key="h" d="M3 9l7-6 7 6v8a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" stroke="white" strokeWidth="1.4"/>,
    <><circle key="p1" cx="8" cy="7" r="3" stroke="white" strokeWidth="1.4"/><circle key="p2" cx="13" cy="7" r="3" stroke="white" strokeWidth="1.4"/><path key="p3" d="M1 17c0-3 3-5 7-5s7 2 7 5" stroke="white" strokeWidth="1.4"/></>,
    <><circle key="c1" cx="10" cy="10" r="2" stroke="white" strokeWidth="1.4"/><path key="c2" d="M10 3v4M10 13v4M3 10h4M13 10h4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></>,
    <><path key="r1" d="M10 10L10 3A7 7 0 0117 10z" stroke="white" strokeWidth="1.4"/><circle key="r2" cx="10" cy="10" r="7" stroke="white" strokeWidth="1.4"/></>,
    <><rect key="m1" x="2" y="4" width="16" height="11" rx="1.5" stroke="white" strokeWidth="1.4"/><path key="m2" d="M6 15l4 3 4-3" stroke="white" strokeWidth="1.4"/></>,
    <><rect key="pay1" x="2" y="5" width="16" height="12" rx="1.5" stroke="white" strokeWidth="1.4"/><path key="pay2" d="M2 9h16" stroke="white" strokeWidth="1.4"/></>,
    <><circle key="s1" cx="10" cy="10" r="2.5" stroke="white" strokeWidth="1.4"/><path key="s2" d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></>,
  ];
  return (
    <div style={s.sidebar}>
      {icons.map((icon, i) => (
        <div key={i} style={s.sideIcon(i === 1)}>
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18" style={{ opacity: i === 1 ? 1 : 0.35 }}>
            {icon}
          </svg>
        </div>
      ))}
    </div>
  );
}

// ─── Main Test App ───
export default function App() {
  const [searchState, setSearchState] = useState("idle");
  const [searchValue, setSearchValue] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [hoveredResult, setHoveredResult] = useState(-1);
  const inputRef = useRef(null);
  const addressRef = useRef(null);

  // Editable address fields
  const [fields, setFields] = useState({ ...EXISTING_ADDRESS });
  const [badAddress, setBadAddress] = useState(true);
  const [badAddressFlash, setBadAddressFlash] = useState(false);

  function updateField(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchValue(val);
    if (val.trim() === "") {
      setSearchState("idle");
    } else if (/po\s*box/i.test(val)) {
      setSearchState("poBox");
    } else {
      setSearchState("typing");
    }
  }

  function handleSelectResult(result) {
    setSelectedResult(result);
    setSearchState("confirming");
  }

  function handleReplace() {
    if (selectedResult) {
      setFields({
        street_line: selectedResult.street_line,
        secondary: selectedResult.secondary || "",
        city: selectedResult.city,
        state: selectedResult.state,
        zipcode: selectedResult.zipcode,
      });
    }
    setSearchState("replaced");
    setSearchValue("");

    // Flash Bad Address checkbox when auto-clearing
    if (badAddress) {
      setBadAddress(false);
      setBadAddressFlash(true);
      setTimeout(() => setBadAddressFlash(false), 1500);
    }
  }

  function handleCancelConfirm() {
    setSearchState("idle");
    setSearchValue("");
    setSelectedResult(null);
  }

  function handleEnterManually() {
    setSearchState("idle");
    setSelectedResult(null);
    setTimeout(() => {
      if (addressRef.current) addressRef.current.focus();
    }, 50);
  }

  const showDropdown = searchState === "typing";
  const showConfirm = searchState === "confirming";
  const showNoResults = searchState === "noResults";
  const showPoBox = searchState === "poBox";
  const searchActive = ["typing", "confirming", "noResults", "poBox"].includes(searchState);

  return (
    <div style={s.wrapper}>
      {/* Task Banner */}
      <div style={s.taskBanner}>
        <div style={s.taskLabel}>Your Task</div>
        A constituent named John Smith has moved. His new address is{" "}
        <strong>135 N Pennsylvania St, Indianapolis, IN 46204</strong>. Please update his address in the system.
      </div>

      {/* CRM Frame */}
      <div style={s.crmFrame}>
        <div style={s.crmTopBar}>
          <div style={s.crmTopSearch}>Search for constituents</div>
        </div>
        <div style={s.crmLayout}>
          <SidebarNav />
          <div style={s.body}>
            {/* Header */}
            <div style={s.header}>
              <div style={s.title}>Edit Address</div>
              <div>
                <button style={s.btnCancel}>Cancel</button>
                <button style={s.btnSave}>Save</button>
              </div>
            </div>
            <div style={s.contentRow}>
            <div style={s.main}>

              {/* Country */}
              <div style={s.field}>
                <label style={s.label}>Country</label>
                <div style={s.select}>United States</div>
              </div>

              {/* Search */}
              <div style={{ ...s.searchWrap, marginBottom: showConfirm ? 0 : 10 }}>
                <label style={s.searchLabel}>Search for an Address</label>
                <div style={{ position: "relative" }}>
                  <SearchIcon active={searchActive} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Start typing an address..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    style={s.searchInput(searchActive)}
                  />

                  {/* Dropdown — Smarty US Autocomplete Pro format with city/state emphasis */}
                  {showDropdown && (
                    <div style={s.dropdown}>
                      {MOCK_RESULTS.map((r, i) => (
                        <div
                          key={i}
                          style={s.dropdownItem(hoveredResult === i)}
                          onMouseEnter={() => setHoveredResult(i)}
                          onMouseLeave={() => setHoveredResult(-1)}
                          onClick={() => handleSelectResult(r)}
                        >
                          <span>
                            {r.street_line}
                            {r.secondary ? " " + r.secondary : ""}
                            {r.entries > 0 && (
                              <span style={{ fontSize: 11, color: colors.grayMed }}>{" "}({r.entries} entries)</span>
                            )}
                            <span style={{ fontWeight: 600, color: colors.grayDark }}>
                              {" "}&mdash; {r.city}, {r.state}
                            </span>
                            <span style={{ color: colors.grayMed }}> {r.zipcode}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No results — with "Enter manually" link */}
                  {showNoResults && (
                    <div style={s.noResults}>
                      <strong style={{ color: "#333" }}>No matching addresses found.</strong>
                      <br />
                      <button onClick={handleEnterManually} style={s.manualLink} onMouseEnter={e => e.target.style.color = colors.linkHover} onMouseLeave={e => e.target.style.color = colors.link}>
                        Enter the address manually
                      </button>
                    </div>
                  )}

                  {/* PO Box error — plain language + "enter manually" link */}
                  {showPoBox && (
                    <div style={s.noResults}>
                      <strong style={{ color: "#333" }}>PO Boxes aren't supported.</strong>
                      <br />
                      Please enter a street address instead, or{" "}
                      <button onClick={handleEnterManually} style={s.manualLink} onMouseEnter={e => e.target.style.color = colors.linkHover} onMouseLeave={e => e.target.style.color = colors.link}>
                        enter the address manually
                      </button>.
                    </div>
                  )}
                </div>

                {/* Confirm — updated scope language */}
                {showConfirm && selectedResult && (
                  <div style={s.confirm}>
                    Replace all address fields with{" "}
                    <strong style={{ color: colors.grayDark }}>
                      {selectedResult.street_line}, {selectedResult.city}, {selectedResult.state} {selectedResult.zipcode}
                    </strong>?
                    <div style={s.confirmBtns}>
                      <button onClick={handleReplace} style={{ ...s.btnSave, fontSize: 12, padding: "5px 14px" }}>Replace</button>
                      <button onClick={handleCancelConfirm} style={{ ...s.btnCancel, fontSize: 12, padding: "5px 14px", marginRight: 0 }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Helper text — search discoverability nudge */}
              {searchState === "idle" && (
                <div style={{ fontSize: 11, color: colors.grayLight, marginBottom: 10, fontStyle: "italic" }}>
                  Type an address above to auto-fill the fields below
                </div>
              )}

              {/* Address fields — now editable inputs */}
              <div style={s.field}>
                <label style={s.label}>Address</label>
                <textarea
                  ref={addressRef}
                  value={fields.street_line}
                  onChange={(e) => updateField("street_line", e.target.value)}
                  style={s.inputTall}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>City</label>
                <input
                  type="text"
                  value={fields.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  style={s.input}
                />
              </div>
              <div style={{ ...s.field, maxWidth: 200 }}>
                <label style={s.label}>State</label>
                <input
                  type="text"
                  value={fields.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  style={s.input}
                />
              </div>
              <div style={{ ...s.field, maxWidth: 160 }}>
                <label style={s.label}>ZIP Code</label>
                <input
                  type="text"
                  value={fields.zipcode}
                  onChange={(e) => updateField("zipcode", e.target.value)}
                  style={s.input}
                />
              </div>
              <div style={s.field}>
                <label style={s.labelGreen}>Type</label>
                <div style={s.select}>Home</div>
              </div>

              {/* Checkboxes */}
              <div style={s.checkRow}>
                <div style={s.checkItem}>
                  <div style={s.checkBox(true, false)}>✓</div> Primary?
                </div>
                <div style={s.checkItem}>
                  <div
                    style={s.checkBox(badAddress, badAddressFlash)}
                    onClick={() => setBadAddress(!badAddress)}
                  >
                    {badAddress ? "✓" : ""}
                  </div>
                  {" "}Bad Address?
                  {badAddressFlash && (
                    <span style={{
                      fontSize: 10,
                      color: colors.green,
                      fontWeight: 500,
                      marginLeft: 4,
                    }}>
                      Cleared
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right panel */}
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
    </div>
  );
}
