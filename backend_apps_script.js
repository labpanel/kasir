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
  sheet.appendRow([data.phone, data.name, data.address, data.points || 0]);
  return { success: true };
}

function editCustomer(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Customers");
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === data.phone) {
      sheet.getRange(i + 1, 2).setValue(data.name);
      sheet.getRange(i + 1, 3).setValue(data.address);
      sheet.getRange(i + 1, 4).setValue(data.points || 0);
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
    data.date,                   // Date
    data.receiptNo,              // ReceiptNo
    data.type || 'Penjualan',    // Type
    data.paymentMethod || 'Cash',// PaymentMethod
    data.customerId || data.supplierId || '',     // PartnerId (Col E)
    data.customerName || data.supplierName || '',   // PartnerName (Col F)
    JSON.stringify(data.items),  // ItemsJson
    data.subtotal,               // Subtotal
    data.taxAmount || 0,         // TaxAmount
    data.grandTotal              // GrandTotal
  ]);

  updateStock(data.items, data.type || 'Penjualan');

  // Auto-generate PDF and save link to Column K
  var pdfLink = '';
  try {
    var html = generateTransactionHtml(data);
    var blob = HtmlService.createHtmlOutput(html).getAs('application/pdf');
    var fileName = "INV_" + data.receiptNo + "_" + (data.customerName || data.supplierName || "Customer") + ".pdf";
    var result = saveAndSharePdf(blob, fileName, "Kasir_PDF_Transactions");
    pdfLink = result.url;
    // Write PDF link to Column K of the newly appended row
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 11).setValue(pdfLink);
  } catch (pdfErr) {
    // PDF generation failure should not block the transaction
    Logger.log("Auto PDF generation failed: " + pdfErr.toString());
  }

  return { success: true, pdfLink: pdfLink };
}

function updateStock(purchasedItems, type) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var rowCode = data[i][0].toString();
    var item = purchasedItems.find(p => p.code === rowCode);

    if (item) {
      var currentStock = Number(data[i][5]) || 0; // Col F
      var isSale = (type && type.toLowerCase() === 'penjualan');
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
        receiptNo: data[i][1].toString(),
        type: data[i][2] ? data[i][2].toString() : 'Penjualan',
        paymentMethod: data[i][3] ? data[i][3].toString() : 'Cash',
        partnerId: data[i][4] ? data[i][4].toString() : '',
        partnerName: data[i][5] ? data[i][5].toString() : '',
        items: data[i][6] ? data[i][6].toString() : '[]',
        subtotal: Number(data[i][7]) || 0,
        taxAmount: Number(data[i][8]) || 0,
        grandTotal: Number(data[i][9]) || 0,
        pdfLink: data[i][10] ? data[i][10].toString() : ''
      });
    }
  }
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ======================== QUOTATIONS ========================
function saveQuotation(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Quotations");

  sheet.appendRow([
    data.date,                   // Date
    data.quoNo,                  // QuoNo
    data.status || 'Menunggu',    // Status
    data.customerId || '',       // CustomerId
    data.customerName || '',     // CustomerName
    JSON.stringify(data.items),  // ItemsJson
    data.subtotal || 0,          // Subtotal
    data.taxAmount || 0,         // TaxAmount
    data.grandTotal || 0,        // GrandTotal
    data.notes || '',            // Notes
    JSON.stringify(data.settings)// SettingsJson
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
        status: data[i][2].toString(),
        customerId: data[i][3].toString(),
        customerName: data[i][4].toString(),
        items: data[i][5].toString(),
        subtotal: Number(data[i][6]) || 0,
        taxAmount: Number(data[i][7]) || 0,
        grandTotal: Number(data[i][8]) || 0,
        notes: data[i][9] ? data[i][9].toString() : '',
        settings: data[i][10] ? data[i][10].toString() : '',
        pdfLink: data[i][11] ? data[i][11].toString() : ''
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
      sheet.getRange(i + 1, 3).setValue(data.status); // Col C
      return { success: true };
    }
  }
  return { error: "Quotation not found" };
}

