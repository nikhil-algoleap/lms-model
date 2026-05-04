import React, { useState } from 'react';
import { UploadCloud, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../api/client';

const ImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/import/leads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
      if (res.data.successCount > 0) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setResult(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        <button onClick={resetState} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Import Data</h2>
          <p className="text-slate-500 font-medium mb-8">Upload an Excel (.xlsx, .csv) file to bulk import Accounts, Contacts, and Leads.</p>

          {result ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Import Successful</h3>
              <p className="text-slate-500 mt-2">
                Successfully imported <strong>{result.successCount}</strong> records.
              </p>
              {result.errorCount > 0 && (
                <div className="mt-4 p-4 bg-rose-50 text-rose-600 text-sm text-left rounded-xl max-h-32 overflow-y-auto">
                  <p className="font-bold mb-1">Errors ({result.errorCount}):</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-emerald-500 transition-all cursor-pointer relative group">
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 bg-slate-100 text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 transition-all">
                  <UploadCloud size={24} />
                </div>
                <h4 className="text-slate-900 font-bold mb-1">
                  {file ? file.name : 'Click or drag file to upload'}
                </h4>
                <p className="text-slate-400 text-sm">
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : 'XLSX or CSV up to 10MB'}
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button 
                onClick={handleImport}
                disabled={!file || loading}
                className="w-full py-4 bg-[#122b1c] hover:bg-[#1a3d28] text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? 'Processing Import...' : 'Import Data'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
