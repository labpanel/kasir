function doGet(e) {
  var action = e.parameter.action;
  
  if (action === "getProducts") {
    return ContentService.createTextOutput(JSON.stringify(getProducts())).setMimeType(ContentService.MimeType.JSON);
  } else if (action === "getTransactions") {
    return ContentService.createTextOutput(JSON.stringify(getTransactions())).setMimeType(ContentService.MimeType.JSON);
  } else if (action === "getCustomers") {
    return ContentService.createTextOutput(JSON.stringify(getCustomers())).setMimeType(ContentService.MimeType.JSON);
  } else if (action === "getQuotations") {
    return ContentService.createTextOutput(JSON.stringify(getQuotations())).setMimeType(ContentService.MimeType.JSON);
  } else if (action === "getSuppliers") {
    return ContentService.createTextOutput(JSON.stringify(getSuppliers())).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var action = body.action;
  var data = body.data;
  
  try {
    if (action === "saveTransaction") {
      return response(saveTransaction(data));
    } else if (action === "addProduct") {
      return response(addProduct(data));
    } else if (action === "editProduct") {
      return response(editProduct(data));
    } else if (action === "deleteProduct") {
      return response(deleteProduct(data));
    } else if (action === "addCustomer") {
      return response(addCustomer(data));
    } else if (action === "editCustomer") {
      return response(editCustomer(data));
    } else if (action === "deleteCustomer") {
      return response(deleteCustomer(data));
    } else if (action === "saveQuotation") {
      return response(saveQuotation(data));
    } else if (action === "updateQuotationStatus") {
      return response(updateQuotationStatus(data));
    } else if (action === "addSupplier") {
      return response(addSupplier(data));
    } else if (action === "editSupplier") {
      return response(editSupplier(data));
    } else if (action === "deleteSupplier") {
      return response(deleteSupplier(data));
    } else if (action === "verifyLogin") {
      return response(verifyLogin(data));
    } else if (action === "registerUser") {
      return response(registerUser(data));
    } else if (action === "resetPassword") {
      return response(resetPassword(data));
    }
    return response({ error: "Invalid action" }, false);
  } catch (err) {
    return response({ error: err.toString() }, false);
  }
}

function response(data, success = true) {
  var res = typeof data === 'object' ? data : { result: data };
  res.success = res.success !== undefined ? res.success : success;
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

// ======================== PRODUCTS ========================
function getProducts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
  var data = sheet.getDataRange().getValues();
  var products = [];
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      products.push({
        code: data[i][0].toString(),
        name: data[i][1] ? data[i][1].toString() : '',
        category: data[i][2] ? data[i][2].toString() : '',
        purchasePrice: Number(data[i][3]) || 0,
        sellingPrice: Number(data[i][4]) || 0,
        stock: Number(data[i][5]) || 0
      });
    }
  }
  return products;
}

function addProduct(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
  sheet.appendRow([data.code, data.name, data.category, data.purchasePrice, data.sellingPrice, data.stock]);
  return { success: true };
}

function editProduct(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
  var rows = sheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === data.code) {
      // Update Name, Category, Purchase Price, Selling Price, Stock
      sheet.getRange(i + 1, 2).setValue(data.name);
      sheet.getRange(i + 1, 3).setValue(data.category);
      sheet.getRange(i + 1, 4).setValue(data.purchasePrice);
      sheet.getRange(i + 1, 5).setValue(data.sellingPrice);
      sheet.getRange(i + 1, 6).setValue(data.stock);
      return { success: true };
    }
  }
  return { error: "Product not found" };
}

function deleteProduct(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
  var rows = sheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === data.code) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: "Product not found" };
}

// ======================== CUSTOMERS ========================
function getCustomers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Customers");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var customers = [];
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      customers.push({
        phone: data[i][0].toString(),
        name: data[i][1] ? data[i][1].toString() : '',
        address: data[i][2] ? data[i][2].toString() : ''
      });
    }
  }
  return customers;
}

function addCustomer(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Customers");
  sheet.appendRow([data.phone, data.name, data.address]);
  return { success: true };
}

function editCustomer(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Customers");
  var rows = sheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === data.phone) {
      sheet.getRange(i + 1, 2).setValue(data.name);
      sheet.getRange(i + 1, 3).setValue(data.address);
      return { success: true };
    }
  }
  return { error: "Customer not found" };
}

function deleteCustomer(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Customers");
  var rows = sheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === data.phone) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: "Customer not found" };
}

// ======================== TRANSACTIONS ========================
function saveTransaction(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions");
  
  sheet.appendRow([
    data.date,                   // Date (ISO)
    data.type || 'Penjualan',    // Penjualan / Pembelian
    data.customerId || '',       // Customer ID
    data.customerName || '',     // Customer Name
    data.supplierName || '',     // Supplier Name
    data.paymentMethod || 'Cash',// Payment Method
    data.receiptNo || '',        // Receipt Number
    JSON.stringify(data.items),  // Items JSON
    data.subtotal,               // Subtotal
    data.payAmount,              // Pay Amount
    data.change                  // Change
  ]);
  
  // Update Stock based on transaction type
  updateStock(data.items, data.type || 'Penjualan');

  return { success: true };
}

