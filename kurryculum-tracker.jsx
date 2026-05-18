import { useState, useEffect } from "react";

const COLORS = {
  dark: "#1a2e1a",
  green: "#2d5a27",
  lightGreen: "#4a7c3f",
  cream: "#faf6ef",
  gold: "#c9973a",
  text: "#1a1a1a",
  muted: "#6b7280",
  card: "#ffffff",
  border: "#e8e0d4",
};

const CULTURAL_FOODS = {
  "South Asian": [
    { name: "Dal Tadka (1 bowl)", cal: 180, p: 10, c: 28, f: 4 },
    { name: "Roti (1 piece)", cal: 70, p: 2, c: 15, f: 1 },
    { name: "Basmati Rice (1 cup)", cal: 210, p: 4, c: 46, f: 0 },
    { name: "Paneer (100g)", cal: 265, p: 18, c: 4, f: 20 },
    { name: "Chicken Curry (1 bowl)", cal: 280, p: 28, c: 8, f: 16 },
    { name: "Saag Aloo (1 bowl)", cal: 160, p: 4, c: 22, f: 7 },
    { name: "Biryani (1 cup)", cal: 290, p: 12, c: 45, f: 8 },
    { name: "Idli (2 pieces)", cal: 130, p: 4, c: 26, f: 1 },
    { name: "Masala Dosa", cal: 220, p: 6, c: 38, f: 6 },
    { name: "Rajma (1 bowl)", cal: 200, p: 12, c: 32, f: 4 },
    { name: "Chana Masala (1 bowl)", cal: 230, p: 12, c: 35, f: 6 },
    { name: "Lassi (1 glass)", cal: 150, p: 6, c: 20, f: 5 },
  ],
  "West African": [
    { name: "Jollof Rice (1 cup)", cal: 280, p: 6, c: 52, f: 6 },
    { name: "Egusi Soup (1 bowl)", cal: 320, p: 18, c: 12, f: 24 },
    { name: "Suya (100g)", cal: 220, p: 26, c: 4, f: 12 },
    { name: "Pounded Yam (1 cup)", cal: 240, p: 3, c: 56, f: 0 },
    { name: "Plantain (1 medium)", cal: 180, p: 2, c: 42, f: 1 },
    { name: "Groundnut Soup (1 bowl)", cal: 380, p: 22, c: 14, f: 28 },
    { name: "Akara (3 pieces)", cal: 210, p: 10, c: 24, f: 8 },
  ],
  "Caribbean": [
    { name: "Rice and Peas (1 cup)", cal: 250, p: 8, c: 48, f: 3 },
    { name: "Jerk Chicken (100g)", cal: 210, p: 30, c: 4, f: 9 },
    { name: "Ackee and Saltfish", cal: 290, p: 24, c: 8, f: 18 },
    { name: "Roti (Caribbean, 1)", cal: 180, p: 5, c: 34, f: 3 },
    { name: "Callaloo (1 bowl)", cal: 80, p: 4, c: 10, f: 3 },
  ],
  "Mediterranean": [
    { name: "Hummus (100g)", cal: 170, p: 8, c: 14, f: 10 },
    { name: "Falafel (3 pieces)", cal: 180, p: 7, c: 22, f: 8 },
    { name: "Greek Salad (1 bowl)", cal: 160, p: 5, c: 12, f: 11 },
    { name: "Shawarma (1 wrap)", cal: 380, p: 28, c: 42, f: 12 },
    { name: "Tabbouleh (1 bowl)", cal: 120, p: 3, c: 18, f: 5 },
  ],
  "East Asian": [
    { name: "Steamed Rice (1 cup)", cal: 200, p: 4, c: 44, f: 0 },
    { name: "Miso Soup (1 bowl)", cal: 60, p: 4, c: 8, f: 2 },
    { name: "Tofu Stir Fry (1 bowl)", cal: 220, p: 14, c: 18, f: 10 },
    { name: "Kimchi (100g)", cal: 30, p: 2, c: 6, f: 0 },
    { name: "Ramen (1 bowl)", cal: 380, p: 18, c: 52, f: 10 },
  ],
};

