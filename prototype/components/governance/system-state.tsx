import { CircleAlert } from "lucide-react";

export function SystemState({ title, detail }: { title: string; detail: string }) {
  return (
    <section className="system-state" role="status">
      <CircleAlert aria-hidden="true" size={22} />
      <h2>{title}</h2>
      <p>{detail}</p>
    </section>
  );
}