// ======================== PDF GENERATION ========================
function getQuotationPdfLink(data) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Quotations");
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][1].toString() === data.quoNo) {
        if (rows[i][11]) {
          return { success: true, url: rows[i][11].toString(), cached: true };
        }
        var html = generateQuotationHtml(data);
        var blob = HtmlService.createHtmlOutput(html).getAs('application/pdf');
        var custName = data.custObj && data.custObj.name ? data.custObj.name : "Customer";
        var fileName = "QUO_" + data.quoNo + "_" + custName + ".pdf";
        var result = saveAndSharePdf(blob, fileName, "Kasir_PDF_Quotations");
        sheet.getRange(i + 1, 12).setValue(result.url);
        return { success: true, url: result.url, id: result.id, cached: false };
      }
    }
    
    var html2 = generateQuotationHtml(data);
    var blob2 = HtmlService.createHtmlOutput(html2).getAs('application/pdf');
    var custName2 = data.custObj && data.custObj.name ? data.custObj.name : "Customer";
    var fileName2 = "QUO_" + data.quoNo + "_" + custName2 + ".pdf";
    var result2 = saveAndSharePdf(blob2, fileName2, "Kasir_PDF_Quotations");
    return { success: true, url: result2.url, id: result2.id, cached: false };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function getTransactionPdfLink(data) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions");
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][1].toString() === data.receiptNo) {
        if (rows[i][10]) {
          return { success: true, url: rows[i][10].toString(), cached: true };
        }
        var html = generateTransactionHtml(data);
        var blob = HtmlService.createHtmlOutput(html).getAs('application/pdf');
        var fileName = "INV_" + data.receiptNo + "_" + (data.customerName || "Customer") + ".pdf";
        var result = saveAndSharePdf(blob, fileName, "Kasir_PDF_Transactions");
        sheet.getRange(i + 1, 11).setValue(result.url);
        return { success: true, url: result.url, id: result.id, cached: false };
      }
    }
    
    var html2 = generateTransactionHtml(data);
    var blob2 = HtmlService.createHtmlOutput(html2).getAs('application/pdf');
    var fileName2 = "INV_" + data.receiptNo + "_" + (data.customerName || "Customer") + ".pdf";
    var result2 = saveAndSharePdf(blob2, fileName2, "Kasir_PDF_Transactions");
    return { success: true, url: result2.url, id: result2.id, cached: false };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function generateQuotationHtml(data) {
  var tpl = (data.qSettings && data.qSettings.template) ? data.qSettings.template : 'professional';
  if (tpl === 'minimalist') return generateMinimalistHtml(data);
  if (tpl === 'classic') return generateClassicHtml(data);
  if (tpl === 'thermal') return generateThermalHtml(data);
  return generateProfessionalHtml(data);
}

