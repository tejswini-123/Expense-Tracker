/* ========================= 
   SIGNUP 
========================= */ 
 
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character];
    });
}

function signup(event) { 
 
    event.preventDefault(); 
 
    let name = document.getElementById("name").value.trim(); 
    let email = document.getElementById("email").value.trim().toLowerCase(); 
    let password = document.getElementById("password").value; 
 
    if (!name) {
        alert("Please enter your name.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    if (email === "admin@gmail.com") {
        alert("This email is reserved for Admin.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || []; 
 
    let existingUser = users.find(function(user) { 
        return String(user.email).trim().toLowerCase() === email; 
    }); 
 
    if (existingUser) { 
        alert("Email already registered!"); 
        return; 
    } 
 
    let newUser = { 
        name: name, 
        email: email, 
        password: password, 
        role: "user" 
    }; 
 
    users.push(newUser); 
 
    localStorage.setItem("users", JSON.stringify(users)); 
 
    alert("Signup successful!"); 
 
    window.location.href = "login.html"; 
} 
 
 
/* ========================= 
   LOGIN 
========================= */ 
 
function login(event) { 
 
    event.preventDefault(); 
 
    let email = document.getElementById("loginEmail").value.trim().toLowerCase(); 
    let password = document.getElementById("loginPassword").value; 
 
    /* Admin login */ 
 
    if (email === "admin@gmail.com" && password === "admin123") { 
 
        localStorage.setItem("currentUser", "admin"); 
 
        window.location.href = "admin.html"; 
 
        return; 
    } 
 
    /* User login */ 
 
    let users = JSON.parse(localStorage.getItem("users")) || []; 
 
    let user = users.find(function(user) { 
 
        return String(user.email).trim().toLowerCase() === email && 
               user.password === password; 
 
    }); 
 
    if (user) { 
 
        localStorage.setItem( 
            "currentUser", 
            JSON.stringify(user) 
        ); 
 
        window.location.href = "user.html"; 
 
    } else { 
 
        alert("Invalid email or password!"); 
 
    } 
} 
 
 
/* ========================= 
   LOGOUT 
========================= */ 
 
function logout() { 
 
    localStorage.removeItem("currentUser"); 
 
    window.location.href = "login.html"; 
} 
 
 
/* ========================= 
   USER DASHBOARD 
========================= */ 
 
if (window.location.pathname.includes("user.html")) { 
 
    let currentUser = 
        JSON.parse(localStorage.getItem("currentUser")); 
 
    if (!currentUser) { 
 
        window.location.href = "login.html"; 
 
    } else { 
 
        document.getElementById("welcomeUser").innerText = 
            "Hi, " + currentUser.name; 
 
        showUserExpenses(); 
    } 
} 
 
 
/* ========================= 
   ADD EXPENSE 
========================= */ 
 
function addExpense() { 
 
    let title = prompt("Enter expense name:"); 

    if (title === null) {
        return;
    }

    title = title.trim();
 
    if (!title) { 
        alert("Please enter an expense name.");
        return; 
    } 
 
    let amount = prompt("Enter amount:"); 
    let numericAmount = Number(amount);
 
    if (
        amount === null ||
        !amount.trim() ||
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
    ) {
 
        alert("Please enter an amount greater than zero."); 
        return; 
 
    } 
 
    let category = prompt( 
        "Enter category: Food / Travel / Education / Shopping" 
    ); 

    if (category === null || !category.trim()) {
        alert("Please enter an expense category.");
        return;
    }

    category = category.trim();
 
    let currentUser = 
        JSON.parse(localStorage.getItem("currentUser")); 
 
    let expenses = 
        JSON.parse(localStorage.getItem("expenses")) || []; 
 
    let expense = { 
 
        title: title, 
        amount: numericAmount, 
        category: category, 
        user: currentUser.email, 
        date: new Date().toLocaleDateString() 
 
    }; 
 
    expenses.push(expense); 
 
    localStorage.setItem( 
        "expenses", 
        JSON.stringify(expenses) 
    ); 
 
    alert("Expense added successfully!"); 
 
    location.reload(); 
} 
 
 
/* ========================= 
   SHOW USER EXPENSES 
========================= */ 
 
function showUserExpenses() { 
 
    let currentUser = 
        JSON.parse(localStorage.getItem("currentUser")); 
 
    let expenses = 
        JSON.parse(localStorage.getItem("expenses")) || []; 
 
    let myExpenses = expenses.filter(function(expense) { 
 
        return expense.user === currentUser.email; 
 
    }); 
 
    let total = 0; 
 
    myExpenses.forEach(function(expense) { 
 
        total += expense.amount; 
 
    }); 
 
    let totalElement = 
        document.getElementById("totalExpense"); 
 
    let countElement = 
        document.getElementById("expenseCount"); 
 
    let remainingElement = 
        document.getElementById("remaining"); 
 
    if (totalElement) { 
 
        totalElement.innerText = 
            "₹" + total; 
 
    } 
 
    if (countElement) { 
 
        countElement.innerText = 
            myExpenses.length; 
 
    } 
 
    if (remainingElement) { 
 
        remainingElement.innerText = 
            "₹" + (10000 - total); 
 
    } 
 
    let list = 
        document.getElementById("expenseList"); 
 
    if (!list) { 
        return; 
    } 
 
    if (myExpenses.length === 0) { 
 
        list.innerHTML = 
            "<p>No expenses added yet. Click Add Expense!</p>"; 
 
        return; 
 
    } 
 
    list.innerHTML = ""; 
 
    myExpenses.forEach(function(expense) { 
 
        list.innerHTML += ` 
 
            <div class="expense-item"> 
 
                <div class="expense-left"> 
 
                    <div class="expense-icon"> 
                        💰 
                    </div> 
 
                    <div> 
                        <b>${escapeHTML(expense.title)}</b> 
                        <br> 
                        <small> 
                            ${escapeHTML(expense.category)} 
                            • 
                            ${escapeHTML(expense.date)} 
                        </small> 
                    </div> 
 
                </div> 
 
                <div class="amount"> 
                    ₹${escapeHTML(expense.amount)} 
                </div> 
 
            </div> 
 
        `; 
 
    }); 
} 
 
 
/* ========================= 
   VIEW EXPENSES 
========================= */ 
 
function showExpenses() { 
 
    alert("Your expenses are displayed on the dashboard."); 
 
} 
 
 
/* ========================= 
   ADMIN DASHBOARD 
========================= */ 
 
if (window.location.pathname.includes("admin.html")) { 
 
    let currentUser = 
        localStorage.getItem("currentUser"); 
 
    if (currentUser !== "admin") { 
 
        window.location.href = "login.html"; 
 
    } else { 
 
        showAdminData(); 
 
    } 
} 
 
 
/* ========================= 
   ADMIN DATA 
========================= */ 
 
function showAdminData() { 
 
    let users = 
        JSON.parse(localStorage.getItem("users")) || []; 
 
    let expenses = 
        JSON.parse(localStorage.getItem("expenses")) || []; 
 
    let userCount = 
        document.getElementById("userCount"); 
 
    let expenseCount = 
        document.getElementById("adminExpenseCount"); 
 
    let totalAmount = 
        document.getElementById("adminTotal"); 
 
    if (userCount) { 
 
        userCount.innerText = 
            users.length; 
 
    } 
 
    if (expenseCount) { 
 
        expenseCount.innerText = 
            expenses.length; 
 
    } 
 
    let total = 0; 
 
    expenses.forEach(function(expense) { 
 
        total += expense.amount; 
 
    }); 
 
    if (totalAmount) { 
 
        totalAmount.innerText = 
            "₹" + total; 
 
    } 
 
    showUsers(users); 
 
    showAllExpenses(expenses); 
} 
 
 
/* ========================= 
   SHOW USERS TO ADMIN 
========================= */ 
 
function showUsers(users) { 
 
    let table = 
        document.getElementById("userTable"); 
 
    if (!table) { 
        return; 
    } 
 
    if (users.length === 0) { 
 
        table.innerHTML = 
            "<p>No registered users.</p>"; 
 
        return; 
 
    } 
 
    let html = ` 
 
        <table class="simple-table"> 
 
            <tr> 
                <th>Name</th> 
                <th>Email</th> 
                <th>Role</th> 
            </tr> 
 
    `; 
 
    users.forEach(function(user) { 
 
        html += ` 
 
            <tr> 
                <td>${escapeHTML(user.name)}</td> 
                <td>${escapeHTML(user.email)}</td> 
                <td>${escapeHTML(user.role)}</td> 
            </tr> 
 
        `; 
 
    }); 
 
    html += "</table>"; 
 
    table.innerHTML = html; 
} 
 
 
/* ========================= 
   SHOW ALL EXPENSES 
========================= */ 
 
function showAllExpenses(expenses) { 
 
    let list = 
        document.getElementById("adminExpenseList"); 
 
    if (!list) { 
        return; 
    } 
 
    if (expenses.length === 0) { 
 
        list.innerHTML = 
            "<p>No expense records available.</p>"; 
 
        return; 
 
    } 
 
    let html = ` 
 
        <table class="simple-table"> 
 
            <tr> 
                <th>Title</th> 
                <th>Category</th> 
                <th>Amount</th> 
                <th>User</th> 
            </tr> 
 
    `; 
 
    expenses.forEach(function(expense) { 
 
        html += ` 
 
            <tr> 
 
                <td>${escapeHTML(expense.title)}</td> 
 
                <td>${escapeHTML(expense.category)}</td> 
 
                <td>₹${escapeHTML(expense.amount)}</td> 
 
                <td>${escapeHTML(expense.user)}</td> 
 
            </tr> 
 
        `; 
 
    }); 
 
    html += "</table>"; 
 
    list.innerHTML = html; 
}