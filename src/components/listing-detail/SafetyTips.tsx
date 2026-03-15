import { Shield, AlertTriangle } from "lucide-react";

const TIPS = [
  "Meet in a public place for exchanges",
  "Never send payment before seeing the item",
  "Check the item thoroughly before paying",
  "Be wary of deals that seem too good to be true",
];

const SafetyTips = () => (
  <div className="rounded-lg border bg-card p-4 space-y-3">
    <h3 className="font-display font-semibold text-sm flex items-center gap-2">
      <Shield className="h-4 w-4 text-sell" /> Safety Tips
    </h3>
    <ul className="space-y-2">
      {TIPS.map((tip, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-sell/70" />
          {tip}
        </li>
      ))}
    </ul>
  </div>
);

export default SafetyTips;
