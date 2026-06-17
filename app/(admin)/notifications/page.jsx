"use client";
import React, { useState } from 'react';
import { 
  Bell, ShoppingBag, AlertTriangle, UserPlus, Info, 
  Check, CheckCircle2, Trash2, MoreVertical 
} from 'lucide-react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/Topbar';

export default function NotificationsPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, urgent
  
  const [notifications, setNotifications] = useState([
    {
      id: 'nt-101',
      type: 'order',
      title: 'New Checkout Transaction Verified',
      description: 'Order #IBNA-9402 finalized by customer Alistair Vance (1x Silk Drape Blouse, Total: $280.00).',
      time: '3 mins ago',
      isUnread: true,
      priority: 'normal',
      icon: ShoppingBag,
      iconColor: 'text-black bg-black/[0.04]'
    },
    {
      id: 'nt-102',
      type: 'stock',
      title: 'Critical Low Variant Inventory Flag',
      description: 'Atelier Tailored Blazer (Charcoal, Size M) dropped below safety thresholds (2 units remaining).',
      time: '42 mins ago',
      isUnread: true,
      priority: 'urgent',
      icon: AlertTriangle,
      iconColor: 'text-[#de350b] bg-[#de350b]/[0.06]'
    },
    {
      id: 'nt-103',
      type: 'staff',
      title: 'Team Registry Invitation Accepted',
      description: 'Elena Rostova has verified her authentication tokens and joined as a Content Editor.',
      time: '4 hours ago',
      isUnread: false,
      priority: 'normal',
      icon: UserPlus,
      iconColor: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'nt-104',
      type: 'system',
      title: 'System Cache Flushed Successfully',
      description: 'Production CDN assets and schema variables re-indexed across Edge routers natively.',
      time: '1 day ago',
      isUnread: false,
      priority: 'low',
      icon: Info,
      iconColor: 'text-gray-500 bg-[#f5f5f5]'
    }
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return n.isUnread;
    if (activeFilter === 'urgent') return n.priority === 'urgent';
    return true;
  });

  const filterTabStyle = (filterType) => `
    h-8 px-4 rounded-md text-[11px] font-bold uppercase tracking-wider border transition-colors select-none
    ${activeFilter === filterType 
      ? 'bg-black border-black text-white' 
      : 'bg-white border-[#dddddd] text-[#555555] hover:border-black hover:text-black'
    }
  `;

  return (
    <div className="min-h-screen bg-[#ffffff] text-black flex overflow-hidden font-sans antialiased" suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Sidebar Navigation Component */}
      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden border-l border-[#eeeeee]">
        {/* TopBar Infrastructure Node */}
        <TopBar onMenuOpen={() => setSidebarCollapsed(false)} />

        {/* Main Content Area Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 pb-24 lg:pb-10 no-scrollbar bg-white">
          
          {/* TERMINAL NOTIFICATIONS HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#eeeeee]">
            <div>
              <h2 className="text-[20px] font-bold tracking-tight text-black uppercase">Activity Logs</h2>
              <p className="text-[#777777] text-[12px] font-medium mt-0.5">Track storefront operations, inventory flags, and structural system alerts.</p>
            </div>
            
            {notifications.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="h-8 px-3 border border-[#dddddd] text-[10px] font-bold uppercase tracking-wider rounded-md text-[#777777] hover:border-[#de350b] hover:text-[#de350b] flex items-center gap-1.5 transition-colors self-start sm:self-center"
              >
                <Trash2 size={12} /> Clear Log Data
              </button>
            )}
          </div>

          {/* FILTER TOOLBAR MATRIX */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setActiveFilter('all')} className={filterTabStyle('all')}>All Logs</button>
            <button onClick={() => setActiveFilter('unread')} className={filterTabStyle('unread')}>
              Unread ({notifications.filter(n => n.isUnread).length})
            </button>
            <button onClick={() => setActiveFilter('urgent')} className={filterTabStyle('urgent')}>Urgent Flags</button>
          </div>

          {/* NOTIFICATION FEED ROW PLATFORM */}
          <div className="border border-[#eeeeee] rounded-md bg-white divide-y divide-[#eeeeee]">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const LogIcon = notification.icon;
                return (
                  <div 
                    key={notification.id} 
                    className={`flex items-start gap-4 p-5 transition-colors group relative ${
                      notification.isUnread ? 'bg-black/[0.01]' : 'bg-white'
                    }`}
                  >
                    {/* Unread Blueprint Dot */}
                    {notification.isUnread && (
                      <span className="absolute top-6 left-2 w-1.5 h-1.5 bg-[#de350b] rounded-full" title="Unread Entry"></span>
                    )}

                    {/* Operational Node Icon Indicator */}
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${notification.iconColor}`}>
                      <LogIcon size={14} />
                    </div>

                    {/* Text Payload Structural Interface */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className={`text-[13px] font-bold tracking-tight text-black ${notification.isUnread ? 'font-semibold' : 'font-medium'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-[#999999] tabular-nums shrink-0">{notification.time}</span>
                      </div>
                      <p className="text-[12px] text-[#555555] mt-1 pr-6 leading-relaxed font-normal">
                        {notification.description}
                      </p>
                      
                      {/* Priority Warning Flag Pills */}
                      {notification.priority === 'urgent' && (
                        <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#de350b]/[0.06] text-[#de350b]">
                          Action Required
                        </span>
                      )}
                    </div>

                    {/* Context Actions Block Trigger */}
                    <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {notification.isUnread && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark entry as cleared"
                          className="p-1.5 text-[#777777] hover:text-black hover:bg-black/[0.04] rounded-md transition-colors"
                        >
                          <Check size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              /* EMPTY LOG STATE INTERFACE */
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 border border-[#eeeeee] rounded-md flex items-center justify-center text-[#bbbbbb] mb-3">
                  <Bell size={16} />
                </div>
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-black">Terminal Log Clean</h4>
                <p className="text-[#777777] text-[11px] mt-0.5 max-w-xs">No administrative alerts or webhook triggers fall within this query parameter.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}