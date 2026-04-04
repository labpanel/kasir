import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../services/api';
import useStore from '../store/useStore';
import { Search, Plus, Minus, Trash2, Printer, Settings, X, ChevronDown, ChevronUp, Upload, Image, Percent } from 'lucide-react';

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
// 3 PRINT TEMPLATES
// =============================================

const TemplateProfessional = ({ settings, qSettings, custObj, cart, subtotal, taxPercent, taxAmount, grandTotal, quotationNo, notes, formatIDR }) => {
  const accent = qSettings.accentColor || '#1e40af';
  return (
    <div className="print-template" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#1e293b' }}>
      {/* Letterhead */}
      <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {qSettings.showLogo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: accent, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>
                  {settings.storeName?.charAt(0) || 'K'}
                </div>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{settings.storeName}</h1>
                  {qSettings.showStoreAddress && <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{settings.storeAddress}</p>}
                </div>
              </div>
            )}
            {!qSettings.showLogo && <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0' }}>{settings.storeName}</h1>}
            {qSettings.showStoreAddress && !qSettings.showLogo && <p style={{ fontSize: '12px', color: '#64748b', margin: '0' }}>{settings.storeAddress}</p>}
            {qSettings.showStorePhone && <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Tel: {settings.storePhone}</p>}
            {qSettings.showStoreEmail && <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Email: {settings.storeEmail}</p>}
            {qSettings.showStoreWebsite && <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>{settings.storeWebsite}</p>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: accent, margin: 0, letterSpacing: '2px' }}>{qSettings.headerTitle || 'QUOTATION'}</h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>{qSettings.headerSubtitle || 'Penawaran Harga'}</p>
          </div>
        </div>
      </div>

      {/* Info Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', gap: '24px' }}>
        <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>Ditujukan Kepada</h4>
          <p style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b', margin: '0 0 4px 0' }}>{custObj.name || '[Nama Pelanggan]'}</p>
          <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 2px 0' }}>{custObj.address || '[Alamat]'}</p>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{custObj.phone || '[Telepon]'}</p>
        </div>
        <div style={{ width: '200px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px 0' }}>No. Quotation</p>
            <p style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>{quotationNo}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Tanggal</p>
            <p style={{ fontSize: '13px', margin: 0 }}>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div>
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Berlaku Sampai</p>
            <p style={{ fontSize: '13px', margin: 0 }}>{new Date(Date.now() + qSettings.validityDays * 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ backgroundColor: accent }}>
            {['No', 'Produk / Deskripsi', 'Qty', 'Harga Satuan', 'Total'].map((h, i) => (
              <th key={i} style={{ padding: '12px 16px', color: 'white', fontSize: '12px', fontWeight: '700', textAlign: i === 2 ? 'center' : i > 2 ? 'right' : 'left', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cart.map((item, idx) => (
            <tr key={item.code} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{idx + 1}</td>
              <td style={{ padding: '12px 16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{item.name}</p>
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}>{item.qty}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#475569' }}>{formatIDR(item.sellingPrice)}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700' }}>{formatIDR(item.sellingPrice * item.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
        <div style={{ width: '280px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
            <span>Subtotal</span><span>{formatIDR(subtotal)}</span>
          </div>
          {taxPercent > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
              <span>PPN ({taxPercent}%)</span><span>{formatIDR(taxAmount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: accent, borderRadius: '8px', marginTop: '8px' }}>
            <span style={{ fontWeight: '800', fontSize: '16px', color: 'white' }}>TOTAL</span>
            <span style={{ fontWeight: '800', fontSize: '16px', color: 'white' }}>{formatIDR(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#92400e', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Catatan:</p>
          <p style={{ fontSize: '13px', color: '#78350f', margin: 0, whiteSpace: 'pre-wrap' }}>{notes}</p>
        </div>
      )}

      {/* Terms */}
      {qSettings.terms.length > 0 && (
        <div style={{ fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '32px' }}>
          <p style={{ fontWeight: '700', color: '#64748b', margin: '0 0 6px 0' }}>Syarat & Ketentuan:</p>
          <ol style={{ margin: 0, paddingLeft: '16px' }}>
            {qSettings.terms.map((t, i) => <li key={i} style={{ marginBottom: '3px' }}>{t}</li>)}
          </ol>
        </div>
      )}

      {/* Signature */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '48px' }}>
        <SignatureBlock label={qSettings.signatureLeft} name={custObj.name || '...........................'} image={qSettings.signatureLeftImage} />
        <SignatureBlock label={qSettings.signatureRight} name={settings.storeName} image={qSettings.signatureRightImage} />
      </div>

      {qSettings.footerText && (
        <p style={{ textAlign: 'center', fontSize: '10px', color: '#94a3b8', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>{qSettings.footerText}</p>
      )}
    </div>
  );
};

