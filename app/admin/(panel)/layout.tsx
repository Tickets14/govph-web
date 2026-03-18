import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto min-w-0">{children}</div>
    </div>
  );
}
