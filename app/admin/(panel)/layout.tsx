import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
