import HalftoneText from '../HalftoneText';

export default function Footer() {
  return (
    <footer className="relative bg-bg-warm min-h-[60vh] flex flex-col overflow-hidden">

      {/* Large wordmark */}
      <div className="flex-1 flex items-end overflow-hidden">
        <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 pb-24">
          <HalftoneText text="supomelo" dotColor="#FF774D" spacing={7} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center pointer-events-none">
        <span className="text-xs text-text-muted/40 pointer-events-auto">
          &copy; 2026 SUPOMELO DESIGN STUDIO
        </span>
      </div>
    </footer>
  );
}
