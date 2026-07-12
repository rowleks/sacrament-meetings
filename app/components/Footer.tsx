export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-white mt-auto">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <p className="text-xs text-foreground/60">
          Sacrament Meeting Planner
        </p>
        <p className="text-xs text-foreground/60">
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
