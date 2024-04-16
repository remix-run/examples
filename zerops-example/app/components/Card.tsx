export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F7F7F7] rounded-md p-8 my-8 flex items-center">
      {children}
    </div>
  );
}
