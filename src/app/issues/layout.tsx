export default function IssuesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <section className="flex-1">{children}</section>
    </div>
  );
} 