const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const SUPPLEMENTS = [
  { name: "7 Chakra Complex", price: "$24.99", link: "/shop", benefit: "Daily Ayurvedic support" },
  { name: "Sugaverve", price: "$29.99", link: "/shop", benefit: "Blood sugar balance" },
  { name: "Krill Oil 500mg", price: "$19.99", link: "/shop", benefit: "Omega-3 heart health" },
  { name: "Vitamin B-12", price: "$8.99", link: "/shop", benefit: "Energy & metabolism" },
];

const RECIPES_BY_GOAL = {
  lose: [
    { name: "Masoor Dal Soup", cal: 180, p: 12, c: 28, f: 2, time: "20 min", tags: ["High Protein", "Low Fat"] },
    { name: "Tandoori Chicken Salad", cal: 220, p: 32, c: 8, f: 6, time: "25 min", tags: ["High Protein", "Low Carb"] },
    { name: "Vegetable Khichdi", cal: 240, p: 10, c: 42, f: 4, time: "30 min", tags: ["Balanced", "Filling"] },
    { name: "Sprout Chaat Bowl", cal: 160, p: 10, c: 24, f: 2, time: "10 min", tags: ["High Fibre", "Low Cal"] },
  ],
  maintain: [
    { name: "Chicken Biryani (Light)", cal: 380, p: 28, c: 48, f: 8, time: "45 min", tags: ["Balanced", "Cultural"] },
    { name: "Paneer Tikka with Roti", cal: 420, p: 22, c: 46, f: 16, time: "30 min", tags: ["Vegetarian", "Complete"] },
    { name: "Dal Makhani with Rice", cal: 360, p: 16, c: 52, f: 10, time: "40 min", tags: ["Protein Rich", "Comfort"] },
    { name: "Grilled Fish Curry", cal: 340, p: 34, c: 18, f: 12, time: "35 min", tags: ["High Protein", "Omega-3"] },
  ],
  gain: [
    { name: "Mutton Curry with Naan", cal: 580, p: 42, c: 52, f: 20, time: "60 min", tags: ["High Protein", "Calorie Dense"] },
    { name: "Peanut Butter Paratha", cal: 480, p: 16, c: 58, f: 22, time: "20 min", tags: ["High Calorie", "Filling"] },
    { name: "Rajma Chawal (Double)", cal: 520, p: 24, c: 82, f: 8, time: "40 min", tags: ["Plant Protein", "Bulking"] },
    { name: "Egg Bhurji with Bread", cal: 440, p: 28, c: 38, f: 18, time: "15 min", tags: ["Quick", "High Protein"] },
  ],
};

