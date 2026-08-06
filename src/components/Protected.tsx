import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useCheckIns, useSettings } from "@/hooks/useCheckIns";
import { trendIntensity } from "@/lib/checkin";
import { AppShell } from "./AppShell";
import { ReminderScheduler } from "./ReminderScheduler";
import { DisclaimerDialog } from "./DisclaimerDialog";

export function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: entries } = useCheckIns(28);
  const { data: settings, update } = useSettings();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-accent" />
      </div>
    );
  }

  const intensity = trendIntensity(entries ?? []);

  return (
    <div style={{ "--trend": intensity } as React.CSSProperties}>
      <AppShell>{children}</AppShell>
      <ReminderScheduler />
      <DisclaimerDialog
        open={settings ? !settings.disclaimer_ack : false}
        onAcknowledge={() => update.mutate({ disclaimer_ack: true })}
      />
    </div>
  );
}
