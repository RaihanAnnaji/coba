import { Suspense } from "react";
import StatistikContent from "./StatistikContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Memuat halaman statistik...</div>}>
      <StatistikContent />
    </Suspense>
  );
}
