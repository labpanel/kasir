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
    } else if (action === "getQuotationPdfLink") {
      return response(getQuotationPdfLink(data));
    } else if (action === "getTransactionPdfLink") {
      return response(getTransactionPdfLink(data));
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

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date)); // descending
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

// ======================== PDF GENERATION ========================
function getQuotationPdfLink(data) {
  try {
    var html = generateQuotationHtml(data);
    var blob = HtmlService.createHtmlOutput(html).getAs('application/pdf');
    var fileName = "QUO_" + data.quoNo + "_" + (data.custObj?.name || "Customer") + ".pdf";
    var result = saveAndSharePdf(blob, fileName, "Kasir_PDF_Quotations");
    return { success: true, url: result.url, id: result.id };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function getTransactionPdfLink(data) {
  try {
    var html = generateTransactionHtml(data);
    var blob = HtmlService.createHtmlOutput(html).getAs('application/pdf');
    var fileName = "INV_" + data.receiptNo + "_" + (data.customerName || "Customer") + ".pdf";
    var result = saveAndSharePdf(blob, fileName, "Kasir_PDF_Transactions");
    return { success: true, url: result.url, id: result.id };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function generateQuotationHtml(data) {
  var settings = data.settings;
  var qSettings = data.qSettings;
  var custObj = data.custObj;
  var cart = data.cart;
  var accent = qSettings.accentColor || '#1e40af';

  var tableRows = cart.map(function (item) {
    return '<tr>' +
      '<td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 12px;">' + item.name + '</td>' +
      '<td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 12px; text-align: center;">' + item.qty + '</td>' +
      '<td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 12px; text-align: right;">' + formatIDR(item.sellingPrice) + '</td>' +
      '<td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 12px; text-align: right; font-weight: bold;">' + formatIDR(item.sellingPrice * item.qty) + '</td>' +
      '</tr>';
  }).join('');

  return '<div style="font-family: Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">' +
    '<div style="border-bottom: 3px solid ' + accent + '; padding-bottom: 15px; margin-bottom: 20px;">' +
    '<table style="width: 100%;">' +
    '<tr>' +
    '<td>' +
    '<h1 style="margin: 0; color: ' + accent + '; font-size: 24px;">' + settings.storeName + '</h1>' +
    '<p style="margin: 5px 0; font-size: 11px; color: #666;">' + (settings.storeAddress || "") + '</p>' +
    '<p style="margin: 2px 0; font-size: 11px; color: #666;">Tel: ' + (settings.storePhone || "") + '</p>' +
    '</td>' +
    '<td style="text-align: right; vertical-align: top;">' +
    '<h2 style="margin: 0; color: ' + accent + '; font-size: 28px; letter-spacing: 2px;">' + (qSettings.headerTitle || "QUOTATION") + '</h2>' +
    '<p style="margin: 5px 0; font-size: 11px; color: #666;">No: ' + data.quoNo + '</p>' +
    '<p style="margin: 2px 0; font-size: 11px; color: #666;">Tgl: ' + data.dateStr + '</p>' +
    '</td>' +
    '</tr>' +
    '</table>' +
    '</div>' +

    '<div style="margin-bottom: 30px;">' +
    '<p style="margin: 0 0 5px 0; font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 1px;">Ditujukan Kepada:</p>' +
    '<p style="margin: 0; font-weight: bold; font-size: 14px;">' + (custObj.name || "Pelanggan Umum") + '</p>' +
    '<p style="margin: 2px 0; font-size: 11px; color: #444;">' + (custObj.address || "") + '</p>' +
    '<p style="margin: 2px 0; font-size: 11px; color: #444;">' + (custObj.phone || "") + '</p>' +
    '</div>' +

    '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">' +
    '<thead>' +
    '<tr style="background-color: #f1f5f9;">' +
    '<th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd; font-size: 11px;">PRODUK</th>' +
    '<th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd; font-size: 11px;">QTY</th>' +
    '<th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd; font-size: 11px;">HARGA</th>' +
    '<th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd; font-size: 11px;">TOTAL</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' + tableRows + '</tbody>' +
    '</table>' +

    '<div style="display: flex; justify-content: flex-end;">' +
    '<table style="width: 250px; border-collapse: collapse;">' +
    '<tr><td style="padding: 5px 0; font-size: 12px; color: #666;">Subtotal:</td><td style="text-align: right; font-size: 12px;">' + formatIDR(data.subtotal) + '</td></tr>' +
    (data.taxPercent > 0 ? '<tr><td style="padding: 5px 0; font-size: 12px; color: #666;">PPN (' + data.taxPercent + '%):</td><td style="text-align: right; font-size: 12px;">' + formatIDR(data.taxAmount) + '</td></tr>' : '') +
    '<tr><td style="padding: 10px 0; border-top: 2px solid #333; font-weight: bold; font-size: 14px;">GRAND TOTAL:</td><td style="text-align: right; border-top: 2px solid #333; font-weight: bold; font-size: 14px;">' + formatIDR(data.grandTotal) + '</td></tr>' +
    '</table>' +
    '</div>' +

    (data.notes ? '<div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 11px; color: #64748b;"><strong>Catatan:</strong><br/>' + data.notes.replace(/\n/g, '<br/>') + '</div>' : '') +

    '<div style="margin-top: 60px;">' +
    '<table style="width: 100%;">' +
    '<tr>' +
    '<td style="width: 180px; text-align: center; border-top: 1px solid #ddd; padding-top: 8px; font-size: 11px;">( ' + qSettings.signatureLeft + ' )</td>' +
    '<td></td>' +
    '<td style="width: 180px; text-align: center; border-top: 1px solid #ddd; padding-top: 8px; font-size: 11px;">( ' + (qSettings.signatureRight || settings.storeName) + ' )</td>' +
    '</tr>' +
    '</table>' +
    '</div>' +

    (qSettings.footerText ? '<p style="text-align: center; color: #94a3b8; font-size: 9px; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 10px;">' + qSettings.footerText + '</p>' : '') +
    '</div>';
}

function generateTransactionHtml(data) {
  var settings = data.settings || {};
  var cart = data.items || [];
  var accent = '#1e40af'; // Same as ReceiptA4 blue
  var logoLetter = (settings.storeName || 'K').charAt(0).toUpperCase();

  var tableRows = cart.map(function (item, idx) {
    var rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    return '<tr style="background-color: ' + rowBg + '; border-bottom: 1px solid #e2e8f0;">' +
      '<td style="padding: 10px; font-size: 11px; color: #64748b; border-bottom: 1px solid #e2e8f0;">' + (idx + 1) + '</td>' +
      '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">' +
        '<div style="font-weight: 600; font-size: 13px;">' + item.name + '</div>' +
        '<div style="font-size: 10px; color: #94a3b8;">Kode: ' + (item.code || '-') + '</div>' +
      '</td>' +
      '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: 600; font-size: 12px;">' + item.qty + '</td>' +
      '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 12px; color: #475569;">' + formatIDR(item.price) + '</td>' +
      '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; font-size: 12px;">' + formatIDR(item.price * item.qty) + '</td>' +
      '</tr>';
  }).join('');

  return '<div style="font-family: \'Segoe UI\', Tahoma, sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 24px;">' +
    /* Header Table */
    '<table style="width: 100%; border-bottom: 3px solid ' + accent + '; padding-bottom: 15px; margin-bottom: 24px; border-collapse: collapse;">' +
    '<tr>' +
    '<td style="vertical-align: middle;">' +
      '<table style="border-collapse: collapse;"><tr>' +
        '<td style="width: 48px; min-width: 48px; height: 48px; background-color: ' + accent + '; border-radius: 10px; text-align: center; vertical-align: middle; color: white; font-weight: bold; font-size: 24px;">' + logoLetter + '</td>' +
        '<td style="padding-left: 12px;">' +
          '<h1 style="font-size: 22px; font-weight: 800; margin: 0; color: #1e293b;">' + (settings.storeName || "KASIR APP") + '</h1>' +
          '<p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">' + (settings.storeAddress || "-") + ' | Tel: ' + (settings.storePhone || "-") + '</p>' +
        '</td>' +
      '</tr></table>' +
    '</td>' +
    '<td style="text-align: right; vertical-align: top;">' +
      '<h2 style="font-size: 28px; font-weight: 800; color: ' + accent + '; margin: 0; letter-spacing: 2px;">INVOICE</h2>' +
      '<p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">Nota ' + (data.type || "Penjualan") + '</p>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    /* Meta Table (Customer & Receipt Info) */
    '<table style="width: 100%; margin-bottom: 24px; border-collapse: collapse;">' +
    '<tr>' +
    '<td style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; vertical-align: top;">' +
      '<div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">DITUJUKAN KEPADA:</div>' +
      '<div style="font-weight: 700; font-size: 15px; margin-bottom: 2px;">' + (data.customerName || "Pelanggan Umum") + '</div>' +
      '<div style="font-size: 12px; color: #64748b;">' + (data.customerId ? 'ID: ' + data.customerId : "") + '</div>' +
    '</td>' +
    '<td style="width: 20px;">&nbsp;</td>' +
    '<td style="width: 220px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; vertical-align: top;">' +
      '<div style="margin-bottom: 8px;">' +
        '<p style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin: 0 0 2px 0;">No. Nota</p>' +
        '<p style="font-size: 14px; font-weight: 700; margin: 0;">' + data.receiptNo + '</p>' +
      '</div>' +
      '<div style="margin-bottom: 8px;">' +
        '<p style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin: 0 0 2px 0;">Tanggal</p>' +
        '<p style="font-size: 13px; margin: 0;">' + new Date(data.date).toLocaleString('id-ID') + '</p>' +
      '</div>' +
      '<div>' +
        '<p style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin: 0 0 2px 0;">Pembayaran</p>' +
        '<p style="font-size: 13px; margin: 0; font-weight: 600;">' + (data.paymentMethod || "-") + '</p>' +
      '</div>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    /* Items Table */
    '<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">' +
    '<thead>' +
    '<tr style="background-color: ' + accent + ';">' +
      '<th style="padding: 12px; color: white; font-size: 11px; text-align: left; text-transform: uppercase;">No</th>' +
      '<th style="padding: 12px; color: white; font-size: 11px; text-align: left; text-transform: uppercase;">Produk</th>' +
      '<th style="padding: 12px; color: white; font-size: 11px; text-align: center; text-transform: uppercase;">Qty</th>' +
      '<th style="padding: 12px; color: white; font-size: 11px; text-align: right; text-transform: uppercase;">Harga Unit</th>' +
      '<th style="padding: 12px; color: white; font-size: 11px; text-align: right; text-transform: uppercase;">Total</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' + tableRows + '</tbody>' +
    '</table>' +

    /* Summary Table */
    '<table style="width: 100%; border-collapse: collapse;">' +
    '<tr>' +
    '<td style="width: 60%;">&nbsp;</td>' +
    '<td style="width: 40%;">' +
      '<table style="width: 100%; border-collapse: collapse;">' +
        '<tr><td style="padding: 8px 0; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0;">Subtotal</td><td style="text-align: right; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #e2e8f0;">' + formatIDR(data.subtotal) + '</td></tr>' +
        (data.taxPercent > 0 ? '<tr><td style="padding: 8px 0; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0;">PPN (' + data.taxPercent + '%)</td><td style="text-align: right; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #e2e8f0;">' + formatIDR(data.taxAmount) + '</td></tr>' : '') +
        '<tr><td style="padding: 12px; font-weight: 800; font-size: 16px; color: white; background-color: ' + accent + ';">TOTAL</td><td style="text-align: right; padding: 12px; font-weight: 800; font-size: 16px; color: white; background-color: ' + accent + ';">' + formatIDR(data.grandTotal) + '</td></tr>' +
        (data.paymentMethod === 'Cash' ? (
          '<tr><td style="padding: 8px 0; font-size: 14px; color: #475569;">Dibayar</td><td style="text-align: right; padding: 8px 0; font-size: 14px;">' + formatIDR(data.payAmount) + '</td></tr>' +
          '<tr><td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #16a34a; border-top: 1px dashed #e2e8f0;">Kembalian</td><td style="text-align: right; padding: 8px 0; font-size: 14px; font-weight: 700; color: #16a34a; border-top: 1px dashed #e2e8f0;">' + formatIDR(data.change) + '</td></tr>'
        ) : '') +
      '</table>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    /* Receipt Footer */
    '<div style="text-align: center; margin-top: 60px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 11px;">' +
    '<p style="margin: 0;">Terima kasih atas kunjungan Anda • Barang yang sudah dibeli tidak dapat dikembalikan</p>' +
    '</div>' +
    '</div>';
}

function saveAndSharePdf(blob, fileName, folderName) {
  var targetFolderName = folderName || "Kasir_PDF_Default";
  var folders = DriveApp.getFoldersByName(targetFolderName);
  var folder;

  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(targetFolderName);
  }

  var file = folder.createFile(blob);
  file.setName(fileName);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    url: file.getUrl(),
    id: file.getId()
  };
}

function formatIDR(amount) {
  var formatted = Number(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "Rp " + formatted;
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
