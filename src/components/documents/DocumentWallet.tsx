import React, { useState } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Calendar,
  ExternalLink,
  Luggage,
  Sparkles
} from 'lucide-react';
import { MOCK_DOCUMENTS } from '../../data/mockData';
import { Trip } from '../../types/travel';
import { PackingChecklist } from '../packing/PackingChecklist';

interface DocumentWalletProps {
  theme: 'dark' | 'light';
  trip?: Trip;
  initialSubTab?: 'vault' | 'packing';
}

export const DocumentWallet: React.FC<DocumentWalletProps> = ({
  theme,
  trip,
  initialSubTab = 'vault',
}) => {
  const isDark = theme === 'dark';
  const [activeSubTab, setActiveSubTab] = useState<'vault' | 'packing'>(initialSubTab);
  const [revealedDocId, setRevealedDocId] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedDocId(revealedDocId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation Switcher */}
      <div className="p-4 md:px-8 max-w-7xl mx-auto pb-0">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveSubTab('vault')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'vault'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Vault Credentials ({MOCK_DOCUMENTS.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('packing')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'packing'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Luggage className="w-3.5 h-3.5" />
            <span>Packing Checklist & Manifests</span>
            <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-black/30 text-emerald-300 font-bold">
              New
            </span>
          </button>
        </div>
      </div>

      {activeSubTab === 'packing' ? (
        <PackingChecklist theme={theme} trip={trip} />
      ) : (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pt-0">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ENCRYPTED TRAVEL VAULT</span>
            </div>
            <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
              Document Wallet
            </h1>
            <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-xl">
              Encrypted credentials, e-visa references, overseas medical coverage policies, and rail exchange vouchers.
            </p>
          </div>

          {/* Security Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
              isDark
                ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 shrink-0" />
              <span>
                Hardware-backed client encryption enabled. Full passport identifiers remain masked unless biometrically authenticated.
              </span>
            </div>
            <span className="font-mono-num text-[10px] uppercase font-bold shrink-0">
              AES-256 Validated
            </span>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_DOCUMENTS.map((doc) => {
              const isRevealed = revealedDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                    isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono-num uppercase tracking-wider text-stone-400 block">
                            {doc.type} · {doc.issuingAuthority}
                          </span>
                          <h3 className="font-editorial text-xl font-bold text-white">
                            {doc.holder}
                          </h3>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                        {doc.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-2 text-xs font-mono-num">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Credential Identifier:</span>
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span>
                            {isRevealed
                              ? doc.identifier.replace('••••', '7942')
                              : doc.identifier}
                          </span>
                          <button
                            onClick={() => toggleReveal(doc.id)}
                            className="text-stone-400 hover:text-white cursor-pointer"
                            title={isRevealed ? 'Mask' : 'Reveal'}
                          >
                            {isRevealed ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Validity Horizon:</span>
                        <span className="text-stone-300">{doc.expiryDate}</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 font-sans-ui">
                      {doc.secureSnippet}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs text-stone-400 font-mono-num">
                    <span>Verified: {doc.issuingAuthority}</span>
                    <span className="text-emerald-400">Digital Copy Synced</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