function generateProfessionalHtml(data) {
  var settings = data.settings || {};
  var qSettings = data.qSettings || {};
  var custObj = data.custObj || {};
  var cart = data.cart || [];
  var accent = qSettings.accentColor || '#1e40af';

  var tableRows = cart.map(function(item, idx) {
    var bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    return '<tr style="background-color: ' + bg + '; border-bottom: 1px solid #e2e8f0;">' +
      '<td style="padding: 12px 16px; font-size: 13px; color: #64748b;">' + (idx + 1) + '</td>' +
      '<td style="padding: 12px 16px; font-size: 14px; font-weight: bold;">' + item.name + '</td>' +
      '<td style="padding: 12px 16px; text-align: center; font-weight: bold; font-size: 13px;">' + item.qty + '</td>' +
      '<td style="padding: 12px 16px; text-align: right; font-size: 13px; color: #475569;">' + formatIDR(item.sellingPrice) + '</td>' +
      '<td style="padding: 12px 16px; text-align: right; font-weight: bold; font-size: 13px;">' + formatIDR(item.sellingPrice * item.qty) + '</td>' +
      '</tr>';
  }).join('');

  var logoBox = '';
  if (qSettings.showLogo) {
     var char = (settings.storeName || 'K').charAt(0);
     logoBox = '<td style="width:50px;"><div style="width: 48px; height: 48px; background-color: ' + accent + '; border-radius: 10px; text-align: center; color: white; font-weight: bold; font-size: 24px; line-height: 48px;">' + char + '</div></td>';
  }

  var termsHtml = '';
  if (qSettings.terms && qSettings.terms.length > 0) {
    termsHtml = '<div style="font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-bottom: 32px;"><p style="font-weight: bold; color: #64748b; margin: 0 0 6px 0;">Syarat & Ketentuan:</p><ol style="margin: 0; padding-left: 16px;">' +
       qSettings.terms.map(function(t) { return '<li style="margin-bottom: 3px;">' + t + '</li>'; }).join('') +
       '</ol></div>';
  }

  return '<div style="font-family: \'Segoe UI\', Tahoma, sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">' +
    '<table style="width: 100%; border-bottom: 3px solid ' + accent + '; padding-bottom: 20px; margin-bottom: 24px; border-collapse: collapse;">' +
    '<tr>' +
    '<td style="vertical-align: top;">' +
      '<table style="border-collapse: collapse;"><tr>' +
      logoBox +
      '<td style="padding-left: 10px;">' +
        '<h1 style="font-size: 24px; font-weight: 800; color: #1e293b; margin: 0;">' + (settings.storeName || "KASIR APP") + '</h1>' +
        (qSettings.showStoreAddress ? '<p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">' + (settings.storeAddress || "") + '</p>' : '') +
        (qSettings.showStorePhone ? '<p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Tel: ' + (settings.storePhone || "") + '</p>' : '') +
        (qSettings.showStoreEmail ? '<p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Email: ' + (settings.storeEmail || "") + '</p>' : '') +
        (qSettings.showStoreWebsite ? '<p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">' + (settings.storeWebsite || "") + '</p>' : '') +
      '</td>' +
      '</tr></table>' +
    '</td>' +
    '<td style="text-align: right; vertical-align: top;">' +
      '<h2 style="font-size: 28px; font-weight: 800; color: ' + accent + '; margin: 0; letter-spacing: 2px;">' + (qSettings.headerTitle || "QUOTATION") + '</h2>' +
      '<p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">' + (qSettings.headerSubtitle || "Penawaran Harga") + '</p>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    '<table style="width: 100%; margin-bottom: 28px; border-collapse: collapse;">' +
    '<tr>' +
    '<td style="width: 60%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; vertical-align: top;">' +
      '<p style="font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin: 0 0 8px 0;">Ditujukan Kepada</p>' +
      '<p style="font-weight: bold; font-size: 16px; color: #1e293b; margin: 0 0 4px 0;">' + (custObj.name || "[Nama Pelanggan]") + '</p>' +
      '<p style="font-size: 13px; color: #475569; margin: 0 0 2px 0;">' + (custObj.address || "") + '</p>' +
      '<p style="font-size: 13px; color: #475569; margin: 0;">' + (custObj.phone || "") + '</p>' +
    '</td>' +
    '<td style="width: 20px;"></td>' +
    '<td style="width: 35%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; vertical-align: top;">' +
      '<table style="width: 100%; border-collapse: collapse;">' +
        '<tr><td style="padding-bottom: 10px;">' +
          '<p style="font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin: 0 0 2px 0;">No. Quotation</p>' +
          '<p style="font-size: 14px; font-weight: bold; margin: 0;">' + data.quoNo + '</p>' +
        '</td></tr>' +
        '<tr><td style="padding-bottom: 10px;">' +
          '<p style="font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin: 0 0 2px 0;">Tanggal</p>' +
          '<p style="font-size: 13px; margin: 0;">' + data.dateStr + '</p>' +
        '</td></tr>' +
        '<tr><td>' +
          '<p style="font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin: 0 0 2px 0;">Berlaku Sampai</p>' +
          '<p style="font-size: 13px; margin: 0;">' + qSettings.validityDays + ' hari</p>' +
        '</td></tr>' +
      '</table>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    '<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">' +
    '<thead>' +
    '<tr style="background-color: ' + accent + ';">' +
      '<th style="padding: 12px 16px; color: white; font-size: 12px; text-align: left; text-transform: uppercase;">No</th>' +
      '<th style="padding: 12px 16px; color: white; font-size: 12px; text-align: left; text-transform: uppercase;">Produk / Deskripsi</th>' +
      '<th style="padding: 12px 16px; color: white; font-size: 12px; text-align: center; text-transform: uppercase;">Qty</th>' +
      '<th style="padding: 12px 16px; color: white; font-size: 12px; text-align: right; text-transform: uppercase;">Harga Satuan</th>' +
      '<th style="padding: 12px 16px; color: white; font-size: 12px; text-align: right; text-transform: uppercase;">Total</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' + tableRows + '</tbody>' +
    '</table>' +

    '<table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">' +
    '<tr>' +
    '<td style="width: 60%;"></td>' +
    '<td style="width: 40%;">' +
      '<table style="width: 100%; border-collapse: collapse;">' +
        '<tr><td style="padding: 8px 0; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0;">Subtotal</td><td style="text-align: right; padding: 8px 0; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0;">' + formatIDR(data.subtotal) + '</td></tr>' +
        (data.taxPercent > 0 ? '<tr><td style="padding: 8px 0; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0;">PPN (' + data.taxPercent + '%)</td><td style="text-align: right; padding: 8px 0; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0;">' + formatIDR(data.taxAmount) + '</td></tr>' : '') +
        '<tr><td style="padding: 12px 16px; font-weight: 800; font-size: 16px; color: white; background-color: ' + accent + '; margin-top: 8px;">TOTAL</td><td style="text-align: right; padding: 12px 16px; font-weight: 800; font-size: 16px; color: white; background-color: ' + accent + '; margin-top: 8px;">' + formatIDR(data.grandTotal) + '</td></tr>' +
      '</table>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    (data.notes ? '<div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;"><p style="font-size: 11px; font-weight: bold; color: #92400e; text-transform: uppercase; margin: 0 0 4px 0;">Catatan:</p><p style="font-size: 13px; color: #78350f; margin: 0;">' + data.notes.replace(/\n/g, '<br/>') + '</p></div>' : '') +

    termsHtml +

    generateSignaturesHtml(qSettings, custObj.name, settings.storeName) +

    (qSettings.footerText ? '<p style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">' + qSettings.footerText + '</p>' : '') +
    '</div>';
}

