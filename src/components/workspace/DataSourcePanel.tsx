import { useRef, useState } from "react";
import { Database, Download, FileSpreadsheet, Loader2, ShieldCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_FILE_MB } from "@/lib/pulse/file";

export function DataSourcePanel({
  onFile,
  onSample,
  onTemplate,
  busy,
  error,
}: {
  onFile: (file: File) => void;
  onSample: () => void;
  onTemplate: () => void;
  busy: boolean;
  error: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files[0];
          if (f) onFile(f);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card px-6 py-14 text-center transition-colors",
          drag ? "border-primary bg-primary/5" : "border-border",
        )}
      >
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {busy ? <Loader2 className="size-7 animate-spin" aria-hidden="true" /> : <Upload className="size-7" aria-hidden="true" />}
        </span>
        <h2 className="mt-5 text-xl font-bold text-foreground">Upload your sales data</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Drag and drop a CSV or Excel file (XLSX, XLS) up to {MAX_FILE_MB} MB, or browse your device.
          One row per sale or transaction works best.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className="sr-only"
          aria-label="Upload a CSV or Excel file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => inputRef.current?.click()} disabled={busy}>
            <FileSpreadsheet aria-hidden="true" /> Choose file
          </Button>
          <Button size="lg" variant="outline" onClick={onSample} disabled={busy}>
            <Database aria-hidden="true" /> Try with sample data
          </Button>
        </div>
        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">What PULSE needs</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">Date</span> — required</li>
            <li><span className="font-medium text-foreground">Revenue</span> — or Quantity and Unit price</li>
            <li><span className="font-medium text-foreground">Cost</span> — optional, unlocks profit and margins</li>
            <li><span className="font-medium text-foreground">Product, Region, Channel</span> — optional breakdowns</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Column names don't need to match exactly — PULSE detects them and you can adjust.
          </p>
          <Button variant="link" className="mt-2 h-auto px-0" onClick={onTemplate}>
            <Download aria-hidden="true" /> Download a CSV template
          </Button>
        </div>
        <div className="flex gap-3 rounded-2xl border border-border bg-secondary p-6">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Private by design.</span> Your file is read and
            analysed inside your browser and is never uploaded or stored. Only summary totals are sent when you
            ask for AI insights.
          </p>
        </div>
      </div>
    </div>
  );
}