const TemplateMinimalist = ({ settings, qSettings, custObj, cart, subtotal, taxPercent, taxAmount, grandTotal, quotationNo, notes, formatIDR }) => (
  <div className="print-template" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#333', padding: '20px' }}>
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #333', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>{settings.storeName}</h1>
          {qSettings.showStoreAddress && <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 0 0' }}>{settings.storeAddress}</p>}
          {qSettings.showStorePhone && <p style={{ fontSize: '12px', color: '#555', margin: '2px 0 0 0' }}>{settings.storePhone}</p>}
          {qSettings.showStoreEmail && <p style={{ fontSize: '12px', color: '#555', margin: '2px 0 0 0' }}>{settings.storeEmail}</p>}
          {qSettings.showStoreWebsite && <p style={{ fontSize: '12px', color: '#555', margin: '2px 0 0 0' }}>{settings.storeWebsite}</p>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', letterSpacing: '2px', color: '#555', margin: 0 }}>{qSettings.headerTitle || 'QUOTATION'}</h2>
          <p style={{ fontSize: '12px', color: '#777', margin: '4px 0 0 0' }}>{qSettings.headerSubtitle || 'Penawaran Harga'}</p>
        </div>
      </div>
    </div>

    {/* Customer */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
      <div>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', margin: '0 0 8px 0' }}>Kepada</p>
        <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 2px 0' }}>{custObj.name || '—'}</p>
        <p style={{ fontSize: '12px', color: '#333', margin: 0 }}>{custObj.address || ''}</p>
        <p style={{ fontSize: '12px', color: '#333', margin: 0 }}>{custObj.phone || ''}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: '12px', color: '#555', margin: '0 0 4px 0' }}>Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
        <p style={{ fontSize: '12px', color: '#555', margin: '0 0 4px 0' }}>Nomor: {quotationNo}</p>
        <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>Valid s.d: {new Date(Date.now() + qSettings.validityDays * 86400000).toLocaleDateString('id-ID')}</p>
      </div>
    </div>

    {/* Table */}
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #333' }}>
          {['Deskripsi', 'Qty', 'Harga', 'Total'].map((h, i) => (
            <th key={i} style={{ padding: '10px 0', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: '#999', textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cart.map((item) => (
          <tr key={item.code} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px 0' }}>
              <span style={{ fontWeight: '500' }}>{item.name}</span>
            </td>
            <td style={{ padding: '12px 0', textAlign: 'right' }}>{item.qty}</td>
            <td style={{ padding: '12px 0', textAlign: 'right', color: '#555' }}>{formatIDR(item.sellingPrice)}</td>
            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '600' }}>{formatIDR(item.sellingPrice * item.qty)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Total */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
      <div style={{ width: '240px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px', color: '#555' }}>
          <span>Subtotal</span><span>{formatIDR(subtotal)}</span>
        </div>
        {taxPercent > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px', color: '#555' }}>
            <span>PPN ({taxPercent}%)</span><span>{formatIDR(taxAmount)}</span>
          </div>
        )}
        <div style={{ borderTop: '2px solid #333', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: '700' }}>Total</span>
          <span style={{ fontSize: '14px', fontWeight: '700' }}>{formatIDR(grandTotal)}</span>
        </div>
      </div>
    </div>

    {notes && <p style={{ fontSize: '12px', color: '#777', fontStyle: 'italic', marginBottom: '20px' }}>Catatan: {notes}</p>}

    {qSettings.terms.length > 0 && (
      <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '40px' }}>
        <p style={{ margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Syarat & Ketentuan</p>
        {qSettings.terms.map((t, i) => <p key={i} style={{ margin: '0 0 2px 0' }}>{i + 1}. {t}</p>)}
      </div>
    )}

    {/* Signature */}
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '60px', marginTop: '40px' }}>
      <SignatureBlock label={qSettings.signatureLeft} name={custObj.name || '...............'} image={qSettings.signatureLeftImage} style={{ fontSize: '11px' }} />
      <SignatureBlock label={qSettings.signatureRight} name={settings.storeName} image={qSettings.signatureRightImage} style={{ fontSize: '11px' }} />
    </div>
  </div>
);

const TemplateClassic = ({ settings, qSettings, custObj, cart, subtotal, taxPercent, taxAmount, grandTotal, quotationNo, notes, formatIDR }) => (
  <div className="print-template" style={{ fontFamily: "'Times New Roman', Times, serif", color: '#1a1a1a', padding: '20px' }}>
    {/* Header */}
    <div style={{ textAlign: 'center', borderBottom: '3px double #1a1a1a', paddingBottom: '16px', marginBottom: '24px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>{settings.storeName}</h1>
      {qSettings.showStoreAddress && <p style={{ fontSize: '13px', margin: '0 0 4px 0' }}>{settings.storeAddress}</p>}
      {qSettings.showStorePhone && <p style={{ fontSize: '13px', margin: '0 0 2px 0' }}>Telp: {settings.storePhone}</p>}
      {qSettings.showStoreEmail && <p style={{ fontSize: '13px', margin: '0 0 2px 0' }}>Email: {settings.storeEmail}</p>}
      {qSettings.showStoreWebsite && <p style={{ fontSize: '13px', margin: 0 }}>{settings.storeWebsite}</p>}
    </div>

    {/* Title */}
    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0', textDecoration: 'underline' }}>{qSettings.headerTitle || 'QUOTATION'}</h2>
      <p style={{ fontSize: '13px', margin: 0 }}>{qSettings.headerSubtitle || 'Penawaran Harga'} - No. {quotationNo}</p>
    </div>

    {/* Meta */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '13px' }}>
      <div>
        <p style={{ margin: '0 0 2px 0' }}><strong>Kepada Yth:</strong></p>
        <p style={{ margin: '0 0 2px 0' }}>{custObj.name || '[Nama]'}</p>
        <p style={{ margin: '0 0 2px 0', color: '#555' }}>{custObj.address || '[Alamat]'}</p>
        <p style={{ margin: 0, color: '#555' }}>{custObj.phone || '[Telepon]'}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: '0 0 2px 0' }}><strong>No:</strong> {quotationNo}</p>
        <p style={{ margin: '0 0 2px 0' }}><strong>Tanggal:</strong> {new Date().toLocaleDateString('id-ID')}</p>
        <p style={{ margin: 0 }}><strong>Berlaku:</strong> {qSettings.validityDays} hari</p>
      </div>
    </div>

    <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>Dengan hormat, berikut kami sampaikan penawaran harga sebagai berikut:</p>

    {/* Table */}
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #333' }}>
      <thead>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          {['No', 'Uraian', 'Qty', 'Harga Satuan', 'Jumlah'].map((h, i) => (
            <th key={i} style={{ border: '1px solid #333', padding: '8px 10px', fontSize: '12px', fontWeight: '700', textAlign: i === 0 || i === 2 ? 'center' : i > 2 ? 'right' : 'left' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cart.map((item, idx) => (
          <tr key={item.code}>
            <td style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'center', fontSize: '13px' }}>{idx + 1}</td>
            <td style={{ border: '1px solid #999', padding: '8px 10px', fontSize: '13px' }}>{item.name}</td>
            <td style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'center', fontSize: '13px' }}>{item.qty}</td>
            <td style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'right', fontSize: '13px' }}>{formatIDR(item.sellingPrice)}</td>
            <td style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'right', fontSize: '13px', fontWeight: '600' }}>{formatIDR(item.sellingPrice * item.qty)}</td>
          </tr>
        ))}
        {taxPercent > 0 && (
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <td colSpan="4" style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'right', fontSize: '13px' }}>PPN ({taxPercent}%)</td>
            <td style={{ border: '1px solid #999', padding: '8px 10px', textAlign: 'right', fontSize: '13px' }}>{formatIDR(taxAmount)}</td>
          </tr>
        )}
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          <td colSpan="4" style={{ border: '1px solid #333', padding: '10px', textAlign: 'right', fontWeight: '700', fontSize: '14px' }}>TOTAL</td>
          <td style={{ border: '1px solid #333', padding: '10px', textAlign: 'right', fontWeight: '700', fontSize: '14px' }}>{formatIDR(grandTotal)}</td>
        </tr>
      </tbody>
    </table>

    {notes && <p style={{ fontSize: '12px', color: '#555', marginBottom: '16px' }}><strong>Catatan:</strong> {notes}</p>}

    {qSettings.terms.length > 0 && (
      <div style={{ fontSize: '12px', color: '#555', marginBottom: '32px' }}>
        <p style={{ fontWeight: '700', margin: '0 0 4px 0' }}>Syarat & Ketentuan:</p>
        <ol style={{ margin: 0, paddingLeft: '18px' }}>
          {qSettings.terms.map((t, i) => <li key={i} style={{ marginBottom: '2px' }}>{t}</li>)}
        </ol>
      </div>
    )}

    <p style={{ fontSize: '13px', marginBottom: '32px' }}>Demikian penawaran ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.</p>

    {/* Signature */}
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '48px' }}>
      <SignatureBlock label={qSettings.signatureLeft} name={custObj.name || '...........................'} image={qSettings.signatureLeftImage} />
      <SignatureBlock label={qSettings.signatureRight} name={settings.storeName} image={qSettings.signatureRightImage} />
    </div>
  </div>
);