export default function KurriculumTracker() {
  const [tab, setTab] = useState("calculator");
  const [culture, setCulture] = useState("South Asian");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("female");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState("maintain");
  const [calories, setCalories] = useState(null);
  const [protein, setProtein] = useState(null);
  const [carbs, setCarbs] = useState(null);
  const [fat, setFat] = useState(null);
  const [diary, setDiary] = useState({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMeal, setActiveMeal] = useState("Breakfast");
  const [calculated, setCalculated] = useState(false);

  const foods = CULTURAL_FOODS[culture] || CULTURAL_FOODS["South Asian"];
  const filtered = foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalEaten = Object.values(diary).flat().reduce((s, f) => ({ cal: s.cal + f.cal, p: s.p + f.p, c: s.c + f.c, fat: s.fat + f.f }), { cal: 0, p: 0, c: 0, fat: 0 });

  function calculate() {
    const h = (parseFloat(heightFt) * 12 + parseFloat(heightIn || 0)) * 2.54;
    const w = parseFloat(weight) * 0.453592;
    const a = parseFloat(age);
    if (!h || !w || !a) { alert("Please fill in all fields"); return; }
    const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = Math.round(bmr * activity);
    const cal = goal === "lose" ? tdee - 500 : goal === "gain" ? tdee + 300 : tdee;
    const prot = Math.round(w * (goal === "gain" ? 2.2 : 1.8));
    const carb = Math.round((cal * 0.45) / 4);
    const fat = Math.round((cal * 0.25) / 9);
    setCalories(cal); setProtein(prot); setCarbs(carb); setFat(fat);
    setCalculated(true);
    setTab("tracker");
  }

  function addFood(food) {
    setDiary(d => ({ ...d, [activeMeal]: [...d[activeMeal], food] }));
  }

  function removeFood(meal, idx) {
    setDiary(d => ({ ...d, [meal]: d[meal].filter((_, i) => i !== idx) }));
  }

  const pct = (val, max) => Math.min(100, Math.round((val / (max || 1)) * 100));

  const styles = {
    app: { fontFamily: "'Georgia', serif", background: COLORS.cream, minHeight: "100vh", color: COLORS.text },
    header: { background: COLORS.dark, color: "#fff", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: COLORS.gold, letterSpacing: 1 },
    nav: { display: "flex", gap: 4, padding: "0 24px", background: COLORS.dark, borderBottom: `2px solid ${COLORS.green}` },
    navBtn: (active) => ({ padding: "12px 20px", border: "none", background: "none", color: active ? COLORS.gold : "rgba(255,255,255,0.6)", fontFamily: "Georgia, serif", fontSize: 14, cursor: "pointer", borderBottom: active ? `2px solid ${COLORS.gold}` : "2px solid transparent", marginBottom: -2, fontWeight: active ? 700 : 400 }),
    container: { maxWidth: 800, margin: "0 auto", padding: "24px 16px" },
    card: { background: COLORS.card, borderRadius: 16, padding: 24, marginBottom: 20, border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    label: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 6, display: "block" },
    input: { width: "100%", padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 15, fontFamily: "Georgia, serif", background: "#fff", color: COLORS.text, outline: "none", boxSizing: "border-box" },
    select: { width: "100%", padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, fontFamily: "Georgia, serif", background: "#fff", color: COLORS.text, outline: "none", cursor: "pointer" },
    btn: { background: COLORS.green, color: "#fff", border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontFamily: "Georgia, serif", fontWeight: 700, cursor: "pointer", width: "100%" },
    goldBtn: { background: COLORS.gold, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontFamily: "Georgia, serif", fontWeight: 700, cursor: "pointer" },
    macroBar: (color) => ({ height: 8, borderRadius: 4, background: color, transition: "width 0.5s ease" }),
    tag: (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "20", color: color, marginRight: 4 }),
    sectionTitle: { fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.green, marginBottom: 16 },
  };

  const recipes = RECIPES_BY_GOAL[goal] || RECIPES_BY_GOAL.maintain;

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <a href="/" style={{ ...styles.logo, textDecoration: "none" }}>← Kurryculum</a>
        <div style={styles.logo}>Wellness Tracker</div>
        <a href="/shop" style={{ color: COLORS.gold, fontSize: 13, fontFamily: "Georgia, serif", textDecoration: "none" }}>Shop →</a>
      </div>

      <div style={styles.nav}>
        {[["calculator", "⚖ Calculator"], ["tracker", "📋 Food Diary"], ["recipes", "🍛 Recipes"], ["supplements", "💊 My Stack"]].map(([id, label]) => (
          <button key={id} style={styles.navBtn(tab === id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      <div style={styles.container}>

        {/* CALCULATOR TAB */}
        {tab === "calculator" && (
          <div>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Your Cultural Background</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
                {Object.keys(CULTURAL_FOODS).map(c => (
                  <button key={c} onClick={() => setCulture(c)} style={{ padding: "10px 8px", borderRadius: 10, border: `2px solid ${culture === c ? COLORS.green : COLORS.border}`, background: culture === c ? COLORS.green : "#fff", color: culture === c ? "#fff" : COLORS.text, fontSize: 13, fontFamily: "Georgia, serif", cursor: "pointer", fontWeight: culture === c ? 700 : 400, transition: "all 0.2s" }}>
                    {c}
                  </button>
                ))}
              </div>

              <div style={styles.sectionTitle}>Your Body</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={styles.label}>Age</label>
                  <input style={styles.input} type="number" placeholder="e.g. 30" value={age} onChange={e => setAge(e.target.value)} />
                </div>
                <div>
                  <label style={styles.label}>Sex</label>
                  <select style={styles.select} value={sex} onChange={e => setSex(e.target.value)}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Height (ft / in)</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input style={{ ...styles.input, width: "48%" }} type="number" placeholder="5" value={heightFt} onChange={e => setHeightFt(e.target.value)} />
                    <input style={{ ...styles.input, width: "48%" }} type="number" placeholder="6" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>feet &nbsp; inches</div>
                </div>
                <div>
                  <label style={styles.label}>Weight (lbs)</label>
                  <input style={styles.input} type="number" placeholder="e.g. 145" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={styles.label}>Activity Level</label>
                  <select style={styles.select} value={activity} onChange={e => setActivity(parseFloat(e.target.value))}>
                    <option value={1.2}>Sedentary (desk job)</option>
                    <option value={1.375}>Light (1-3x/week)</option>
                    <option value={1.55}>Moderate (3-5x/week)</option>
                    <option value={1.725}>Active (6-7x/week)</option>
                    <option value={1.9}>Very active (athlete)</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Your Goal</label>
                  <select style={styles.select} value={goal} onChange={e => setGoal(e.target.value)}>
                    <option value="lose">Lose weight (−500 cal)</option>
                    <option value="maintain">Maintain weight</option>
                    <option value="gain">Build muscle (+300 cal)</option>
                  </select>
                </div>
              </div>

              <button style={styles.btn} onClick={calculate}>Calculate My Plan →</button>
            </div>

            {calculated && calories && (
              <div style={styles.card}>
                <div style={styles.sectionTitle}>Your Daily Targets</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                  {[["Calories", calories, "kcal", COLORS.gold], ["Protein", protein, "g", COLORS.green], ["Carbs", carbs, "g", "#3b82f6"], ["Fat", fat, "g", "#f59e0b"]].map(([label, val, unit, color]) => (
                    <div key={label} style={{ background: color + "15", borderRadius: 12, padding: 16, textAlign: "center", border: `1px solid ${color}30` }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "Georgia, serif" }}>{val}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{label} {unit}</div>
                    </div>
                  ))}
                </div>
                <button style={{ ...styles.btn, background: COLORS.gold }} onClick={() => setTab("tracker")}>Start Tracking Today →</button>
              </div>
            )}
          </div>
        )}

        {/* FOOD DIARY TAB */}
        {tab === "tracker" && (
          <div>
            {calories && (
              <div style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={styles.sectionTitle}>Today's Progress</div>
                  <div style={{ fontSize: 13, color: COLORS.muted }}>{totalEaten.cal} / {calories} kcal</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                  {[["Protein", totalEaten.p, protein, COLORS.green], ["Carbs", totalEaten.c, carbs, "#3b82f6"], ["Fat", totalEaten.fat, fat, "#f59e0b"]].map(([label, val, max, color]) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: COLORS.muted }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color }}>{val}g / {max}g</span>
                      </div>
                      <div style={{ background: "#f0f0f0", borderRadius: 4, height: 8 }}>
                        <div style={{ ...styles.macroBar(color), width: `${pct(val, max)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: COLORS.cream, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>Remaining</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.green, fontFamily: "Georgia, serif" }}>{Math.max(0, calories - totalEaten.cal)} kcal</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>Eaten</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.gold, fontFamily: "Georgia, serif" }}>{totalEaten.cal} kcal</div>
                  </div>
                </div>
              </div>
            )}

            {!calories && (
              <div style={{ ...styles.card, textAlign: "center", padding: 32 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Set your calorie target first</div>
                <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 16 }}>Use the Calculator tab to get your personalised daily targets</div>
                <button style={{ ...styles.btn, width: "auto", padding: "10px 24px" }} onClick={() => setTab("calculator")}>Go to Calculator</button>
              </div>
            )}

            <div style={styles.card}>
              <div style={styles.sectionTitle}>Add Food</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {MEALS.map(m => (
                  <button key={m} onClick={() => setActiveMeal(m)} style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${activeMeal === m ? COLORS.green : COLORS.border}`, background: activeMeal === m ? COLORS.green : "#fff", color: activeMeal === m ? "#fff" : COLORS.text, fontSize: 13, fontFamily: "Georgia, serif", cursor: "pointer", fontWeight: activeMeal === m ? 700 : 400 }}>
                    {m}
                  </button>
                ))}
              </div>
              <input style={{ ...styles.input, marginBottom: 12 }} placeholder={`Search ${culture} foods...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                {filtered.map((food, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{food.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{food.cal} kcal · P:{food.p}g · C:{food.c}g · F:{food.f}g</div>
                    </div>
                    <button onClick={() => addFood(food)} style={{ ...styles.goldBtn, padding: "6px 14px", fontSize: 12 }}>+ Add</button>
                  </div>
                ))}
              </div>
            </div>

            {MEALS.map(meal => diary[meal].length > 0 && (
              <div key={meal} style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>{meal}</div>
                  <div style={{ fontSize: 13, color: COLORS.muted }}>{diary[meal].reduce((s, f) => s + f.cal, 0)} kcal</div>
                </div>
                {diary[meal].map((food, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{food.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{food.cal} kcal · P:{food.p}g C:{food.c}g F:{food.f}g</div>
                    </div>
                    <button onClick={() => removeFood(meal, i)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 18 }}>×</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* RECIPES TAB */}
        {tab === "recipes" && (
          <div>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Recipes for Your Goal</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {[["lose", "🔥 Lose Weight"], ["maintain", "⚖ Maintain"], ["gain", "💪 Build Muscle"]].map(([g, label]) => (
                  <button key={g} onClick={() => setGoal(g)} style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${goal === g ? COLORS.green : COLORS.border}`, background: goal === g ? COLORS.green : "#fff", color: goal === g ? "#fff" : COLORS.text, fontSize: 13, fontFamily: "Georgia, serif", cursor: "pointer", fontWeight: goal === g ? 700 : 400 }}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {recipes.map((r, i) => (
                  <div key={i} style={{ background: COLORS.cream, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, fontFamily: "Georgia, serif" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>⏱ {r.time}</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                      {r.tags.map(t => <span key={t} style={styles.tag(COLORS.green)}>{t}</span>)}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 12 }}>
                      {[["Cal", r.cal, COLORS.gold], ["P", `${r.p}g`, COLORS.green], ["C", `${r.c}g`, "#3b82f6"], ["F", `${r.f}g`, "#f59e0b"]].map(([l, v, c]) => (
                        <div key={l} style={{ textAlign: "center", background: c + "15", borderRadius: 6, padding: "4px 2px" }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: c }}>{v}</div>
                          <div style={{ fontSize: 10, color: COLORS.muted }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addFood({ name: r.name, cal: r.cal, p: r.p, c: r.c, f: r.f })} style={{ ...styles.goldBtn, width: "100%", textAlign: "center" }}>Add to Diary</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUPPLEMENTS TAB */}
        {tab === "supplements" && (
          <div>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Your Recommended Stack</div>
              <div style={{ background: COLORS.dark, borderRadius: 12, padding: "14px 18px", marginBottom: 20, color: "#fff" }}>
                <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Based on your goal: {goal === "lose" ? "Weight Loss" : goal === "gain" ? "Muscle Building" : "Maintenance"}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.gold }}>Pharmacist-curated for {culture} diets</div>
              </div>
              {SUPPLEMENTS.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, background: COLORS.green + "20", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💊</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: 13, color: COLORS.muted }}>{s.benefit}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.green, marginBottom: 6 }}>{s.price}</div>
                    <a href={s.link} style={{ ...styles.goldBtn, textDecoration: "none", display: "inline-block", fontSize: 12 }}>Buy →</a>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20 }}>
                <a href="/supplement-quiz" style={{ ...styles.btn, display: "block", textAlign: "center", textDecoration: "none" }}>Take the Full Supplement Quiz →</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
