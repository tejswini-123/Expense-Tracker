
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

    const cleanEmail = email.trim().toLowerCase();

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
      name,
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

    alert("Monthly budget updated successfully!");
  }

  // ADD EXPENSE
  function addExpense(e) {
    e.preventDefault();

    const newExpense = {
      id: Date.now(),
      title,
      amount: Number(amount),
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

      {/* MINIMAL MONTHLY BUDGET SECTION */}
      <div className="content-card">
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
            Save Budget
          </button>
        </form>
      </div>

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
function AdminDashboard({ users, expenses }) {
  const total = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

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

        {expenses.map(e => (
          <ExpenseItem
            key={e.id}
            expense={e}
            onDelete={() => {}}
          />
        ))}
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
