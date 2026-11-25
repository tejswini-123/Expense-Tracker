import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";

// NAVBAR
function Navbar({ user, logout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        💰 KL Expense Tracker
      </Link>

      <div>
        {user ? (
          <>
            <span>{user.name}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// HOME PAGE
function Home() {
  return (
    <section className="hero">
      <div>
        <h1>Take Control of Your Expenses</h1>
        <p>Track your daily expenses, save money and plan better.</p>
        <Link to="/signup" className="main-btn">
          Get Started
        </Link>
      </div>

      <div className="hero-image">
        <img src="/logo.png" alt="KL Expense Tracker" />
      </div>
    </section>
  );
}

// SIGNUP
function Signup({ users, setUsers }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignup(e) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      alert("Please enter your name.");
      return;
    }

    if (cleanEmail === "admin@gmail.com") {
      alert("This email is reserved for Admin.");
      return;
    }

    if (users.some(u => u.email === cleanEmail)) {
      alert("Email already registered!");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      password,
      role: "user"
    };

    setUsers(prev => [...prev, newUser]);

    alert("Registration successful!");
    navigate("/login");
  }

  return (
    <div className="form-page">
      <form className="form-box" onSubmit={handleSignup}>
        <h1>Create Account</h1>
        <p>Register to manage your expenses</p>

        <input
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (minimum 6 characters)"
          minLength="6"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="main-btn">Signup</button>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

// LOGIN
function Login({ users, setCurrentUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (
      cleanEmail === "admin@gmail.com" &&
      password === "admin123"
    ) {
      setCurrentUser({
        name: "Administrator",
        email: cleanEmail,
        role: "admin"
      });

      navigate("/admin");
      return;
    }

    const user = users.find(
      u => u.email === cleanEmail && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      navigate("/user");
    } else {
      alert("Invalid email or password!");
    }
  }

  return (
    <div className="form-page">
      <form className="form-box" onSubmit={handleLogin}>
        <h1>Welcome Back!</h1>
        <p>Login to your account</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="main-btn">Login</button>

        <p>Admin: admin@gmail.com</p>
        <p>Password: admin123</p>

        <p>
          New user? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}

// DASHBOARD STAT CARD
function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <h2>{icon}</h2>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

// EXPENSE ITEM
function ExpenseItem({ expense, onDelete }) {
  return (
    <div className="expense-item">
      <div>
        <b>{expense.title}</b>
        <p>{expense.category} | {expense.date}</p>
      </div>

      <div>
        <b>₹{expense.amount}</b>
        <button onClick={() => onDelete(expense.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}


// AI-BASED PERSONAL FINANCE ADVISOR
// Rule-based spending analysis using the user's saved expense data.
function PersonalFinanceAdvisor({ expenses, budget }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Expenses are saved using the browser's local date format (DD/MM/YYYY in India).
  function parseExpenseDate(value) {
    if (!value) return null;
    const parts = String(value).split(/[/-]/);

    if (parts.length === 3) {
      const first = Number(parts[0]);
      const second = Number(parts[1]);
      const year = Number(parts[2]);

      if (year > 999) {
        // The app is used with Indian date formatting: DD/MM/YYYY.
        if (first > 0 && first <= 31 && second > 0 && second <= 12) {
          return new Date(year, second - 1, first);
        }
        if (first > 0 && first <= 12 && second > 12) {
          return new Date(year, first - 1, second);
        }
      }
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const thisMonthExpenses = expenses.filter((expense) => {
    const date = parseExpenseDate(expense.date);
    return date &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear;
  });

  const previousMonthExpenses = expenses.filter((expense) => {
    const date = parseExpenseDate(expense.date);
    const previousMonth = new Date(currentYear, currentMonth - 1, 1);
    return date &&
      date.getMonth() === previousMonth.getMonth() &&
      date.getFullYear() === previousMonth.getFullYear();
  });

  const getTotal = (items) =>
    items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const monthlyTotal = getTotal(thisMonthExpenses);
  const previousTotal = getTotal(previousMonthExpenses);
  const monthlyBudget = Number(budget) || 0;
  const budgetUsed = monthlyBudget > 0
    ? (monthlyTotal / monthlyBudget) * 100
    : 0;

  const categoryTotals = thisMonthExpenses.reduce((result, expense) => {
    const category = expense.category || "Others";
    result[category] = (result[category] || 0) + Number(expense.amount || 0);
    return result;
  }, {});

  const categoryEntries = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  const highestCategory = categoryEntries[0];
  const categoryCounts = thisMonthExpenses.reduce((result, expense) => {
    const category = expense.category || "Others";
    result[category] = (result[category] || 0) + 1;
    return result;
  }, {});

  const unusualExpenses = thisMonthExpenses.filter((expense) => {
    const category = expense.category || "Others";
    const average = categoryTotals[category] / (categoryCounts[category] || 1);
    return Number(expense.amount) > average * 1.8 && Number(expense.amount) >= 500;
  });

  const daysPassed = today.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const predictedTotal = daysPassed > 0
    ? (monthlyTotal / daysPassed) * daysInMonth
    : 0;

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2
    })}`;

  const suggestions = [];
  if (highestCategory && monthlyTotal > 0) {
    suggestions.push(
      `Your highest spending is in ${highestCategory[0]}. Review these purchases and set a smaller limit for this category.`
    );
  }
  if (monthlyBudget > 0 && budgetUsed >= 80) {
    suggestions.push(
      "You have used at least 80% of your monthly budget. Pause non-essential purchases until your next budget review."
    );
  } else if (monthlyBudget > 0 && budgetUsed < 50) {
    suggestions.push(
      "Your spending is currently below half of your budget. Continue tracking expenses and move any genuine surplus into savings."
    );
  }
  if (unusualExpenses.length > 0) {
    suggestions.push(
      "Check the unusually large expense entries below and confirm that they are necessary and recorded correctly."
    );
  }
  if (suggestions.length === 0) {
    suggestions.push(
      "Add expenses regularly to receive more useful spending insights and saving suggestions."
    );
  }

  const budgetWarning = monthlyBudget > 0 && (
    monthlyTotal > monthlyBudget || predictedTotal > monthlyBudget
  );

  return (
    <section className="finance-advisor">
      <div className="advisor-heading">
        <div>
          <h2>🤖 AI-Based Personal Finance Advisor</h2>
          <p className="advisor-subtitle">
            Smart spending analysis and personalized saving suggestions based on your recorded expenses.
          </p>
        </div>
        <span className="advisor-tag">SMART ANALYSIS</span>
      </div>

      <div className="advisor-stats">
        <div className="advisor-stat">
          <span>📊 This Month's Spending</span>
          <strong>{formatAmount(monthlyTotal)}</strong>
          <small>{thisMonthExpenses.length} expense records</small>
        </div>
        <div className="advisor-stat">
          <span>🏆 Highest Spending Category</span>
          <strong>{highestCategory ? highestCategory[0] : "No data yet"}</strong>
          <small>{highestCategory ? formatAmount(highestCategory[1]) : "Add an expense to begin"}</small>
        </div>
        <div className="advisor-stat">
          <span>🔮 Estimated Month-End Spending</span>
          <strong>{formatAmount(predictedTotal)}</strong>
          <small>Based on your average daily spending</small>
        </div>
        <div className="advisor-stat">
          <span>📅 Previous Month</span>
          <strong>{formatAmount(previousTotal)}</strong>
          <small>
            {monthlyTotal > previousTotal
              ? "Current month is higher so far"
              : monthlyTotal < previousTotal
                ? "Current month is lower so far"
                : "Same spending amount"}
          </small>
        </div>
      </div>

      <div className="advisor-columns">
        <div className="advisor-panel">
          <h3>📂 Category-wise Spending</h3>
          {categoryEntries.length === 0 ? (
            <p className="advisor-empty">No expenses recorded this month yet.</p>
          ) : (
            categoryEntries.map(([category, amount]) => (
              <div className="category-row" key={category}>
                <div className="category-label">
                  <span>{category}</span>
                  <b>{formatAmount(amount)}</b>
                </div>
                <div className="category-track">
                  <div
                    className="category-fill"
                    style={{
                      width: `${monthlyTotal > 0 ? (amount / monthlyTotal) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="advisor-panel">
          <h3>💡 Personalized Saving Suggestions</h3>
          {suggestions.map((suggestion, index) => (
            <p className="suggestion-item" key={index}>
              <span>✓</span>{suggestion}
            </p>
          ))}
        </div>
      </div>

      {monthlyBudget > 0 && (
        <div className={`advisor-alert ${budgetWarning ? "advisor-alert-warning" : "advisor-alert-good"}`}>
          {monthlyTotal > monthlyBudget
            ? `🚨 You have exceeded your budget by ${formatAmount(monthlyTotal - monthlyBudget)}. Reduce non-essential spending.`
            : predictedTotal > monthlyBudget
              ? `⚠️ Based on your current spending rate, you may exceed your budget by ${formatAmount(predictedTotal - monthlyBudget)}.`
              : `✅ Your current spending is within your monthly budget. You have ${formatAmount(monthlyBudget - monthlyTotal)} remaining.`}
          <div className="advisor-budget-track">
            <div
              className="advisor-budget-fill"
              style={{ width: `${Math.min(Math.max(budgetUsed, 0), 100)}%` }}
            />
          </div>
          <small>Budget used: {budgetUsed.toFixed(1)}%</small>
        </div>
      )}

      <div className="advisor-panel advisor-unusual">
        <h3>🚨 Unusual Spending Detection</h3>
        {unusualExpenses.length === 0 ? (
          <p className="advisor-empty">No unusually high expense entries detected this month.</p>
        ) : (
          unusualExpenses.map((expense) => (
            <div className="unusual-item" key={expense.id}>
              <span>{expense.title} · {expense.category}</span>
              <b>{formatAmount(expense.amount)}</b>
            </div>
          ))
        )}
        <small className="advisor-note">
          Detection is based on expense amounts compared with the average in the same category.
        </small>
      </div>
    </section>
  );
}

// USER DASHBOARD
function UserDashboard({
  user,
  expenses,
  setExpenses,
  budgets,
  setBudgets
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  // Get this user's saved budget
  const savedBudget = budgets[user.email];
  const hasBudget = savedBudget !== undefined;
  const budget = hasBudget ? Number(savedBudget) : 0;

  const [budgetInput, setBudgetInput] = useState(
    hasBudget ? String(savedBudget) : ""
  );

  // Controls whether the user is editing the monthly budget
  const [isEditingBudget, setIsEditingBudget] = useState(!hasBudget);

  // Get only the logged-in user's expenses
  const myExpenses = expenses.filter(
    e => e.user === user.email
  );

  // Calculate total expenses
  const total = myExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // Calculate remaining budget
  const remaining = budget - total;

  // SAVE MONTHLY BUDGET
  function saveBudget(e) {
    e.preventDefault();

    const newBudget = Number(budgetInput);

    if (
      budgetInput.trim() === "" ||
      !Number.isFinite(newBudget) ||
      newBudget <= 0
    ) {
      alert("Please enter a valid budget greater than zero!");
      return;
    }

    // Save budget separately for this user's email
    setBudgets(prev => ({
      ...prev,
      [user.email]: newBudget
    }));

    setIsEditingBudget(false);
    alert("Monthly budget updated successfully!");
  }

  // ADD EXPENSE
  function addExpense(e) {
    e.preventDefault();

    const cleanTitle = title.trim();
    const cleanAmount = Number(amount);

    if (
      !cleanTitle ||
      !Number.isFinite(cleanAmount) ||
      cleanAmount <= 0
    ) {
      alert("Enter an expense name and an amount greater than zero.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: cleanTitle,
      amount: cleanAmount,
      category,
      user: user.email,
      date: new Date().toLocaleDateString()
    };

    setExpenses(prev => [...prev, newExpense]);

    setTitle("");
    setAmount("");
    setCategory("Food");

    alert("Expense added successfully!");
  }

  // DELETE EXPENSE
  function deleteExpense(id) {
    setExpenses(prev =>
      prev.filter(e => e.id !== id)
    );
  }

  return (
    <main className="dashboard">
      <h1>My Dashboard 👋</h1>
      <p>Welcome, {user.name}!</p>

      {/* DASHBOARD STATISTICS */}
      <div className="stats">
        <StatCard
          title="Total Expenses"
          value={`₹${total.toLocaleString("en-IN")}`}
          icon="💰"
        />

        <StatCard
          title="Number of Expenses"
          value={myExpenses.length}
          icon="📅"
        />

        <StatCard
          title="Monthly Budget"
          value={
            hasBudget
              ? `₹${budget.toLocaleString("en-IN")}`
              : "Not Set"
          }
          icon="🎯"
        />

        <StatCard
          title="Remaining"
          value={
            hasBudget
              ? `₹${remaining.toLocaleString("en-IN")}`
              : "Set Budget First"
          }
          icon="💵"
        />
      </div>

      {/* MONTHLY BUDGET SECTION */}
      <div className="content-card">
        {!isEditingBudget && hasBudget ? (
          <div>
            <h2>Monthly Budget</h2>
            <h1>₹{budget.toLocaleString("en-IN")}</h1>
            <p>Your current monthly budget</p>

            <button
              className="main-btn"
              type="button"
              onClick={() => {
                setBudgetInput(String(budget));
                setIsEditingBudget(true);
              }}
            >
              ✏️ Edit Budget
            </button>
          </div>
        ) : (
          <div>
            <h2>{hasBudget ? "Edit Monthly Budget" : "Set Monthly Budget"}</h2>

            <form onSubmit={saveBudget} className="expense-form">
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter Your Monthly Budget (₹)"
                value={budgetInput}
                onChange={e => setBudgetInput(e.target.value)}
                required
              />

              <button className="main-btn" type="submit">
                {hasBudget ? "Update Budget" : "Save Budget"}
              </button>

              {hasBudget && (
                <button
                  type="button"
                  className="logout-btn"
                  onClick={() => {
                    setBudgetInput(String(budget));
                    setIsEditingBudget(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* PERSONAL FINANCE ADVISOR */}
      <PersonalFinanceAdvisor
        expenses={myExpenses}
        budget={budget}
      />

      {/* ADD NEW EXPENSE */}
      <div className="content-card">
        <h2>+ Add New Expense</h2>

        <form onSubmit={addExpense} className="expense-form">
          <input
            placeholder="Expense Name"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Education</option>
            <option>Shopping</option>
            <option>Others</option>
          </select>

          <button className="main-btn">
            Add Expense
          </button>
        </form>
      </div>

      {/* RECENT EXPENSES */}
      <div className="content-card">
        <h2>My Recent Expenses</h2>

        {myExpenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          myExpenses.map(expense => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onDelete={deleteExpense}
            />
          ))
        )}
      </div>
    </main>
  );
}

// ADMIN DASHBOARD
function AdminDashboard({ users, expenses, setExpenses }) {
  const total = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  function deleteExpense(id) {
    if (!window.confirm("Delete this expense? This cannot be undone.")) {
      return;
    }

    setExpenses(prev => prev.filter(expense => expense.id !== id));
  }

  return (
    <main className="dashboard">
      <h1>Admin Dashboard ⚡</h1>
      <p>Manage users and monitor expenses.</p>

      <div className="stats">
        <StatCard
          title="Registered Users"
          value={users.length}
          icon="👥"
        />

        <StatCard
          title="Total Expenses"
          value={expenses.length}
          icon="🧾"
        />

        <StatCard
          title="Total Amount"
          value={`₹${total}`}
          icon="💰"
        />
      </div>

      <div className="content-card">
        <h2>Registered Users</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="content-card">
        <h2>All Expenses</h2>

        {expenses.length === 0 ? (
          <p>No expenses have been added.</p>
        ) : (
          expenses.map(expense => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onDelete={deleteExpense}
            />
          ))
        )}
      </div>
    </main>
  );
}

// PROTECTED ROUTE
function ProtectedRoute({ user, role, children }) {
  if (!user) return <Navigate to="/login" />;

  if (user.role !== role) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/user"}
      />
    );
  }

  return children;
}

// MAIN APP
export default function App() {
  const [users, setUsers] = useState(
    () => JSON.parse(localStorage.getItem("users") || "[]")
  );

  const [expenses, setExpenses] = useState(
    () => JSON.parse(localStorage.getItem("expenses") || "[]")
  );

  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser") || "null")
  );

  // Store separate budgets for every user
  const [budgets, setBudgets] = useState(
    () => JSON.parse(localStorage.getItem("budgets") || "{}")
  );

  // SAVE USERS
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // SAVE EXPENSES
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // SAVE CURRENT USER
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // SAVE ALL USER BUDGETS
  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  function logout() {
    setCurrentUser(null);
  }

  return (
    <>
      <Navbar user={currentUser} logout={logout} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={
            <Signup
              users={users}
              setUsers={setUsers}
            />
          }
        />

        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate
                to={
                  currentUser.role === "admin"
                    ? "/admin"
                    : "/user"
                }
              />
            ) : (
              <Login
                users={users}
                setCurrentUser={setCurrentUser}
              />
            )
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute user={currentUser} role="user">
              <UserDashboard
                user={currentUser}
                expenses={expenses}
                setExpenses={setExpenses}
                budgets={budgets}
                setBudgets={setBudgets}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute user={currentUser} role="admin">
              <AdminDashboard
                users={users}
                expenses={expenses}
                setExpenses={setExpenses}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<h1>404 - Page Not Found</h1>}
        />
      </Routes>
    </>
  );
}