function generateMinimalistHtml(data) {
  var settings = data.settings || {};
  var qSettings = data.qSettings || {};
  var custObj = data.custObj || {};
  var cart = data.cart || [];

  var tableRows = cart.map(function(item) {
    return '<tr style="border-bottom: 1px solid #eee;">' +
      '<td style="padding: 12px 0; font-size: 13px; font-weight: bold;">' + item.name + '</td>' +
      '<td style="padding: 12px 0; text-align: right; font-size: 13px;">' + item.qty + '</td>' +
      '<td style="padding: 12px 0; text-align: right; color: #555; font-size: 13px;">' + formatIDR(item.sellingPrice) + '</td>' +
      '<td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 13px;">' + formatIDR(item.sellingPrice * item.qty) + '</td>' +
      '</tr>';
  }).join('');

  var termsHtml = '';
  if (qSettings.terms && qSettings.terms.length > 0) {
    termsHtml = '<div style="font-size: 10px; color: #777; margin-bottom: 40px;"><p style="margin: 0 0 4px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Syarat & Ketentuan</p>' +
       qSettings.terms.map(function(t, i) { return '<p style="margin: 0 0 2px 0;">' + (i+1) + '. ' + t + '</p>'; }).join('') +
       '</div>';
  }

  return '<div style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">' +
    '<table style="width: 100%; border-bottom: 2px solid #333; padding-bottom: 16px; margin-bottom: 32px; border-collapse: collapse;">' +
    '<tr>' +
    '<td style="vertical-align: bottom;">' +
      '<h1 style="font-size: 20px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin: 0;">' + (settings.storeName || "KASIR APP") + '</h1>' +
      (qSettings.showStoreAddress ? '<p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">' + (settings.storeAddress || "") + '</p>' : '') +
      (qSettings.showStorePhone ? '<p style="font-size: 12px; color: #555; margin: 2px 0 0 0;">' + (settings.storePhone || "") + '</p>' : '') +
      (qSettings.showStoreEmail ? '<p style="font-size: 12px; color: #555; margin: 2px 0 0 0;">' + (settings.storeEmail || "") + '</p>' : '') +
      (qSettings.showStoreWebsite ? '<p style="font-size: 12px; color: #555; margin: 2px 0 0 0;">' + (settings.storeWebsite || "") + '</p>' : '') +
    '</td>' +
    '<td style="text-align: right; vertical-align: bottom;">' +
      '<h2 style="font-size: 16px; font-weight: bold; letter-spacing: 2px; color: #555; margin: 0;">' + (qSettings.headerTitle || "QUOTATION") + '</h2>' +
      '<p style="font-size: 12px; color: #777; margin: 4px 0 0 0;">' + (qSettings.headerSubtitle || "Penawaran Harga") + '</p>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    '<table style="width: 100%; margin-bottom: 28px; border-collapse: collapse;">' +
    '<tr>' +
    '<td style="vertical-align: top;">' +
      '<p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #aaa; margin: 0 0 8px 0;">Kepada</p>' +
      '<p style="font-size: 15px; font-weight: bold; margin: 0 0 2px 0;">' + (custObj.name || "—") + '</p>' +
      '<p style="font-size: 12px; color: #333; margin: 0;">' + (custObj.address || "") + '</p>' +
      '<p style="font-size: 12px; color: #333; margin: 0;">' + (custObj.phone || "") + '</p>' +
    '</td>' +
    '<td style="text-align: right; vertical-align: top;">' +
      '<p style="font-size: 12px; color: #555; margin: 0 0 4px 0;">Tanggal: ' + data.dateStr + '</p>' +
      '<p style="font-size: 12px; color: #555; margin: 0 0 4px 0;">Nomor: ' + data.quoNo + '</p>' +
      '<p style="font-size: 12px; color: #555; margin: 0;">Valid s.d: ' + qSettings.validityDays + ' hari</p>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    '<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">' +
    '<thead>' +
    '<tr style="border-bottom: 2px solid #333;">' +
      '<th style="padding: 10px 0; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #999; text-align: left;">Deskripsi</th>' +
      '<th style="padding: 10px 0; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #999; text-align: right;">Qty</th>' +
      '<th style="padding: 10px 0; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #999; text-align: right;">Harga</th>' +
      '<th style="padding: 10px 0; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #999; text-align: right;">Total</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' + tableRows + '</tbody>' +
    '</table>' +

    '<table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">' +
    '<tr>' +
    '<td style="width: 60%;"></td>' +
    '<td style="width: 40%;">' +
      '<table style="width: 100%; border-collapse: collapse;">' +
        '<tr><td style="padding: 4px 0; font-size: 13px; color: #555;">Subtotal</td><td style="text-align: right; padding: 4px 0; font-size: 13px; color: #555;">' + formatIDR(data.subtotal) + '</td></tr>' +
        (data.taxPercent > 0 ? '<tr><td style="padding: 4px 0; font-size: 13px; color: #555;">PPN (' + data.taxPercent + '%)</td><td style="text-align: right; padding: 4px 0; font-size: 13px; color: #555;">' + formatIDR(data.taxAmount) + '</td></tr>' : '') +
        '<tr><td style="border-top: 2px solid #333; padding-top: 8px; margin-top: 4px; font-size: 14px; font-weight: bold;">Total</td><td style="border-top: 2px solid #333; padding-top: 8px; margin-top: 4px; text-align: right; font-size: 14px; font-weight: bold;">' + formatIDR(data.grandTotal) + '</td></tr>' +
      '</table>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    (data.notes ? '<p style="font-size: 12px; color: #777; font-style: italic; margin-bottom: 20px;">Catatan: ' + data.notes.replace(/\n/g, '<br/>') + '</p>' : '') +
    
    termsHtml +
    generateSignaturesHtml(qSettings, custObj.name, settings.storeName) +
    '</div>';
}