const TemplateThermal = ({ settings, qSettings, custObj, cart, subtotal, taxPercent, taxAmount, grandTotal, quotationNo, notes, formatIDR }) => {
  const is80 = qSettings.thermalPaperWidth === '80mm';
  const w = is80 ? '80mm' : '58mm';
  const pad = is80 ? '6px 8px' : '4px 6px';
  const fs = is80 ? '12px' : '10px';
  const fsSmall = is80 ? '10px' : '8px';
  const fsBold = is80 ? '14px' : '11px';
  const fsTitle = is80 ? '16px' : '12px';
  const dashLine = is80
    ? '------------------------------------------------'
    : '--------------------------------';

  const compact = (val) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);

  return (
    <div className="print-template" style={{
      fontFamily: "'Courier New', Courier, monospace",
      width: w,
      maxWidth: w,
      margin: '0 auto',
      padding: pad,
      color: '#000',
      backgroundColor: '#fff',
      fontSize: fs,
      lineHeight: '1.4',
    }}>
      {/* Store Header */}
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <h1 style={{ fontSize: fsTitle, fontWeight: '700', margin: '0 0 2px 0' }}>{settings.storeName}</h1>
        {qSettings.showStoreAddress && <p style={{ fontSize: fsSmall, margin: '0 0 2px 0' }}>{settings.storeAddress}</p>}
        {qSettings.showStorePhone && <p style={{ fontSize: fsSmall, margin: '0 0 2px 0' }}>Tel: {settings.storePhone}</p>}
        {qSettings.showStoreEmail && <p style={{ fontSize: fsSmall, margin: '0 0 2px 0' }}>{settings.storeEmail}</p>}
        {qSettings.showStoreWebsite && <p style={{ fontSize: fsSmall, margin: 0 }}>{settings.storeWebsite}</p>}
      </div>
      
      <p style={{ margin: '4px 0' }}>{dashLine}</p>
      
      <div style={{ textAlign: 'center', margin: '4px 0' }}>
        <p style={{ fontWeight: '700', fontSize: fsBold, margin: 0 }}>{qSettings.headerTitle || 'QUOTATION'}</p>
        <p style={{ fontSize: fsSmall, margin: 0 }}>{qSettings.headerSubtitle || 'Penawaran Harga'}</p>
      </div>

      <p style={{ margin: 0, textAlign: 'center' }}>{dashLine}</p>

      {/* Meta */}
      <div style={{ margin: '4px 0', fontSize: fsSmall }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>No:</span><span>{quotationNo}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Tgl:</span><span>{new Date().toLocaleDateString('id-ID')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Berlaku:</span><span>{qSettings.validityDays} hari</span>
        </div>
        {custObj.name && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Kpd:</span><span>{custObj.name}</span>
          </div>
        )}
      </div>

      <p style={{ margin: 0 }}>{dashLine}</p>

      {/* Items */}
      {cart.map((item, idx) => (
        <div key={item.code} style={{ margin: '4px 0', fontSize: fs }}>
          <p style={{ margin: 0, fontWeight: '600' }}>{item.name}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fsSmall }}>
            <span>{item.qty} x {compact(item.sellingPrice)}</span>
            <span style={{ fontWeight: '600' }}>{compact(item.sellingPrice * item.qty)}</span>
          </div>
        </div>
      ))}

      <p style={{ margin: '4px 0 0 0' }}>{dashLine}</p>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0', fontSize: fs }}>
        <span>Subtotal</span><span>{formatIDR(subtotal)}</span>
      </div>
      {taxPercent > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0', fontSize: fs }}>
          <span>PPN ({taxPercent}%)</span><span>{formatIDR(taxAmount)}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontWeight: '700', fontSize: fsBold }}>
        <span>TOTAL</span>
        <span>{formatIDR(grandTotal)}</span>
      </div>

      <p style={{ margin: 0 }}>{dashLine}</p>

      {/* Notes */}
      {notes && (
        <div style={{ margin: '4px 0', fontSize: fsSmall }}>
          <p style={{ margin: 0 }}>Catatan: {notes}</p>
        </div>
      )}

      {/* Terms */}
      {qSettings.terms.length > 0 && (
        <div style={{ margin: '4px 0', fontSize: fsSmall }}>
          {qSettings.terms.map((t, i) => (
            <p key={i} style={{ margin: 0 }}>{i + 1}. {t}</p>
          ))}
        </div>
      )}

      {/* Signature area */}
      <div style={{ margin: '12px 0 4px 0', fontSize: fsSmall }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ margin: '0 0 4px 0' }}>{qSettings.signatureLeft}</p>
            {qSettings.signatureLeftImage ? (
              <img src={qSettings.signatureLeftImage} alt="" style={{ maxWidth: '60px', maxHeight: '30px', margin: '0 auto', display: 'block' }} />
            ) : (
              <div style={{ height: '30px' }} />
            )}
            <p style={{ margin: 0, borderTop: '1px dashed #000', paddingTop: '2px' }}>({custObj.name || '........'})</p>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ margin: '0 0 4px 0' }}>{qSettings.signatureRight}</p>
            {qSettings.signatureRightImage ? (
              <img src={qSettings.signatureRightImage} alt="" style={{ maxWidth: '60px', maxHeight: '30px', margin: '0 auto', display: 'block' }} />
            ) : (
              <div style={{ height: '30px' }} />
            )}
            <p style={{ margin: 0, borderTop: '1px dashed #000', paddingTop: '2px' }}>({settings.storeName})</p>
          </div>
        </div>
      </div>

      <p style={{ margin: '4px 0 0 0' }}>{dashLine}</p>

      {/* Footer */}
      <p style={{ textAlign: 'center', fontSize: fsSmall, margin: '4px 0' }}>
        {qSettings.footerText || 'Terima kasih atas kepercayaan Anda'}
      </p>
    </div>
  );
};