function updateStock(purchasedItems, type) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    var rowCode = data[i][0].toString();
    var item = purchasedItems.find(p => p.code === rowCode);
    
    if (item) {
      var currentStock = Number(data[i][5]) || 0; // Column index 5 (F) is Stock
      var isSale = (type && type.toLowerCase() === 'penjualan');
      
      // If sale, subtract qty. If purchase, add qty.
      var newStock = isSale ? (currentStock - item.qty) : (currentStock + item.qty);
      sheet.getRange(i + 1, 6).setValue(newStock);
    }
  }
}

function getTransactions() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var transactions = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      transactions.push({
        date: data[i][0].toString(),
        type: data[i][1] ? data[i][1].toString() : 'Penjualan',
        customerId: data[i][2] ? data[i][2].toString() : '',
        customerName: data[i][3] ? data[i][3].toString() : '',
        supplierName: data[i][4] ? data[i][4].toString() : '',
        paymentMethod: data[i][5] ? data[i][5].toString() : 'Cash',
        receiptNo: data[i][6] ? data[i][6].toString() : '',
        items: data[i][7] ? data[i][7].toString() : '[]',
        subtotal: Number(data[i][8]) || 0,
        payAmount: Number(data[i][9]) || 0,
        change: Number(data[i][10]) || 0
      });
    }
  }
  
  return transactions.sort((a,b) => new Date(b.date) - new Date(a.date)); // descending
}

// ======================== QUOTATIONS ========================
function saveQuotation(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Quotations");
  
  sheet.appendRow([
    data.date,                  // Date (ISO)
    data.quoNo,                 // Quotation Number
    data.customerId,            // Customer Info
    JSON.stringify(data.items), // Items JSON
    data.total,                 // Total Amount
    "Menunggu"                  // Status
  ]);
  
  return { success: true };
}

function getQuotations() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Quotations");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var quotations = [];
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      quotations.push({
        date: data[i][0].toString(),
        quoNo: data[i][1].toString(),
        customerId: data[i][2].toString(),
        items: data[i][3].toString(),
        total: Number(data[i][4]) || 0,
        status: data[i][5] ? data[i][5].toString() : "Menunggu"
      });
    }
  }
  return quotations;
}

function updateQuotationStatus(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Quotations");
  var rows = sheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1].toString() === data.quoNo) {
      sheet.getRange(i + 1, 6).setValue(data.status);
      return { success: true };
    }
  }
  return { error: "Quotation not found" };
}

// ======================== AUTHENTICATION ========================
function verifyLogin(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  if (!sheet) return { error: "Users sheet not found" };
  
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var email = rows[i][0] ? rows[i][0].toString().toLowerCase() : '';
    var password = rows[i][1] ? rows[i][1].toString() : '';
    
    if (email === data.email.toLowerCase() && password === data.password) {
      return { success: true, user: { email: email, role: rows[i][2] || 'Admin' } };
    }
  }
  return { success: false, error: "Email atau password salah" };
}

function registerUser(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  if (!sheet) return { error: "Users sheet not found" };
  
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var email = rows[i][0] ? rows[i][0].toString().toLowerCase() : '';
    if (email === data.email.toLowerCase()) {
      return { success: false, error: "Email sudah terdaftar" };
    }
  }
  
  sheet.appendRow([data.email, data.password, "Pegawai", data.name || '']);
  return { success: true };
}

function resetPassword(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  if (!sheet) return { error: "Users sheet not found" };
  
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var email = rows[i][0] ? rows[i][0].toString().toLowerCase() : '';
    if (email === data.email.toLowerCase()) {
      sheet.getRange(i + 1, 2).setValue(data.newPassword);
      return { success: true };
    }
  }
  
  return { success: false, error: "Email tidak ditemukan di sistem" };
}

// ======================== SUPPLIERS ========================
function getSuppliers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Suppliers");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var suppliers = [];
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      suppliers.push({
        phone: data[i][0].toString(),
        name: data[i][1] ? data[i][1].toString() : '',
        company: data[i][2] ? data[i][2].toString() : '',
        address: data[i][3] ? data[i][3].toString() : ''
      });
    }
  }
  return suppliers;
}

function addSupplier(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Suppliers");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Suppliers");
    sheet.appendRow(["Phone", "Name", "Company", "Address"]);
  }
  sheet.appendRow([data.phone, data.name, data.company || '', data.address || '']);
  return { success: true };
}

function editSupplier(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Suppliers");
  if (!sheet) return { error: "Suppliers sheet not found" };
  var rows = sheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === data.phone) {
      sheet.getRange(i + 1, 2).setValue(data.name);
      sheet.getRange(i + 1, 3).setValue(data.company || '');
      sheet.getRange(i + 1, 4).setValue(data.address || '');
      return { success: true };
    }
  }
  return { error: "Supplier not found" };
}

function deleteSupplier(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Suppliers");
  if (!sheet) return { error: "Suppliers sheet not found" };
  var rows = sheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === data.phone) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: "Supplier not found" };
}