function generateClassicHtml(data) {
  var settings = data.settings || {};
  var qSettings = data.qSettings || {};
  var custObj = data.custObj || {};
  var cart = data.cart || [];

  var tableRows = cart.map(function(item, idx) {
    return '<tr>' +
      '<td style="border: 1px solid #999; padding: 8px 10px; text-align: center; font-size: 13px;">' + (idx + 1) + '</td>' +
      '<td style="border: 1px solid #999; padding: 8px 10px; font-size: 13px;">' + item.name + '</td>' +
      '<td style="border: 1px solid #999; padding: 8px 10px; text-align: center; font-size: 13px;">' + item.qty + '</td>' +
      '<td style="border: 1px solid #999; padding: 8px 10px; text-align: right; font-size: 13px;">' + formatIDR(item.sellingPrice) + '</td>' +
      '<td style="border: 1px solid #999; padding: 8px 10px; text-align: right; font-size: 13px; font-weight: bold;">' + formatIDR(item.sellingPrice * item.qty) + '</td>' +
      '</tr>';
  }).join('');

  var termsHtml = '';
  if (qSettings.terms && qSettings.terms.length > 0) {
    termsHtml = '<div style="font-size: 12px; color: #333; margin-bottom: 32px;"><p style="font-weight: bold; margin: 0 0 4px 0;">Syarat & Ketentuan:</p>' +
       '<ol style="margin: 0; padding-left: 18px;">' +
       qSettings.terms.map(function(t) { return '<li style="margin-bottom: 2px;">' + t + '</li>'; }).join('') +
       '</ol></div>';
  }

  return '<div style="font-family: \'Times New Roman\', Times, serif; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 20px;">' +
    '<div style="text-align: center; border-bottom: 3px double #1a1a1a; padding-bottom: 16px; margin-bottom: 24px;">' +
      '<h1 style="font-size: 26px; font-weight: bold; margin: 0 0 8px 0; text-transform: uppercase;">' + (settings.storeName || "KASIR APP") + '</h1>' +
      (qSettings.showStoreAddress ? '<p style="font-size: 13px; margin: 0 0 4px 0;">' + (settings.storeAddress || "") + '</p>' : '') +
      (qSettings.showStorePhone ? '<p style="font-size: 13px; margin: 0 0 2px 0;">Telp: ' + (settings.storePhone || "") + '</p>' : '') +
      (qSettings.showStoreEmail ? '<p style="font-size: 13px; margin: 0 0 2px 0;">Email: ' + (settings.storeEmail || "") + '</p>' : '') +
      (qSettings.showStoreWebsite ? '<p style="font-size: 13px; margin: 0;">' + (settings.storeWebsite || "") + '</p>' : '') +
    '</div>' +

    '<div style="text-align: center; margin-bottom: 24px;">' +
      '<h2 style="font-size: 20px; font-weight: bold; margin: 0 0 4px 0; text-decoration: underline;">' + (qSettings.headerTitle || "QUOTATION") + '</h2>' +
      '<p style="font-size: 13px; margin: 0;">' + (qSettings.headerSubtitle || "Penawaran Harga") + ' - No. ' + data.quoNo + '</p>' +
    '</div>' +

    '<table style="width: 100%; margin-bottom: 20px; font-size: 13px; border-collapse: collapse;">' +
    '<tr>' +
    '<td style="vertical-align: top;">' +
      '<p style="margin: 0 0 2px 0;"><strong>Kepada Yth:</strong></p>' +
      '<p style="margin: 0 0 2px 0;">' + (custObj.name || "[Nama]") + '</p>' +
      '<p style="margin: 0 0 2px 0; color: #555;">' + (custObj.address || "[Alamat]") + '</p>' +
      '<p style="margin: 0; color: #555;">' + (custObj.phone || "[Telepon]") + '</p>' +
    '</td>' +
    '<td style="text-align: right; vertical-align: top;">' +
      '<p style="margin: 0 0 2px 0;"><strong>No:</strong> ' + data.quoNo + '</p>' +
      '<p style="margin: 0 0 2px 0;"><strong>Tanggal:</strong> ' + data.dateStr + '</p>' +
      '<p style="margin: 0;"><strong>Berlaku:</strong> ' + qSettings.validityDays + ' hari</p>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    '<p style="font-size: 13px; margin: 0 0 16px 0;">Dengan hormat, berikut kami sampaikan penawaran harga sebagai berikut:</p>' +

    '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #333;">' +
    '<thead>' +
    '<tr style="background-color: #f5f5f5;">' +
      '<th style="border: 1px solid #333; padding: 8px 10px; font-size: 12px; font-weight: bold; text-align: center;">No</th>' +
      '<th style="border: 1px solid #333; padding: 8px 10px; font-size: 12px; font-weight: bold; text-align: left;">Uraian</th>' +
      '<th style="border: 1px solid #333; padding: 8px 10px; font-size: 12px; font-weight: bold; text-align: center;">Qty</th>' +
      '<th style="border: 1px solid #333; padding: 8px 10px; font-size: 12px; font-weight: bold; text-align: right;">Harga Satuan</th>' +
      '<th style="border: 1px solid #333; padding: 8px 10px; font-size: 12px; font-weight: bold; text-align: right;">Jumlah</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' + 
      tableRows + 
      (data.taxPercent > 0 ? '<tr style="background-color: #f5f5f5;"><td colSpan="4" style="border: 1px solid #999; padding: 8px 10px; text-align: right; font-size: 13px;">PPN (' + data.taxPercent + '%)</td><td style="border: 1px solid #999; padding: 8px 10px; text-align: right; font-size: 13px;">' + formatIDR(data.taxAmount) + '</td></tr>' : '') +
      '<tr style="background-color: #f5f5f5;"><td colSpan="4" style="border: 1px solid #333; padding: 10px; text-align: right; font-weight: bold; font-size: 14px;">TOTAL</td><td style="border: 1px solid #333; padding: 10px; text-align: right; font-weight: bold; font-size: 14px;">' + formatIDR(data.grandTotal) + '</td></tr>' +
    '</tbody>' +
    '</table>' +

    (data.notes ? '<p style="font-size: 12px; color: #333; margin-bottom: 16px;"><strong>Catatan:</strong> ' + data.notes.replace(/\n/g, '<br/>') + '</p>' : '') +

    termsHtml +

    '<p style="font-size: 13px; margin-bottom: 32px;">Demikian penawaran ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.</p>' +

    generateSignaturesHtml(qSettings, custObj.name, settings.storeName) +
    '</div>';
}

