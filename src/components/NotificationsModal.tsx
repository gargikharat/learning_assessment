import React from 'react';
import { NotificationItem } from '../types';
import { Bell, CheckCircle2, AlertCircle, Calendar, Sparkles, X } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-950/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in slide-in-from-right-4 duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900 text-sm">Notifications & Alerts</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 divide-y divide-slate-100 max-h-[70vh] overflow-y-auto space-y-3">
          {notifications.map((item) => (
            <div key={item.id} className="pt-3 first:pt-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                  {item.type === 'achievement' && (
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  {item.type === 'alert' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                  {item.type === 'schedule' && (
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>{item.title}</span>
                </span>
                <span className="text-[10px] text-slate-400">{item.time}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={onMarkAllAsRead}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
