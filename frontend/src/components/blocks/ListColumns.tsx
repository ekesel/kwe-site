import { FadeUp } from "@/motion";

/** Side-by-side plain lists with hairlines (e.g. Private equity / Private credit). */
export function ListColumns({ groups }: { groups: { label: string; items: string[] }[] }) {
  return (
    <FadeUp className="grid md:grid-cols-2 gap-x-6 gap-y-16">
      {groups.map((g) => (
        <div key={g.label}>
          <h3 className="t-eyebrow text-ink-2 pb-4">{g.label}</h3>
          <ul className="rule-b">
            {g.items.map((it) => (<li key={it} className="rule-t py-4 t-body text-forest-900">{it}</li>))}
          </ul>
        </div>
      ))}
    </FadeUp>
  );
}
