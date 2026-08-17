import { ArrowRight } from "lucide-react";
import Link from "next/link";

/** The single next step for this screen, kept above the fold on every layout. */
export function NextActionLink({
  label,
  detail,
  href,
  cta,
}: {
  label: string;
  detail: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="next-action">
      <div>
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
      <Link className="btn btn-primary" href={href}>
        {cta} <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </div>
  );
}