function generateThermalHtml(data) {
  var settings = data.settings || {};
  var qSettings = data.qSettings || {};
  var custObj = data.custObj || {};
  var cart = data.cart || [];

  var is80 = qSettings.thermalPaperWidth === '80mm';
  var w = is80 ? '300px' : '220px';
  var fs = is80 ? '12px' : '10px';
  var fsSmall = is80 ? '10px' : '8px';
  var fsBold = is80 ? '14px' : '11px';
  var fsTitle = is80 ? '16px' : '12px';
  var dashLine = is80 ? '----------------------------------------' : '------------------------------';

  function compact(val) {
    return Number(val).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  var itemsHtml = cart.map(function(item) {
    return '<div style="margin: 4px 0; font-size: ' + fs + ';">' +
      '<p style="margin: 0; font-weight: bold;">' + item.name + '</p>' +
      '<table style="width: 100%; border-collapse: collapse; font-size: ' + fsSmall + ';"><tr>' +
      '<td style="text-align: left;">' + item.qty + ' x ' + compact(item.sellingPrice) + '</td>' +
      '<td style="text-align: right; font-weight: bold;">' + compact(item.sellingPrice * item.qty) + '</td>' +
      '</tr></table>' +
      '</div>';
  }).join('');

  var termsHtml = '';
  if (qSettings.terms && qSettings.terms.length > 0) {
    termsHtml = '<div style="margin: 4px 0; font-size: ' + fsSmall + ';">' +
       qSettings.terms.map(function(t, i) { return '<p style="margin: 0;">' + (i+1) + '. ' + t + '</p>'; }).join('') +
       '</div>';
  }

  return '<div style="font-family: \'Courier New\', Courier, monospace; width: ' + w + '; margin: 0 auto; color: #000; background-color: #fff; font-size: ' + fs + '; line-height: 1.4;">' +
    '<div style="text-align: center; margin-bottom: 6px;">' +
      '<h1 style="font-size: ' + fsTitle + '; font-weight: bold; margin: 0 0 2px 0;">' + (settings.storeName || "KASIR APP") + '</h1>' +
      (qSettings.showStoreAddress ? '<p style="font-size: ' + fsSmall + '; margin: 0 0 2px 0;">' + (settings.storeAddress || "") + '</p>' : '') +
      (qSettings.showStorePhone ? '<p style="font-size: ' + fsSmall + '; margin: 0 0 2px 0;">Tel: ' + (settings.storePhone || "") + '</p>' : '') +
      (qSettings.showStoreEmail ? '<p style="font-size: ' + fsSmall + '; margin: 0 0 2px 0;">' + (settings.storeEmail || "") + '</p>' : '') +
      (qSettings.showStoreWebsite ? '<p style="font-size: ' + fsSmall + '; margin: 0;">' + (settings.storeWebsite || "") + '</p>' : '') +
    '</div>' +

    '<p style="margin: 4px 0; text-align: center; overflow: hidden; white-space: nowrap;">' + dashLine + '</p>' +

    '<div style="text-align: center; margin: 4px 0;">' +
      '<p style="font-weight: bold; font-size: ' + fsBold + '; margin: 0;">' + (qSettings.headerTitle || "QUOTATION") + '</p>' +
      '<p style="font-size: ' + fsSmall + '; margin: 0;">' + (qSettings.headerSubtitle || "Penawaran Harga") + '</p>' +
    '</div>' +

    '<p style="margin: 0; text-align: center; overflow: hidden; white-space: nowrap;">' + dashLine + '</p>' +

    '<table style="width: 100%; margin: 4px 0; font-size: ' + fsSmall + '; border-collapse: collapse;">' +
      '<tr><td style="text-align: left;">No:</td><td style="text-align: right;">' + data.quoNo + '</td></tr>' +
      '<tr><td style="text-align: left;">Tgl:</td><td style="text-align: right;">' + data.dateStr + '</td></tr>' +
      '<tr><td style="text-align: left;">Berlaku:</td><td style="text-align: right;">' + qSettings.validityDays + ' hari</td></tr>' +
      (custObj.name ? '<tr><td style="text-align: left;">Kpd:</td><td style="text-align: right;">' + custObj.name + '</td></tr>' : '') +
    '</table>' +

    '<p style="margin: 0; text-align: center; overflow: hidden; white-space: nowrap;">' + dashLine + '</p>' +

    itemsHtml +

    '<p style="margin: 4px 0 0 0; text-align: center; overflow: hidden; white-space: nowrap;">' + dashLine + '</p>' +

    '<table style="width: 100%; margin: 2px 0; font-size: ' + fs + '; border-collapse: collapse;">' +
      '<tr><td style="text-align: left;">Subtotal</td><td style="text-align: right;">' + formatIDR(data.subtotal) + '</td></tr>' +
      (data.taxPercent > 0 ? '<tr><td style="text-align: left;">PPN (' + data.taxPercent + '%)</td><td style="text-align: right;">' + formatIDR(data.taxAmount) + '</td></tr>' : '') +
      '<tr><td style="text-align: left; font-weight: bold; font-size: ' + fsBold + ';">TOTAL</td><td style="text-align: right; font-weight: bold; font-size: ' + fsBold + ';">' + formatIDR(data.grandTotal) + '</td></tr>' +
    '</table>' +

    '<p style="margin: 0; text-align: center; overflow: hidden; white-space: nowrap;">' + dashLine + '</p>' +

    (data.notes ? '<div style="margin: 4px 0; font-size: ' + fsSmall + ';"><p style="margin: 0;">Catatan: ' + data.notes.replace(/\n/g, '<br/>') + '</p></div>' : '') +

    termsHtml +

    '<table style="width: 100%; margin: 12px 0 4px 0; font-size: ' + fsSmall + '; border-collapse: collapse;">' +
    '<tr>' +
    '<td style="width: 50%; text-align: center; vertical-align: top;">' +
      '<p style="margin: 0 0 24px 0;">' + (qSettings.signatureLeft || "Klien") + '</p>' +
      '<p style="margin: 0; border-top: 1px dashed #000; padding-top: 2px;">(' + (custObj.name || "........") + ')</p>' +
    '</td>' +
    '<td style="width: 50%; text-align: center; vertical-align: top;">' +
      '<p style="margin: 0 0 24px 0;">' + (qSettings.signatureRight || "Hormat Kami") + '</p>' +
      '<p style="margin: 0; border-top: 1px dashed #000; padding-top: 2px;">(' + (settings.storeName || "........") + ')</p>' +
    '</td>' +
    '</tr>' +
    '</table>' +

    '<p style="margin: 4px 0 0 0; text-align: center; overflow: hidden; white-space: nowrap;">' + dashLine + '</p>' +

    '<p style="text-align: center; font-size: ' + fsSmall + '; margin: 4px 0;">' + (qSettings.footerText || "Terima kasih atas kepercayaan Anda") + '</p>' +
    '</div>';
}

function generateSignaturesHtml(qSettings, custName, storeName) {
  var sLeftImg = qSettings.signatureLeftImage ? '<img src="' + qSettings.signatureLeftImage + '" style="max-width: 120px; max-height: 60px; margin-bottom: 8px;" />' : '<div style="height: 60px; margin-bottom: 8px;"></div>';
  var sRightImg = qSettings.signatureRightImage ? '<img src="' + qSettings.signatureRightImage + '" style="max-width: 120px; max-height: 60px; margin-bottom: 8px;" />' : '<div style="height: 60px; margin-bottom: 8px;"></div>';

  return '<table style="width: 100%; border-collapse: collapse; margin-top: 30px;">' +
    '<tr>' +
    '<td style="width: 50%; text-align: center; vertical-align: bottom;">' +
      '<p style="font-size: 12px; color: #475569; font-weight: bold; margin: 0 0 8px 0;">' + (qSettings.signatureLeft || "Menyetujui") + ',</p>' +
      sLeftImg +
      '<div style="border-top: 1px solid #cbd5e1; padding-top: 8px; display: inline-block; min-width: 180px;">' +
        '<p style="font-size: 12px; color: #64748b; margin: 0;">( ' + (custName || "...........................") + ' )</p>' +
      '</div>' +
    '</td>' +
    '<td style="width: 50%; text-align: center; vertical-align: bottom;">' +
      '<p style="font-size: 12px; color: #475569; font-weight: bold; margin: 0 0 8px 0;">' + (qSettings.signatureRight || "Hormat Kami") + ',</p>' +
      sRightImg +
      '<div style="border-top: 1px solid #cbd5e1; padding-top: 8px; display: inline-block; min-width: 180px;">' +
        '<p style="font-size: 12px; color: #64748b; margin: 0;">( ' + (storeName || "...........................") + ' )</p>' +
      '</div>' +
    '</td>' +
    '</tr>' +
    '</table>';
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
