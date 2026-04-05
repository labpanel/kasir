import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useStore from '../store/useStore';
import { api } from '../services/api';
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart, Package, X, Banknote, CreditCard, QrCode, FileText, Receipt, LayoutGrid, List, Percent, MessageSquare, Cloud, Settings, Upload, Image } from 'lucide-react';


// =============================================
// SIGNATURE BLOCK HELPER
// =============================================
const SignatureBlock = ({ label, name, image, style = {} }) => (
  <div style={{ flex: 1, textAlign: 'center', ...style }}>
    <p style={{ fontSize: '12px', color: '#475569', fontWeight: '600', margin: '0 0 8px 0' }}>{label},</p>
    {image ? (
      <div style={{ margin: '0 auto 8px auto', width: '120px', height: '60px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <img src={image} alt="Tanda tangan" style={{ maxWidth: '120px', maxHeight: '60px', objectFit: 'contain' }} />
      </div>
    ) : (
      <div style={{ height: '60px' }} />
    )}
    <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px', display: 'inline-block', minWidth: '180px' }}>
      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>( {name} )</p>
    </div>
  </div>
);

// =============================================
// 4 PRINT TEMPLATES
// =============================================

const TemplateProfessional = ({ data, settings, tSettings, formatIDR }) => {
  const accent = tSettings.accentColor || '#1e40af';
  return (
    <div className="print-template" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#1e293b', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {tSettings.showLogo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: accent, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>
                  {settings.storeName?.charAt(0) || 'K'}
                </div>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{settings.storeName}</h1>
                  {tSettings.showStoreAddress && <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{settings.storeAddress}</p>}
                </div>
              </div>
            )}
            {!tSettings.showLogo && <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0' }}>{settings.storeName}</h1>}
            {tSettings.showStoreAddress && !tSettings.showLogo && <p style={{ fontSize: '12px', color: '#64748b', margin: '0' }}>{settings.storeAddress}</p>}
            {tSettings.showStorePhone && <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Tel: {settings.storePhone}</p>}
            {tSettings.showStoreEmail && <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Email: {settings.storeEmail}</p>}
            {tSettings.showStoreWebsite && <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>{settings.storeWebsite}</p>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: accent, margin: 0, letterSpacing: '2px' }}>{tSettings.headerTitle || 'INVOICE'}</h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>{tSettings.headerSubtitle || 'Nota Transaksi'}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', gap: '24px' }}>
        <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>{data.supplierName ? 'Supplier' : 'Pelanggan'}</h4>
          <p style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b', margin: '0 0 4px 0' }}>{data.supplierName || data.customerName || 'Umum'}</p>
        </div>
        <div style={{ width: '220px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px 0' }}>No. Nota</p>
            <p style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>{data.receiptNo}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Tanggal</p>
            <p style={{ fontSize: '13px', margin: 0 }}>{new Date(data.date).toLocaleString('id-ID')}</p>
          </div>
          <div>
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Pembayaran</p>
            <p style={{ fontSize: '13px', margin: 0, fontWeight: '600' }}>{data.paymentMethod}</p>
          </div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ backgroundColor: accent }}>
            {['No', 'Produk / Deskripsi', 'Qty', 'Harga Satuan', 'Total'].map((h, i) => (
              <th key={i} style={{ padding: '12px 16px', color: 'white', fontSize: '12px', fontWeight: '700', textAlign: i === 2 ? 'center' : i > 2 ? 'right' : 'left', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{idx + 1}</td>
              <td style={{ padding: '12px 16px' }}><p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{item.name}</p></td>
              <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}>{item.qty}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#475569' }}>{formatIDR(item.price)}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700' }}>{formatIDR(item.price * item.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
        <div style={{ width: '280px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
            <span>Subtotal</span><span>{formatIDR(data.subtotal)}</span>
          </div>
          {data.taxPercent > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
              <span>PPN ({data.taxPercent}%)</span><span>{formatIDR(data.taxAmount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: accent, borderRadius: '8px', marginTop: '8px' }}>
            <span style={{ fontWeight: '800', fontSize: '16px', color: 'white' }}>TOTAL</span>
            <span style={{ fontWeight: '800', fontSize: '16px', color: 'white' }}>{formatIDR(data.grandTotal)}</span>
          </div>
          {data.paymentMethod === 'Cash' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#475569', marginTop: '8px' }}>
                <span>Dibayar</span><span>{formatIDR(data.payAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', fontWeight: '700', color: '#16a34a', borderTop: '1px dashed #e2e8f0' }}>
                <span>Kembalian</span><span>{formatIDR(data.change)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {tSettings.notes && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#92400e', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Catatan:</p>
          <p style={{ fontSize: '13px', color: '#78350f', margin: 0, whiteSpace: 'pre-wrap' }}>{tSettings.notes}</p>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '48px', marginTop: '20px' }}>
        <SignatureBlock label={tSettings.signatureLeft} name={data.customerName || data.supplierName || '...........................'} image={tSettings.signatureLeftImage} />
        <SignatureBlock label={tSettings.signatureRight} name={settings.storeName} image={tSettings.signatureRightImage} />
      </div>

      {tSettings.footerText && (
        <p style={{ textAlign: 'center', fontSize: '10px', color: '#94a3b8', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>{tSettings.footerText}</p>
      )}
    </div>
  );
};

const TemplateMinimalist = ({ data, settings, tSettings, formatIDR }) => (
  <div className="print-template" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#333', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #333', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>{settings.storeName}</h1>
          {tSettings.showStoreAddress && <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 0 0' }}>{settings.storeAddress}</p>}
          {tSettings.showStorePhone && <p style={{ fontSize: '12px', color: '#555', margin: '2px 0 0 0' }}>{settings.storePhone}</p>}
          {tSettings.showStoreEmail && <p style={{ fontSize: '12px', color: '#555', margin: '2px 0 0 0' }}>{settings.storeEmail}</p>}
          {tSettings.showStoreWebsite && <p style={{ fontSize: '12px', color: '#555', margin: '2px 0 0 0' }}>{settings.storeWebsite}</p>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', letterSpacing: '2px', color: '#555', margin: 0 }}>{tSettings.headerTitle || 'INVOICE'}</h2>
          <p style={{ fontSize: '12px', color: '#777', margin: '4px 0 0 0' }}>{tSettings.headerSubtitle || 'Nota Transaksi'}</p>
        </div>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
      <div>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', margin: '0 0 8px 0' }}>Kepada</p>
        <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 2px 0' }}>{data.customerName || data.supplierName || 'Umum'}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: '12px', color: '#555', margin: '0 0 4px 0' }}>Tanggal: {new Date(data.date).toLocaleDateString('id-ID')}</p>
        <p style={{ fontSize: '12px', color: '#555', margin: '0 0 4px 0' }}>Nomor: {data.receiptNo}</p>
        <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>Pembayaran: {data.paymentMethod}</p>
      </div>
    </div>

    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #333' }}>
          {['Deskripsi', 'Qty', 'Harga', 'Total'].map((h, i) => (
            <th key={i} style={{ padding: '10px 0', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: '#999', textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.items.map((item, idx) => (
          <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px 0' }}><span style={{ fontWeight: '500' }}>{item.name}</span></td>
            <td style={{ padding: '12px 0', textAlign: 'right' }}>{item.qty}</td>
            <td style={{ padding: '12px 0', textAlign: 'right', color: '#555' }}>{formatIDR(item.price)}</td>
            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '600' }}>{formatIDR(item.price * item.qty)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
      <div style={{ width: '240px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px', color: '#555' }}>
          <span>Subtotal</span><span>{formatIDR(data.subtotal)}</span>
        </div>
        {data.taxPercent > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px', color: '#555' }}>
            <span>PPN ({data.taxPercent}%)</span><span>{formatIDR(data.taxAmount)}</span>
          </div>
        )}
        <div style={{ borderTop: '2px solid #333', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: '700' }}>Total</span>
          <span style={{ fontSize: '14px', fontWeight: '700' }}>{formatIDR(data.grandTotal)}</span>
        </div>
        {data.paymentMethod === 'Cash' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px', color: '#555', marginTop: '8px' }}>
              <span>Dibayar</span><span>{formatIDR(data.payAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px', fontWeight: '700', color: '#333' }}>
              <span>Kembalian</span><span>{formatIDR(data.change)}</span>
            </div>
          </>
        )}
      </div>
    </div>

    {tSettings.notes && (
      <p style={{ fontSize: '12px', color: '#777', fontStyle: 'italic', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>Catatan: {tSettings.notes}</p>
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '60px', marginTop: '20px' }}>
      <SignatureBlock label={tSettings.signatureLeft} name={data.customerName || data.supplierName || '...............'} image={tSettings.signatureLeftImage} style={{ fontSize: '11px' }} />
      <SignatureBlock label={tSettings.signatureRight} name={settings.storeName} image={tSettings.signatureRightImage} style={{ fontSize: '11px' }} />
    </div>

    {tSettings.footerText && (
      <p style={{ textAlign: 'center', fontSize: '10px', color: '#aaa', marginTop: '30px' }}>{tSettings.footerText}</p>
    )}
  </div>
);

const TemplateClassic = ({ data, settings, tSettings, formatIDR }) => (
  <div className="print-template" style={{ fontFamily: "'Times New Roman', Times, serif", color: '#1a1a1a', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', borderBottom: '3px double #1a1a1a', paddingBottom: '16px', marginBottom: '24px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>{settings.storeName}</h1>
      {tSettings.showStoreAddress && <p style={{ fontSize: '13px', margin: '0 0 4px 0' }}>{settings.storeAddress}</p>}
      {tSettings.showStorePhone && <p style={{ fontSize: '13px', margin: '0 0 2px 0' }}>Telp: {settings.storePhone}</p>}
      {tSettings.showStoreEmail && <p style={{ fontSize: '13px', margin: '0 0 2px 0' }}>Email: {settings.storeEmail}</p>}
      {tSettings.showStoreWebsite && <p style={{ fontSize: '13px', margin: 0 }}>{settings.storeWebsite}</p>}
    </div>

    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0', textDecoration: 'underline' }}>{tSettings.headerTitle || 'INVOICE'}</h2>
      <p style={{ fontSize: '13px', margin: 0 }}>{tSettings.headerSubtitle || 'Nota Transaksi'} - No. {data.receiptNo}</p>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '13px' }}>
      <div>
        <p style={{ margin: '0 0 2px 0' }}><strong>Kepada Yth:</strong></p>
        <p style={{ margin: '0 0 2px 0' }}>{data.customerName || data.supplierName || 'Umum'}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: '0 0 2px 0' }}><strong>No:</strong> {data.receiptNo}</p>
        <p style={{ margin: '0 0 2px 0' }}><strong>Tanggal:</strong> {new Date(data.date).toLocaleDateString('id-ID')}</p>
        <p style={{ margin: 0 }}><strong>Pembayaran:</strong> {data.paymentMethod}</p>
      </div>
    </div>

    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #333' }}>
      <thead>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          {['No', 'Uraian', 'Qty', 'Harga Satuan', 'Jumlah'].map((h, i) => (
            <th key={i} style={{ border: '1px solid #333', padding: '8px 10px', fontSize: '12px', fontWeight: '700', textAlign: i === 0 || i === 2 ? 'center' : i > 2 ? 'right' : 'left' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.items.map((item, idx) => (
          <tr key={idx}>
            <td style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'center', fontSize: '13px' }}>{idx + 1}</td>
            <td style={{ border: '1px solid #999', padding: '8px 10px', fontSize: '13px' }}>{item.name}</td>
            <td style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'center', fontSize: '13px' }}>{item.qty}</td>
            <td style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'right', fontSize: '13px' }}>{formatIDR(item.price)}</td>
            <td style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'right', fontSize: '13px', fontWeight: '600' }}>{formatIDR(item.price * item.qty)}</td>
          </tr>
        ))}
        {data.taxPercent > 0 && (
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <td colSpan="4" style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'right', fontSize: '13px' }}>PPN ({data.taxPercent}%)</td>
            <td style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'right', fontSize: '13px' }}>{formatIDR(data.taxAmount)}</td>
          </tr>
        )}
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          <td colSpan="4" style={{ border: '1px solid #333', padding: '10px', textAlign: 'right', fontWeight: '700', fontSize: '14px' }}>TOTAL</td>
          <td style={{ border: '1px solid #333', padding: '10px', textAlign: 'right', fontWeight: '700', fontSize: '14px' }}>{formatIDR(data.grandTotal)}</td>
        </tr>
        {data.paymentMethod === 'Cash' && (
          <>
            <tr>
              <td colSpan="4" style={{ border: '1px solid #999', padding: '6px 10px', textAlign: 'right', fontSize: '13px' }}>Dibayar</td>
              <td style={{ border: '1px solid #999', padding: '6px 10px', textAlign: 'right', fontSize: '13px' }}>{formatIDR(data.payAmount)}</td>
            </tr>
            <tr style={{ backgroundColor: '#fafafa' }}>
              <td colSpan="4" style={{ border: '1px solid #999', padding: '6px 10px', textAlign: 'right', fontSize: '13px', fontWeight: '700' }}>Kembalian</td>
              <td style={{ border: '1px solid #999', padding: '6px 10px', textAlign: 'right', fontSize: '13px', fontWeight: '700' }}>{formatIDR(data.change)}</td>
            </tr>
          </>
        )}
      </tbody>
    </table>

    {tSettings.notes && (
      <p style={{ fontSize: '12px', color: '#555', marginBottom: '16px', whiteSpace: 'pre-wrap' }}><strong>Catatan:</strong><br/>{tSettings.notes}</p>
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '48px', marginTop: '24px' }}>
      <SignatureBlock label={tSettings.signatureLeft} name={data.customerName || data.supplierName || '...........................'} image={tSettings.signatureLeftImage} />
      <SignatureBlock label={tSettings.signatureRight} name={settings.storeName} image={tSettings.signatureRightImage} />
    </div>

    {tSettings.footerText && <p style={{ fontSize: '12px', color: '#555', marginTop: '24px', textAlign: 'center' }}>{tSettings.footerText}</p>}
  </div>
);

const TemplateThermal = ({ data, settings, tSettings, formatIDR }) => {
  const is80 = tSettings.thermalPaperWidth === '80mm';
  const w = is80 ? '80mm' : '58mm';
  const fs = is80 ? '12px' : '10px';
  const fsSmall = is80 ? '10px' : '8px';
  const fsBold = is80 ? '14px' : '11px';
  const dash = is80 ? '------------------------------------------------' : '--------------------------------';
  const compact = (val) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);

  return (
    <div className="print-template" style={{ fontFamily: "'Courier New', Courier, monospace", width: w, maxWidth: w, margin: '0 auto', padding: '4px 6px', color: '#000', backgroundColor: '#fff', fontSize: fs, lineHeight: '1.4' }}>
      <div style={{ textAlign: 'center', marginBottom: '4px' }}>
        <p style={{ fontSize: fsBold, fontWeight: '700', margin: 0 }}>{settings.storeName}</p>
        <p style={{ fontSize: fsSmall, margin: 0 }}>{settings.storeAddress}</p>
        <p style={{ fontSize: fsSmall, margin: '0 0 2px 0' }}>Tel: {settings.storePhone}</p>
      </div>
      <p style={{ margin: 0 }}>{dash}</p>
      <p style={{ textAlign: 'center', fontWeight: '700', fontSize: fsBold, margin: '2px 0' }}>{tSettings.headerTitle || 'NOTA'}</p>
      <p style={{ margin: 0 }}>{dash}</p>
      <div style={{ margin: '2px 0', fontSize: fsSmall }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>No:</span><span>{data.receiptNo}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tgl:</span><span>{new Date(data.date).toLocaleString('id-ID')}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Bayar:</span><span>{data.paymentMethod}</span></div>
        {data.customerName && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Plg:</span><span>{data.customerName}</span></div>}
        {data.supplierName && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sup:</span><span>{data.supplierName}</span></div>}
      </div>
      <p style={{ margin: 0 }}>{dash}</p>
      {data.items.map((item, idx) => (
        <div key={idx} style={{ margin: '3px 0' }}>
          <p style={{ margin: 0, fontWeight: '600' }}>{item.name}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fsSmall }}>
            <span>{item.qty} x {compact(item.price)}</span>
            <span style={{ fontWeight: '600' }}>{compact(item.price * item.qty)}</span>
          </div>
        </div>
      ))}
      <p style={{ margin: '3px 0 0 0' }}>{dash}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs, margin: '1px 0' }}>
        <span>Subtotal</span><span>{formatIDR(data.subtotal)}</span>
      </div>
      {data.taxPercent > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs, margin: '1px 0' }}>
          <span>PPN ({data.taxPercent}%)</span><span>{formatIDR(data.taxAmount)}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: fsBold, margin: '3px 0' }}>
        <span>TOTAL</span><span>{formatIDR(data.grandTotal)}</span>
      </div>
      {data.paymentMethod === 'Cash' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs, margin: '1px 0' }}>
            <span>Dibayar</span><span>{formatIDR(data.payAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs, fontWeight: '700', margin: '1px 0' }}>
            <span>Kembali</span><span>{formatIDR(data.change)}</span>
          </div>
        </>
      )}
      {tSettings.notes && (
        <>
          <p style={{ margin: '3px 0 0 0' }}>{dash}</p>
          <p style={{ margin: '4px 0', fontSize: fsSmall, whiteSpace: 'pre-wrap' }}>Catatan: {tSettings.notes}</p>
        </>
      )}
      <p style={{ margin: '3px 0 0 0' }}>{dash}</p>
      <p style={{ textAlign: 'center', fontSize: fsSmall, margin: '4px 0' }}>{tSettings.footerText || 'Terima kasih atas kunjungan Anda'}</p>
    </div>
  );
};

