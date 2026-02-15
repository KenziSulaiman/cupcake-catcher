import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Filter,
} from 'lucide-react';
import { SecurityReport, Message } from '../../types';

interface AgeGapAnalyzerProps {
  onBack: () => void;
  reports: SecurityReport[];
  chatMessages: Record<string, Message[]>;
}

const SEVERITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-600/10 text-red-500 border-red-500/30',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  Low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

const AgeGapAnalyzer: React.FC<AgeGapAnalyzerProps> = ({
  onBack,
  reports,
  chatMessages,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredReports =
    filterSeverity === 'all'
      ? reports
      : reports.filter((r) => r.severity === filterSeverity);

  const totalMessages = Object.values(chatMessages).reduce(
    (sum, msgs) => sum + msgs.length,
    0,
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/5 rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-[#E2231A]" size={24} />
            Safety Analysis Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            Real-time forensic monitoring and threat detection
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Reports',
            value: reports.length,
            color: 'text-[#E2231A]',
          },
          {
            label: 'Critical',
            value: reports.filter((r) => r.severity === 'Critical').length,
            color: 'text-red-500',
          },
          {
            label: 'Messages Scanned',
            value: totalMessages,
            color: 'text-blue-400',
          },
          {
            label: 'Active Threats',
            value: reports.filter(
              (r) =>
                r.severity === 'Critical' || r.severity === 'High',
            ).length,
            color: 'text-orange-400',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="roblox-card p-4 text-center"
          >
            <p className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-3 mb-6">
        <Filter size={14} className="text-gray-500" />
        <span className="text-xs text-gray-500 font-bold uppercase">
          Filter:
        </span>
        {['all', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`text-[10px] px-3 py-1 rounded font-bold uppercase transition-all ${
              filterSeverity === sev
                ? 'bg-white/10 text-white'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Reports */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="roblox-card p-12 text-center">
            <AlertTriangle
              className="mx-auto text-gray-600 mb-4"
              size={32}
            />
            <p className="text-gray-500 font-bold">No reports yet</p>
            <p className="text-xs text-gray-600 mt-1">
              Safety events will appear here in real-time
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="roblox-card p-5 border-l-4 border-l-[#E2231A] animate-in slide-in-from-left-2"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase ${
                      SEVERITY_COLORS[report.severity] || ''
                    }`}
                  >
                    {report.severity}
                  </span>
                  <span className="text-xs font-bold">
                    @{report.targetUser}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-gray-500">
                  <Clock size={10} />
                  <span>{report.timestamp}</span>
                </div>
              </div>

              <div className="bg-black/20 p-3 rounded border border-white/5 mb-3">
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  "{report.messageContent}"
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  <strong>Reason:</strong> {report.reason}
                </p>
                <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-bold uppercase">
                  {report.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgeGapAnalyzer;
