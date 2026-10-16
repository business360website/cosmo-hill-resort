import { ArrowRight } from 'lucide-react'

// "View More" button shown under each section on the Home page; opens that section's own page.
export default function ViewMore({ href, label = 'View More', ghost = false }) {
  return (
    <div className="mt-12 flex justify-center">
      <a href={href} className={ghost ? 'btn btn-ghost !border-ink/60 text-ink hover:!bg-ink/10' : 'btn btn-dark'}>{label} <ArrowRight size={18} /></a>
    </div>
  )
}