// =============================================
// TEMPLATE MAP
// =============================================
const TEMPLATES = {
  professional: { name: 'Profesional', desc: 'Modern dengan warna aksen & kotak info', component: TemplateProfessional },
  minimalist: { name: 'Minimalis', desc: 'Bersih, tipis, gaya Eropa', component: TemplateMinimalist },
  classic: { name: 'Klasik (Surat Resmi)', desc: 'Format surat dinas dengan border tabel', component: TemplateClassic },
  thermal: { name: '🖨️ Thermal (Struk)', desc: 'Untuk printer termal 58mm / 80mm', component: TemplateThermal },
};

// =============================================
// MAIN QUOTATION PAGE
// =============================================
const Quotation = () => {
  const { settings, quotationSettings, updateQuotationSettings } = useStore();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [termsText, setTermsText] = useState('');
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxPercent, setTaxPercent] = useState(11);
  
  const printRef = useRef(null);
  const qSettings = quotationSettings;

  useEffect(() => {
    setTermsText(qSettings.terms.join('\n'));
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const [prods, custs] = await Promise.all([api.getProducts(), api.getCustomers()]);
      setProducts(prods || []);
      setCustomers(custs || []);
    };
    loadData();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(p => p.code === product.code);
      if (existing) return prev.map(p => p.code === product.code ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (code, qty) => {
    if (qty < 1) return removeFromCart(code);
    setCart(prev => prev.map(p => p.code === code ? { ...p, qty } : p));
  };

  const removeFromCart = (code) => {
    setCart(prev => prev.filter(p => p.code !== code));
  };

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.qty), 0);
  const taxAmount = taxEnabled ? Math.round(subtotal * taxPercent / 100) : 0;
  const grandTotal = subtotal + taxAmount;
  const quotationNo = `QT-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`;

  const handleSave = async () => {
    if (cart.length === 0 || !selectedCustomer) { alert('Keranjang kosong atau pelanggan belum dipilih!'); return; }
    setLoading(true);
    try {
      await api.saveQuotation({ date: new Date().toISOString(), quoNo: quotationNo, customerId: selectedCustomer, items: cart, total: grandTotal, taxPercent: taxEnabled ? taxPercent : 0, taxAmount });
      alert('Quotation berhasil disimpan!');
    } catch { alert('Gagal menyimpan quotation.'); }
    setLoading(false);
  };

  const handlePrint = () => { setTimeout(() => { window.print(); }, 200); };

  const handleSaveSettings = () => {
    const parsedTerms = termsText.split('\n').map(t => t.trim()).filter(Boolean);
    updateQuotationSettings({ terms: parsedTerms });
    setShowSettings(false);
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const custObj = customers.find(c => c.phone === selectedCustomer) || {};

  const SelectedTemplate = TEMPLATES[qSettings.template]?.component || TemplateProfessional;
  const templateProps = { settings, qSettings, custObj, cart, subtotal, taxPercent: taxEnabled ? taxPercent : 0, taxAmount, grandTotal, quotationNo, notes, formatIDR };

  return (
    <>
      {/* SCREEN VIEW */}
      <div className="flex flex-col gap-4 md:gap-6 h-full print:hidden">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Buat Quotation</h1>
            <p className="text-gray-500 text-sm">Penawaran harga untuk pelanggan.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShowSettings(true)} className="px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 flex items-center gap-2 transition text-sm shadow-sm">
              <Settings className="w-4 h-4" /> Template
            </button>
            <button onClick={handleSave} disabled={loading} className="px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-xl shadow font-bold hover:bg-indigo-700 transition text-sm">
              {loading ? 'Menyimpan...' : 'Simpan Draft'}
            </button>
            <button onClick={handlePrint} disabled={cart.length === 0} className="px-3 md:px-4 py-2 bg-gray-800 text-white rounded-xl shadow font-bold hover:bg-gray-900 flex items-center gap-2 transition text-sm disabled:opacity-50">
              <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Cetak / PDF</span><span className="sm:hidden">Cetak</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 min-h-0">
          {/* PRODUCT SELECTOR */}
          <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-h-[40vh] lg:max-h-none">
            <div className="p-3 md:p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Cari barang..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="p-2 flex-1 overflow-y-auto">
              {filteredProducts.map(p => (
                <div key={p.code} onClick={() => addToCart(p)} className="p-3 border-b border-gray-50 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition">
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm truncate">{p.name}</h4>
                    <p className="text-xs text-gray-500">{p.code}</p>
                  </div>
                  <span className="font-bold text-blue-600 text-sm whitespace-nowrap ml-2">{formatIDR(p.sellingPrice)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QUOTATION EDITOR */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Customer + Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Ditujukan Kepada:</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm" value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                    <option value="">-- Pilih Pelanggan --</option>
                    {customers.map(c => <option key={c.phone} value={c.phone}>{c.name}</option>)}
                  </select>
                  {custObj.name && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                      <p className="font-bold text-gray-800">{custObj.name}</p>
                      <p className="text-gray-600 text-xs">{custObj.address}</p>
                      <p className="text-gray-600 text-xs">{custObj.phone}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Catatan:</label>
                  <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan tambahan..." className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" />
                </div>
              </div>

              {/* Cart Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-y-2 border-gray-800 text-gray-900">
                      <th className="py-3 font-bold text-sm">Produk</th>
                      <th className="py-3 font-bold text-center text-sm">Qty</th>
                      <th className="py-3 font-bold text-right text-sm">Harga</th>
                      <th className="py-3 font-bold text-right text-sm">Total</th>
                      <th className="py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cart.length === 0 ? (
                      <tr><td colSpan="5" className="py-10 text-center text-gray-400 text-sm">Pilih barang dari panel kiri.</td></tr>
                    ) : (
                      cart.map(item => (
                        <tr key={item.code} className="text-gray-800">
                          <td className="py-3">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.code}</p>
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => updateQty(item.code, item.qty - 1)} className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded hover:bg-red-100 transition"><Minus className="w-3 h-3" /></button>
                              <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                              <button onClick={() => updateQty(item.code, item.qty + 1)} className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded hover:bg-blue-100 transition"><Plus className="w-3 h-3" /></button>
                            </div>
                          </td>
                          <td className="py-3 text-right text-sm">{formatIDR(item.sellingPrice)}</td>
                          <td className="py-3 text-right font-medium text-sm">{formatIDR(item.sellingPrice * item.qty)}</td>
                          <td className="py-3 text-right">
                            <button onClick={() => removeFromCart(item.code)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 text-gray-600 text-sm">
                    <span>Subtotal</span><span>{formatIDR(subtotal)}</span>
                  </div>
                  {/* Tax Toggle */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={taxEnabled} onChange={(e) => setTaxEnabled(e.target.checked)} className="accent-blue-600 w-3.5 h-3.5" />
                      <span className="text-sm text-gray-600">PPN</span>
                    </label>
                    {taxEnabled && (
                      <div className="flex items-center gap-1">
                        <input type="number" min="0" max="100" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} className="w-12 px-1.5 py-0.5 border border-gray-300 rounded text-center text-xs font-bold outline-none" />
                        <span className="text-xs text-gray-400">%</span>
                        <span className="text-sm font-bold text-orange-600 ml-1">{formatIDR(taxAmount)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-3 text-lg md:text-xl font-bold text-white bg-blue-700 rounded-lg px-4 mt-2">
                    <span>TOTAL</span><span>{formatIDR(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Pengaturan Template Quotation</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Template Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Template Cetak:</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(TEMPLATES).map(([key, t]) => (
                    <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${qSettings.template === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="template" checked={qSettings.template === key} onChange={() => updateQuotationSettings({ template: key })} className="accent-blue-600" />
                      <div>
                        <p className="font-bold text-sm text-gray-800">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Thermal Paper Size - only show when thermal selected */}
              {qSettings.template === 'thermal' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <label className="block text-sm font-bold text-amber-800 mb-2">🖨️ Ukuran Kertas Thermal:</label>
                  <div className="flex gap-3">
                    {['58mm', '80mm'].map(size => (
                      <label key={size} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition text-sm font-bold ${qSettings.thermalPaperWidth === size ? 'border-amber-500 bg-amber-100 text-amber-800' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                        <input type="radio" name="thermalSize" checked={qSettings.thermalPaperWidth === size} onChange={() => updateQuotationSettings({ thermalPaperWidth: size })} className="accent-amber-600" />
                        {size}
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-amber-700 mt-2">58mm = struk kecil (kasir mini) • 80mm = struk standar POS</p>
                </div>
              )}

              {/* Header Texts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Judul Dokumen:</label>
                  <input type="text" value={qSettings.headerTitle || ''} onChange={e => updateQuotationSettings({ headerTitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="QUOTATION" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Sub-judul Dokumen:</label>
                  <input type="text" value={qSettings.headerSubtitle || ''} onChange={e => updateQuotationSettings({ headerSubtitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Penawaran Harga" />
                </div>
              </div>

              {/* Show Header Visibility */}
              <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tampilkan di Header:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={qSettings.showLogo} onChange={e => updateQuotationSettings({ showLogo: e.target.checked })} className="accent-blue-600 w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Logo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={qSettings.showStoreAddress} onChange={e => updateQuotationSettings({ showStoreAddress: e.target.checked })} className="accent-blue-600 w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Alamat</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={qSettings.showStorePhone} onChange={e => updateQuotationSettings({ showStorePhone: e.target.checked })} className="accent-blue-600 w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Telepon</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={qSettings.showStoreEmail} onChange={e => updateQuotationSettings({ showStoreEmail: e.target.checked })} className="accent-blue-600 w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={qSettings.showStoreWebsite} onChange={e => updateQuotationSettings({ showStoreWebsite: e.target.checked })} className="accent-blue-600 w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Website</span>
                  </label>
                </div>
              </div>

              {/* Accent Color and Validity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Warna Aksen:</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={qSettings.accentColor} onChange={e => updateQuotationSettings({ accentColor: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" />
                    <span className="text-sm text-gray-500">{qSettings.accentColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Masa Berlaku (hari):</label>
                  <input type="number" value={qSettings.validityDays} onChange={e => updateQuotationSettings({ validityDays: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm" min="1" />
                </div>
              </div>

              {/* Settings End Here (Show Logo moved above) */}

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Label TTD Kiri:</label>
                  <input type="text" value={qSettings.signatureLeft} onChange={e => updateQuotationSettings({ signatureLeft: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Label TTD Kanan:</label>
                  <input type="text" value={qSettings.signatureRight} onChange={e => updateQuotationSettings({ signatureRight: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>

              {/* Signature Image Upload */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Upload TTD Kiri:</label>
                  {qSettings.signatureLeftImage ? (
                    <div className="relative border rounded-lg p-2 bg-gray-50 flex items-center gap-3">
                      <img src={qSettings.signatureLeftImage} alt="TTD Kiri" className="h-12 object-contain" />
                      <button onClick={() => updateQuotationSettings({ signatureLeftImage: '' })} className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded" title="Hapus"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition">
                      <Upload className="w-4 h-4" />
                      <span>Pilih gambar...</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => updateQuotationSettings({ signatureLeftImage: ev.target.result });
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Upload TTD Kanan:</label>
                  {qSettings.signatureRightImage ? (
                    <div className="relative border rounded-lg p-2 bg-gray-50 flex items-center gap-3">
                      <img src={qSettings.signatureRightImage} alt="TTD Kanan" className="h-12 object-contain" />
                      <button onClick={() => updateQuotationSettings({ signatureRightImage: '' })} className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded" title="Hapus"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition">
                      <Upload className="w-4 h-4" />
                      <span>Pilih gambar...</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => updateQuotationSettings({ signatureRightImage: ev.target.result });
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Syarat & Ketentuan:</label>
                <p className="text-xs text-gray-500 mb-2">Satu syarat per baris. Kosongkan semua untuk menghilangkan bagian ini.</p>
                <textarea rows={5} value={termsText} onChange={e => setTermsText(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-mono resize-none" placeholder="Harga dapat berubah sewaktu-waktu..." />
              </div>

              {/* Footer */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Footer (opsional):</label>
                <input type="text" value={qSettings.footerText} onChange={e => updateQuotationSettings({ footerText: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Misal: Terima kasih atas kepercayaan Anda" />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowSettings(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition">Batal</button>
              <button onClick={handleSaveSettings} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">Simpan Pengaturan</button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY VIEW */}
      {createPortal(
        <div id="print-area" className="hidden print:block" ref={printRef}>
          <SelectedTemplate {...templateProps} />
        </div>,
        document.body
      )}
    </>
  );
};

export default Quotation;
