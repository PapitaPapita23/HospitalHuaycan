function PageHeader({ title, subtitle }) {
  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-bold text-slate-100 md:text-3xl">{title}</h1>
      <p className="text-sm text-slate-300 md:text-base">{subtitle}</p>
    </header>
  )
}

export default PageHeader