const TEMPLATES = {
  professional: { id: 'professional', name: 'Profesional', desc: 'Modern, rapi, warna bisa diubah', comp: TemplateProfessional },
  minimalist: { id: 'minimalist', name: 'Minimalis', desc: 'Bersih, elegan, tanpa kotak batas', comp: TemplateMinimalist },
  classic: { id: 'classic', name: 'Klasik', desc: 'Resmi, tabel bergaris, hitam putih', comp: TemplateClassic },
  thermal: { id: 'thermal', name: 'Printer Thermal', desc: 'Lebar 58mm / 80mm untuk printer struk', comp: TemplateThermal },
};
// =============================================

// PAYMENT METHOD OPTIONS
// =============================================
const PAYMENT_METHODS = [
  { id: 'Cash', label: 'Cash', icon: Banknote, color: 'green' },
  { id: 'Transfer', label: 'Transfer', icon: CreditCard, color: 'blue' },
  { id: 'QRIS', label: 'QRIS', icon: QrCode, color: 'purple' },
];

// =============================================
// MAIN COMPONENT
// =============================================
const Transaksi = () => {
  const { cart, addToCart, updateCartItemQty, removeFromCart, clearCart, settings, transactionSettings: tSettings, updateTransactionSettings } = useStore();
  const [showSettings, setShowSettings] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [searchCode, setSearchCode] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [transactionType, setTransactionType] = useState('Penjualan');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxPercent, setTaxPercent] = useState(11);

  // Receipt state
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptFormat, setReceiptFormat] = useState('thermal'); // 'thermal' or 'a4'

  useEffect(() => {
    const loadData = async () => {
      const [prods, custs, sups] = await Promise.all([api.getProducts(), api.getCustomers(), api.getSuppliers()]);
      setProducts(prods || []);
      setCustomers(custs || []);
      setSuppliers(sups || []);
    };
    loadData();
  }, []);

  const handleScanCode = (e) => {
    e.preventDefault();
    const product = products.find(p => p.code.toLowerCase() === searchCode.toLowerCase());
    if (product) { addToCart(product); setSearchCode(''); }
    else { alert('Produk tidak ditemukan!'); }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const calculatePrice = (item) => transactionType === 'Penjualan' ? item.sellingPrice : item.purchasePrice;
  const subtotal = cart.reduce((sum, item) => sum + (calculatePrice(item) * item.qty), 0);
  const taxAmount = taxEnabled ? Math.round(subtotal * taxPercent / 100) : 0;
  const grandTotal = subtotal + taxAmount;
  const change = Math.max(0, Number(payAmount || 0) - grandTotal);

  const generateReceiptNo = () => {
    const d = new Date();
    return `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  };

  const handleProcessTransaction = async () => {
    if (cart.length === 0) return;
    // Cash needs sufficient payment, Transfer/QRIS auto-fill exact amount
    if (paymentMethod === 'Cash' && Number(payAmount) < subtotal) {
      alert('Uang pembayaran kurang!');
      return;
    }
    setLoading(true);
    try {
      const custObj = customers.find(c => c.phone === selectedCustomer);
      const supObj = suppliers.find(s => s.phone === selectedSupplier);
      const actualPayAmount = paymentMethod === 'Cash' ? Number(payAmount) : grandTotal;
      const actualChange = paymentMethod === 'Cash' ? Math.max(0, actualPayAmount - grandTotal) : 0;

      const data = {
        date: new Date().toISOString(),
        type: transactionType,
        paymentMethod,
        customerId: transactionType === 'Penjualan' ? selectedCustomer : '',
        customerName: transactionType === 'Penjualan' ? (custObj?.name || '') : '',
        supplierId: transactionType === 'Pembelian' ? selectedSupplier : '',
        supplierName: transactionType === 'Pembelian' ? (supObj?.name || selectedSupplier) : '',
        receiptNo: generateReceiptNo(),
        items: cart.map(item => ({
          code: item.code,
          name: item.name,
          qty: item.qty,
          price: calculatePrice(item)
        })),
        subtotal,
        taxPercent: taxEnabled ? taxPercent : 0,
        taxAmount,
        grandTotal,
        payAmount: actualPayAmount,
        change: actualChange,
        settings,
        tSettings
      };
      await api.saveTransaction(data);

      // Store receipt data and show print dialog
      // Auto-select thermal on mobile if settings allow
      if (window.innerWidth < 768 && settings.autoThermalMobile !== false) {
        setReceiptFormat('thermal');
      }
      setReceiptData(data);
      setShowReceipt(true);

      clearCart();
      setPayAmount('');
      setSelectedCustomer('');
      setSelectedSupplier('');
    } catch (err) {
      alert('Gagal memproses transaksi');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    setTimeout(() => { window.print(); }, 200);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
  };

  const handleSendWhatsApp = () => {
    if (!receiptData) return;
    const itemsText = receiptData.items.map(item => 
      `${item.qty}x ${item.name} - ${formatIDR(item.price * item.qty)}`
    ).join('\n');

    const message = `
*${settings.storeName || 'NOTA TRANSAKSI'}*
--------------------------------
No: ${receiptData.receiptNo}
Tgl: ${new Date(receiptData.date).toLocaleString('id-ID')}
--------------------------------
${itemsText}
--------------------------------
*Subtotal: ${formatIDR(receiptData.subtotal)}*
${receiptData.taxAmount > 0 ? `PPN (${receiptData.taxPercent}%): ${formatIDR(receiptData.taxAmount)}` : ''}
*TOTAL: ${formatIDR(receiptData.grandTotal)}*
--------------------------------
Terima kasih!
    `.trim();

    const phone = receiptData.customerId || '';
    const waUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleSaveToDrive = async () => {
    if (!receiptData) return;
    setLoading(true);
    try {
      const res = await api.getTransactionPdfLink({ ...receiptData, settings, tSettings });
      if (res.success) {
        window.open(res.url, '_blank');
      } else {
        alert('Gagal menyimpan ke Drive: ' + res.error);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan ke Drive');
    } finally {
      setLoading(false);
    }
  };

  const canProcess = paymentMethod === 'Cash'
    ? cart.length > 0 && Number(payAmount) >= subtotal
    : cart.length > 0;


  const SelectedTemplate = TEMPLATES[tSettings.template]?.comp || TemplateProfessional;

  return (
    <>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:h-[calc(100vh-7rem)] print:hidden">
        {/* Product List Panel */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[35vh] lg:min-h-0">
          <div className="p-3 md:p-4 border-b border-gray-100 space-y-3">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                onClick={() => setTransactionType('Penjualan')}
                className={`px-3 md:px-4 py-2 text-sm font-bold rounded-md transition ${transactionType === 'Penjualan' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Penjualan
              </button>
              <button
                onClick={() => setTransactionType('Pembelian')}
                className={`px-3 md:px-4 py-2 text-sm font-bold rounded-md transition ${transactionType === 'Pembelian' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pembelian
              </button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Cari produk..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex bg-gray-100 rounded-xl p-1 shrink-0">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><LayoutGrid className="w-5 h-5" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><List className="w-5 h-5" /></button>
              </div>
              <button onClick={() => setShowSettings(true)} className="flex items-center justify-center p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition shadow-sm" title="Pengaturan Template"><Settings className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="p-3 md:p-4 flex-1 overflow-y-auto max-h-[30vh] lg:max-h-none">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.map(prod => (
                  <div key={prod.code} onClick={() => addToCart(prod)} className="border border-gray-100 rounded-xl p-3 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center group">
                    <div className="w-10 h-10 bg-blue-50 rounded-full mb-2 flex items-center justify-center text-blue-400 group-hover:bg-blue-100 group-hover:text-blue-600"><Package className="w-5 h-5" /></div>
                    <h4 className="font-semibold text-gray-800 text-xs line-clamp-2 mb-1">{prod.name}</h4>
                    <p className="text-gray-500 text-xs mb-1">Stok: {prod.stock}</p>
                    <p className="text-blue-600 font-bold text-xs mt-auto">{formatIDR(transactionType === 'Penjualan' ? prod.sellingPrice : prod.purchasePrice)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 font-medium">Nama Barang</th>
                      <th className="px-4 py-3 font-medium text-center w-20">Stok</th>
                      <th className="px-4 py-3 font-medium text-right w-28">Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(prod => (
                      <tr key={prod.code} onClick={() => addToCart(prod)} className="hover:bg-blue-50 cursor-pointer transition-colors text-sm">
                        <td className="px-4 py-2.5 font-medium text-gray-800">{prod.name}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${prod.stock > 10 ? 'bg-green-100 text-green-700' : prod.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{prod.stock}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-blue-600 text-sm">{formatIDR(transactionType === 'Penjualan' ? prod.sellingPrice : prod.purchasePrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Cart & Payment Panel */}
        <div className="w-full lg:w-[400px] flex flex-col gap-3">
          {/* Customer / Supplier */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            {transactionType === 'Penjualan' ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pelanggan</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                  <option value="">-- Opsional --</option>
                  {customers.map(c => (<option key={c.phone} value={c.phone}>{c.name} ({c.phone})</option>))}
                </select>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier / Pemasok</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                  <option value="">-- Pilih Supplier --</option>
                  {suppliers.map(s => (<option key={s.phone} value={s.phone}>{s.name}{s.company ? ` (${s.company})` : ''}</option>))}
                </select>
              </>
            )}
          </div>

          {/* Cart */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <form onSubmit={handleScanCode} className="flex gap-2">
                <input type="text" placeholder="Scan kode..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
                <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">Tambah</button>
              </form>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ShoppingCart className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-sm">Keranjang Kosong</p>
                </div>
              ) : (
                cart.map((item) => {
                  const itemPrice = calculatePrice(item);
                  return (
                    <div key={item.code} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm text-gray-800 truncate">{item.name}</h5>
                        <p className="text-xs text-gray-500">{formatIDR(itemPrice)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => item.qty > 1 ? updateCartItemQty(item.code, item.qty - 1) : removeFromCart(item.code)} className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateCartItemQty(item.code, item.qty + 1)} className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right w-20 font-bold text-sm text-gray-800">
                        {formatIDR(itemPrice * item.qty)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Payment Section */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between text-sm text-gray-600 pb-1">
                <span>Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>

              {/* Tax Toggle */}
              <div className="flex items-center justify-between gap-2 py-2 border-b border-dashed border-gray-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={taxEnabled} onChange={(e) => setTaxEnabled(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                  <Percent className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">PPN</span>
                </label>
                {taxEnabled && (
                  <div className="flex items-center gap-1">
                    <input type="number" min="0" max="100" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} className="w-14 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                    <span className="text-xs text-gray-500">%</span>
                    <span className="text-sm font-bold text-orange-600 ml-2">{formatIDR(taxAmount)}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-1">
                <span>Total</span>
                <span className="text-blue-600">{formatIDR(grandTotal)}</span>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">METODE PEMBAYARAN</label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(m => {
                    const Icon = m.icon;
                    const isActive = paymentMethod === m.id;
                    const colors = {
                      green: isActive ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300',
                      blue: isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300',
                      purple: isActive ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500 hover:border-gray-300',
                    };
                    return (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition font-bold text-xs ${colors[m.color]}`}
                      >
                        <Icon className="w-5 h-5" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cash Input */}
              {paymentMethod === 'Cash' && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">DIBAYAR</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none text-right"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex justify-between text-gray-700 bg-green-50 p-3 rounded-xl border border-green-100">
                    <span className="font-medium text-sm">Kembalian</span>
                    <span className="font-bold text-lg text-green-700">{formatIDR(change)}</span>
                  </div>
                </div>
              )}

              {/* Transfer / QRIS Info */}
              {paymentMethod === 'Transfer' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                  <CreditCard className="w-8 h-8 mx-auto text-blue-500 mb-1" />
                  <p className="text-sm font-bold text-blue-800">Transfer Bank</p>
                  <p className="text-xs text-blue-600">Pastikan pembayaran sudah diterima</p>
                  <p className="text-lg font-bold text-blue-900 mt-1">{formatIDR(grandTotal)}</p>
                </div>
              )}
              {paymentMethod === 'QRIS' && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
                  <QrCode className="w-8 h-8 mx-auto text-purple-500 mb-1" />
                  <p className="text-sm font-bold text-purple-800">QRIS</p>
                  <p className="text-xs text-purple-600">Scan QR atau pastikan pembayaran diterima</p>
                  <p className="text-lg font-bold text-purple-900 mt-1">{formatIDR(grandTotal)}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={clearCart}
                  className="py-3 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl flex items-center justify-center gap-2 transition text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Batal
                </button>
                <button
                  disabled={loading || !canProcess}
                  onClick={handleProcessTransaction}
                  className="py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition text-sm"
                >
                  <Printer className="w-4 h-4" /> Proses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================= */}
      {/* RECEIPT MODAL (after successful transaction) */}
      {/* ============================================= */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-800">✅ Transaksi Berhasil!</h2>
                <p className="text-sm text-gray-500">{receiptData.receiptNo}</p>
              </div>
              <button onClick={handleCloseReceipt} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>

            {/* Summary */}
            <div className="p-5 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-sm text-green-700 font-medium">Total Pembayaran</p>
                <p className="text-3xl font-bold text-green-800">{formatIDR(receiptData.subtotal)}</p>
                <p className="text-xs text-green-600 mt-1">via {receiptData.paymentMethod}</p>
                {receiptData.paymentMethod === 'Cash' && receiptData.change > 0 && (
                  <p className="text-sm text-green-700 mt-2 font-bold">Kembalian: {formatIDR(receiptData.change)}</p>
                )}
              </div>

              {/* Print Format Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cetak Nota:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setReceiptFormat('thermal')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${receiptFormat === 'thermal' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Receipt className="w-8 h-8 text-amber-600" />
                    <div className="text-center">
                      <p className="font-bold text-sm text-gray-800">Thermal</p>
                      <p className="text-xs text-gray-500">Struk {settings.thermalPrinter || '58mm'}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setReceiptFormat('a4')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${receiptFormat === 'a4' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="text-center">
                      <p className="font-bold text-sm text-gray-800">A4 / PDF</p>
                      <p className="text-xs text-gray-500">Kertas A4 standar</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Advanced Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSendWhatsApp}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition font-bold text-sm"
                >
                  <MessageSquare className="w-5 h-5" /> WhatsApp
                </button>
                <button
                  onClick={handleSaveToDrive}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-bold text-sm"
                >
                  <Cloud className="w-5 h-5" /> Simpan ke Drive
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 border-t border-gray-100 flex gap-3 shrink-0">
              <button onClick={handleCloseReceipt} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition text-sm">
                Lewati
              </button>
              <button onClick={handlePrintReceipt} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm shadow-md">
                <Printer className="w-4 h-4" /> Cetak Nota
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Pengaturan Template Invoice</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Template Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Template Cetak:</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(TEMPLATES).map(([key, t]) => (
                    <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${tSettings.template === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="template" checked={tSettings.template === key} onChange={() => updateTransactionSettings({ template: key })} className="accent-blue-600" />
                      <div>
                        <p className="font-bold text-sm text-gray-800">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Thermal Paper Size - only show when thermal selected */}
              {tSettings.template === 'thermal' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <label className="block text-sm font-bold text-amber-800 mb-2">🖨️ Ukuran Kertas Thermal:</label>
                  <div className="flex gap-3">
                    {['58mm', '80mm'].map(size => (
                      <label key={size} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition text-sm font-bold ${tSettings.thermalPaperWidth === size ? 'border-amber-500 bg-amber-100 text-amber-800' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                        <input type="radio" name="thermalSize" checked={tSettings.thermalPaperWidth === size} onChange={() => updateTransactionSettings({ thermalPaperWidth: size })} className="accent-amber-600" />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Header Texts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Judul Dokumen:</label>
                  <input type="text" value={tSettings.headerTitle || ''} onChange={e => updateTransactionSettings({ headerTitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="INVOICE" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Sub-judul Dokumen:</label>
                  <input type="text" value={tSettings.headerSubtitle || ''} onChange={e => updateTransactionSettings({ headerSubtitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Nota Transaksi" />
                </div>
              </div>

              {/* Show Header Visibility */}
              <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tampilkan di Header:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tSettings.showLogo} onChange={e => updateTransactionSettings({ showLogo: e.target.checked })} className="accent-blue-600 w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Logo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tSettings.showStoreAddress} onChange={e => updateTransactionSettings({ showStoreAddress: e.target.checked })} className="accent-blue-600 w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Alamat</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tSettings.showStorePhone} onChange={e => updateTransactionSettings({ showStorePhone: e.target.checked })} className="accent-blue-600 w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Telepon</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tSettings.showStoreEmail} onChange={e => updateTransactionSettings({ showStoreEmail: e.target.checked })} className="accent-blue-600 w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tSettings.showStoreWebsite} onChange={e => updateTransactionSettings({ showStoreWebsite: e.target.checked })} className="accent-blue-600 w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Website</span>
                  </label>
                </div>
              </div>

              {/* Accent Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Warna Aksen:</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={tSettings.accentColor} onChange={e => updateTransactionSettings({ accentColor: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" />
                    <span className="text-sm text-gray-500">{tSettings.accentColor}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Label TTD Kiri:</label>
                  <input type="text" value={tSettings.signatureLeft} onChange={e => updateTransactionSettings({ signatureLeft: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Label TTD Kanan:</label>
                  <input type="text" value={tSettings.signatureRight} onChange={e => updateTransactionSettings({ signatureRight: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>

              {/* Signature Image Upload */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Upload TTD Kiri:</label>
                  {tSettings.signatureLeftImage ? (
                    <div className="relative border rounded-lg p-2 bg-gray-50 flex items-center gap-3">
                      <img src={tSettings.signatureLeftImage} alt="TTD Kiri" className="h-12 object-contain" />
                      <button onClick={() => updateTransactionSettings({ signatureLeftImage: '' })} className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition">
                      <Upload className="w-4 h-4" />
                      <span>Pilih gambar...</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => updateTransactionSettings({ signatureLeftImage: ev.target.result });
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Upload TTD Kanan:</label>
                  {tSettings.signatureRightImage ? (
                    <div className="relative border rounded-lg p-2 bg-gray-50 flex items-center gap-3">
                      <img src={tSettings.signatureRightImage} alt="TTD Kanan" className="h-12 object-contain" />
                      <button onClick={() => updateTransactionSettings({ signatureRightImage: '' })} className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition">
                      <Upload className="w-4 h-4" />
                      <span>Pilih gambar...</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => updateTransactionSettings({ signatureRightImage: ev.target.result });
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Catatan Khusus Transaksi:</label>
                <textarea rows={3} value={tSettings.notes || ''} onChange={e => updateTransactionSettings({ notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Misal: Barang yang sudah dibeli tidak dapat digaransikan..." />
              </div>
              
              {/* Footer */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Footer (opsional):</label>
                <input type="text" value={tSettings.footerText} onChange={e => updateTransactionSettings({ footerText: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Misal: Terima kasih atas kepercayaan Anda" />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowSettings(false)} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY VIEW (portal to body) */}
      {receiptData && createPortal(
        <div id="print-area" className="hidden print:block">
          {receiptFormat === 'thermal'
            ? <TemplateThermal data={receiptData} settings={settings} tSettings={tSettings} formatIDR={formatIDR} />
            : <SelectedTemplate data={receiptData} settings={settings} tSettings={tSettings} formatIDR={formatIDR} />
          }
        </div>,
        document.body
      )}
    </>
  );
};


export default Transaksi;
