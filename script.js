// Enhanced Sample Data
const users = [
    { id: '1', name: 'Admin', email: 'admin@library.com', role: 'admin', password: 'admin123' },
    { id: '2', name: 'John Doe', email: 'john@university.edu', role: 'student', password: 'student123' },
    { id: '3', name: 'Prof. Smith', email: 'smith@university.edu', role: 'professor', password: 'prof123' }
  ];
  
  const books = [
    { id: '1', title: 'GATE Computer Science Guide', author: 'XYZ Publications', isbn: '9781234567890', available: true, category: 'exam' },
    { id: '2', title: 'CAT Quantitative Aptitude', author: 'ABC Publishers', isbn: '9780987654321', available: true, category: 'exam' },
    { id: '3', title: 'National Geographic - Jan 2023', author: 'National Geographic', isbn: '9785555555555', available: true, category: 'magazine' },
    { id: '4', title: 'TIME Magazine - Feb 2023', author: 'TIME Inc.', isbn: '9786666666666', available: true, category: 'magazine' },
    { id: '5', title: 'Data Structures & Algorithms', author: 'Jane Smith', isbn: '9781111111111', available: true, category: 'academic' },
    { id: '6', title: 'GRE Official Guide', author: 'ETS', isbn: '9782222222222', available: true, category: 'exam' },
    { id: '7', title: 'The Economist - Mar 2023', author: 'The Economist', isbn: '9787777777777', available: true, category: 'magazine' },
    { id: '8', title: 'Computer Networks', author: 'Andrew Tanenbaum', isbn: '9783333333333', available: true, category: 'academic' }
  ];
  
  const transactions = [];
  
  // App State
  let currentUser = null;
  
  // DOM Elements
  const app = document.getElementById('app');
  
  // Helper Functions
  function getCategoryClass(category) {
    switch(category) {
      case 'exam': return 'category-exam';
      case 'magazine': return 'category-magazine';
      default: return 'category-academic';
    }
  }
  
  function getCategoryName(category) {
    switch(category) {
      case 'exam': return 'Exam Prep';
      case 'magazine': return 'Magazine';
      default: return 'Academic';
    }
  }
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  // Render Functions
  function renderLogin() {
    app.innerHTML = `
      <div class="auth-container">
        <div class="card">
          <h2 class="auth-title">📚 Library Login</h2>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" class="form-control" placeholder="Enter your email">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control" placeholder="Enter your password">
          </div>
          <button id="loginBtn" class="btn btn-primary w-100">Login</button>
          <div class="auth-footer">
            <button id="showRegisterBtn" class="btn btn-outline">Register</button>
          </div>
        </div>
      </div>
    `;
  
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('showRegisterBtn').addEventListener('click', renderRegister);
  }
  
  function renderRegister() {
    app.innerHTML = `
      <div class="auth-container">
        <div class="card">
          <h2 class="auth-title">📝 Register</h2>
          <div class="form-group">
            <label for="regName">Name</label>
            <input type="text" id="regName" class="form-control" placeholder="Your name">
          </div>
          <div class="form-group">
            <label for="regEmail">Email</label>
            <input type="email" id="regEmail" class="form-control" placeholder="Your email">
          </div>
          <div class="form-group">
            <label for="regPassword">Password</label>
            <input type="password" id="regPassword" class="form-control" placeholder="Your password">
          </div>
          <div class="form-group">
            <label for="regRole">Role</label>
            <select id="regRole" class="form-control">
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>
          <button id="registerBtn" class="btn btn-primary w-100">Register</button>
          <div class="auth-footer">
            <button id="showLoginBtn" class="btn btn-outline">Back to Login</button>
          </div>
        </div>
      </div>
    `;
  
    document.getElementById('registerBtn').addEventListener('click', handleRegister);
    document.getElementById('showLoginBtn').addEventListener('click', renderLogin);
  }
  
  function renderBookRow(book) {
    const categoryClass = getCategoryClass(book.category);
    const categoryName = getCategoryName(book.category);
    
    return `
      <tr>
        <td>
          <div class="font-medium">${book.title}</div>
          <div class="text-sm text-gray-500">${book.author}</div>
          <span class="${categoryClass} category-chip">${categoryName}</span>
        </td>
        <td>${book.isbn}</td>
        <td>
          ${book.available ? 
            '<span class="badge badge-success">Available</span>' : 
            '<span class="badge badge-warning">Borrowed</span>'}
        </td>
        <td>
          ${book.available ? 
            `<button onclick="handleBorrow('${book.id}')" class="btn btn-primary">Borrow</button>` : 
            (transactions.some(t => t.bookId === book.id && t.userId === currentUser.id && t.type === 'borrow' && 
              !transactions.some(rt => rt.bookId === book.id && rt.type === 'return' && new Date(rt.date) > new Date(t.date))) ? 
              `<button onclick="handleReturn('${book.id}')" class="btn btn-accent">Return</button>` : 
              '<span class="text-gray-400">Unavailable</span>')}
        </td>
      </tr>
    `;
  }
  
  function renderAvailableBooks() {
    return `
      <div class="card">
        <h3 class="card-title">📚 Available Books</h3>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Book Details</th>
                <th>ISBN</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${books.map(book => renderBookRow(book)).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  
  function renderUserTransactions() {
    const userTransactions = transactions
      .filter(t => t.userId === currentUser.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return `
      <div class="card">
        <h3 class="card-title">📝 Your Transactions</h3>
        ${userTransactions.length === 0 ? 
          '<p class="text-gray-500">No transactions yet</p>' : 
          `
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Action</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${userTransactions.map(trans => {
                  const book = books.find(b => b.id === trans.bookId);
                  const isActive = trans.type === 'borrow' && 
                    !transactions.some(t => 
                      t.bookId === trans.bookId && 
                      t.type === 'return' && 
                      new Date(t.date) > new Date(trans.date)
                    );
                  
                  return `
                    <tr>
                      <td>${book?.title || 'Unknown Book'}</td>
                      <td>${trans.type === 'borrow' ? 'Borrowed' : 'Returned'}</td>
                      <td>${formatDate(trans.date)}</td>
                      <td>
                        ${isActive ? 
                          '<span class="badge badge-warning">Active</span>' : 
                          '<span class="badge badge-success">Completed</span>'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          `}
      </div>
    `;
  }
  
  function renderDashboard() {
    if (!currentUser) return renderLogin();
  
    const isAdmin = currentUser.role === 'admin';
    
    app.innerHTML = `
      <div class="container">
        <header>
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">📖 Library Management System</h1>
            <div class="flex items-center gap-2">
              <span>👤 ${currentUser.name} (${currentUser.role})</span>
              <button id="logoutBtn" class="btn btn-outline">Logout</button>
            </div>
          </div>
        </header>
  
        <main class="my-6">
          <div class="grid ${isAdmin ? 'grid-cols-2' : ''} gap-6">
            ${isAdmin ? `
              <div class="card">
                <h3 class="card-title">➕ Add New Book</h3>
                <div class="form-group">
                  <label>Title</label>
                  <input id="bookTitle" class="form-control">
                </div>
                <div class="form-group">
                  <label>Author</label>
                  <input id="bookAuthor" class="form-control">
                </div>
                <div class="form-group">
                  <label>ISBN</label>
                  <input id="bookIsbn" class="form-control">
                </div>
                <div class="form-group">
                  <label>Category</label>
                  <select id="bookCategory" class="form-control">
                    <option value="academic">Academic</option>
                    <option value="exam">Exam Prep</option>
                    <option value="magazine">Magazine</option>
                  </select>
                </div>
                <button id="addBookBtn" class="btn btn-primary">Add Book</button>
              </div>
  
              <div class="card">
                <h3 class="card-title">🗑️ Delete Book</h3>
                <div class="form-group">
                  <label>Select Book</label>
                  <select id="bookToDelete" class="form-control">
                    ${books.map(book => 
                      `<option value="${book.id}">${book.title} (${getCategoryName(book.category)})</option>`
                    ).join('')}
                  </select>
                </div>
                <button id="deleteBookBtn" class="btn btn-danger">Delete Book</button>
              </div>
            ` : ''}
  
            ${renderAvailableBooks()}
            ${renderUserTransactions()}
          </div>
        </main>
      </div>
    `;
  
    document.getElementById('logoutBtn').addEventListener('click', () => {
      currentUser = null;
      renderLogin();
    });
  
    if (isAdmin) {
      document.getElementById('addBookBtn').addEventListener('click', () => {
        const title = document.getElementById('bookTitle').value;
        const author = document.getElementById('bookAuthor').value;
        const isbn = document.getElementById('bookIsbn').value;
        const category = document.getElementById('bookCategory').value;
  
        if (!title || !author || !isbn) {
          alert('Please fill all fields');
          return;
        }
  
        books.push({
          id: Date.now().toString(),
          title,
          author,
          isbn,
          category,
          available: true
        });
  
        document.getElementById('bookTitle').value = '';
        document.getElementById('bookAuthor').value = '';
        document.getElementById('bookIsbn').value = '';
        
        renderDashboard();
      });
  
      document.getElementById('deleteBookBtn').addEventListener('click', () => {
        const bookId = document.getElementById('bookToDelete').value;
        const index = books.findIndex(b => b.id === bookId);
        
        if (index !== -1) {
          books.splice(index, 1);
          renderDashboard();
        }
      });
    }
  }
  
  // Event Handlers
  function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      currentUser = user;
      renderDashboard();
    } else {
      alert('Invalid credentials');
    }
  }
  
  function handleRegister() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
  
    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }
  
    if (users.some(u => u.email === email)) {
      alert('Email already registered');
      return;
    }
  
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      password
    };
  
    users.push(newUser);
    alert('Registration successful! Please login.');
    renderLogin();
  }
  
  function handleBorrow(bookId) {
    if (!currentUser) return;
  
    const book = books.find(b => b.id === bookId);
    if (!book || !book.available) {
      alert('Book not available');
      return;
    }
  
    book.available = false;
    transactions.push({
      id: Date.now().toString(),
      bookId,
      userId: currentUser.id,
      type: 'borrow',
      date: new Date().toISOString()
    });
  
    renderDashboard();
  }
  
  function handleReturn(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
  
    book.available = true;
    transactions.push({
      id: Date.now().toString(),
      bookId,
      userId: currentUser.id,
      type: 'return',
      date: new Date().toISOString()
    });
  
    renderDashboard();
  }
  
  // Make functions available globally for HTML onclick handlers
  window.handleBorrow = handleBorrow;
  window.handleReturn = handleReturn;
  
  // Initialize App
  renderLogin();