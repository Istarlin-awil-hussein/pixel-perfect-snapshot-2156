import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoBadge, Field, Panel } from "@/components/site/ui";
import { login, loginDemo } from "@/services/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in – TalentBridge" },
      { name: "description", content: "Log in to your TalentBridge profile or open a demonstration account." },
      { property: "og:title", content: "Log in – TalentBridge" },
      { property: "og:description", content: "Log in to your TalentBridge profile or open a demonstration account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast.success(`Welcome back, ${res.user.name}.`);
    void navigate({ to: "/dashboard" });
  };

  const demo = (kind: "seeker" | "admin") => {
    loginDemo(kind);
    toast.success(kind === "admin" ? "Demo administrator opened." : "Demo job seeker opened.");
    void navigate({ to: kind === "admin" ? "/admin" : "/dashboard" });
  };

  return (
    <div className="container-page grid gap-8 py-14 lg:grid-cols-2">
      <Panel className="p-8">
        <h1 className="text-3xl font-bold">Log in</h1>
        <p className="mt-1 text-muted-foreground">Welcome back to TalentBridge.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4" noValidate>
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password" htmlFor="password">
            <div className="relative">
              <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
              </button>
            </div>
          </Field>
          {error ? <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p> : null}
          <Button type="submit" disabled={busy} size="lg">
            {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} Log in
          </Button>
        </form>
        <p className="mt-5 text-sm text-muted-foreground">
          New here? <Link to="/register" className="font-semibold text-primary hover:underline">Create your profile</Link>
        </p>
      </Panel>

      <Panel className="bg-surface p-8">
        <DemoBadge>Demonstration access</DemoBadge>
        <h2 className="mt-3 text-2xl font-bold">Explore without an account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These open sample accounts with no password. They exist to show the platform and are not secure sign-in. Everything is stored in this browser only and is not
          shared across devices.
        </p>
        <div className="mt-6 grid gap-3">
          <button type="button" onClick={() => demo("seeker")} className="flex items-center gap-4 rounded-xl border bg-card p-4 text-left shadow-card transition-transform hover:-translate-y-0.5">
            <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><UserRound className="size-5" aria-hidden /></span>
            <span>
              <span className="block font-semibold">Open demo job seeker</span>
              <span className="block text-sm text-muted-foreground">A filled-in profile with applications and a mentor request.</span>
            </span>
          </button>
          <button type="button" onClick={() => demo("admin")} className="flex items-center gap-4 rounded-xl border bg-card p-4 text-left shadow-card transition-transform hover:-translate-y-0.5">
            <span className="grid size-11 place-items-center rounded-xl bg-teal-soft text-teal-strong"><ShieldCheck className="size-5" aria-hidden /></span>
            <span>
              <span className="block font-semibold">Open demo administrator</span>
              <span className="block text-sm text-muted-foreground">Manage listings, resources and requests, and view platform charts.</span>
            </span>
          </button>
        </div>
      </Panel>
    </div>
  );
}
