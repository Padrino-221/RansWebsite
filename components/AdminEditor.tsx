"use client";

import { useEffect, useMemo, useState } from "react";
import { CmsImageUpload } from "@/components/CmsImageUpload";
import { SiteIcon } from "@/components/SiteIcon";
import { ChevronDown, Plus } from "lucide-react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
const lucideIconOptions = ["BadgeCheck", "BarChart3", "BrainCircuit", "BriefcaseBusiness", "Clock3", "Cloud", "Code2", "Cpu", "DatabaseBackup", "Gauge", "Headset", "Network", "ShieldCheck", "Sparkles", "Trophy"];

function clone<T,>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function setAtPath(root: JsonValue, path: (string | number)[], value: JsonValue): JsonValue {
  if (!path.length) return value;
  const [head, ...tail] = path;
  if (Array.isArray(root)) { const copy = [...root]; copy[Number(head)] = setAtPath(copy[Number(head)], tail, value); return copy; }
  if (root && typeof root === "object") return { ...root, [String(head)]: setAtPath(root[String(head)], tail, value) };
  return root;
}
function removeAtPath(root: JsonValue, path: (string | number)[]): JsonValue {
  if (!path.length) return root;
  const [head, ...tail] = path;
  if (Array.isArray(root)) { const copy = [...root]; if (!tail.length) copy.splice(Number(head), 1); else copy[Number(head)] = removeAtPath(copy[Number(head)], tail); return copy; }
  if (root && typeof root === "object") return { ...root, [String(head)]: removeAtPath(root[String(head)], tail) };
  return root;
}
function emptyValue(value: JsonValue): JsonValue {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).map(key => [key, emptyValue(value[key])])) as JsonValue;
  return null;
}

function itemTitle(value: JsonValue, index: number) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const title = value.title ?? value.name ?? value.label ?? value.heading ?? value.slug;
    if (typeof title === "string" && title.trim()) return title.trim();
  }
  if (typeof value === "string" && value.trim()) return value.trim();
  return `Item ${index + 1}`;
}

function ArrayContent({ name, value, path, onChange, onAdd, onRemove, onUpload }: {
  name: string; value: JsonValue[]; path: (string | number)[];
  onChange: (path: (string | number)[], value: JsonValue) => void;
  onAdd: (path: (string | number)[], value: JsonValue) => void;
  onRemove: (path: (string | number)[]) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const testimonialList = path.join(".") === "testimonials.testimonials";
  const atTestimonialLimit = testimonialList && value.length >= 6;
  const add = () => {
    if (atTestimonialLimit) return;
    onAdd(path, value.length ? emptyValue(value[0]) : "");
    setOpenItems(items => [...items, value.length]);
  };
  const remove = (index: number) => {
    onRemove([...path, index]);
    setOpenItems(items => items.filter(item => item !== index).map(item => item > index ? item - 1 : item));
  };

  return <fieldset className="cms-group"><legend>{name}<button type="button" className="cms-inline-button" onClick={add} disabled={atTestimonialLimit} title={atTestimonialLimit ? "A maximum of six testimonials is allowed." : undefined}><Plus aria-hidden="true" size={14} />{path.join(".") === "blog.posts" ? "Add blog post" : "Add"}</button></legend>
    {testimonialList && <p className="cms-field-hint">Add up to 6 client testimonials. {value.length} of 6 used.</p>}
    {value.length ? value.map((entry, index) => <details className="cms-array-item" key={index} open={openItems.includes(index)} onToggle={event => {
      const isOpen = event.currentTarget.open;
      setOpenItems(items => isOpen ? (items.includes(index) ? items : [...items, index]) : items.filter(item => item !== index));
    }}>
      <summary className="cms-array-summary"><span>{itemTitle(entry, index)}</span><span className="cms-array-meta">{entry && typeof entry === "object" && !Array.isArray(entry) ? `${Object.keys(entry).length} fields` : "Edit item"}<ChevronDown aria-hidden="true" size={17} /></span></summary>
      <div className="cms-array-content"><ContentNode name={`Item ${index + 1}`} value={entry} path={[...path, index]} onChange={onChange} onAdd={onAdd} onRemove={onRemove} onUpload={onUpload} /><button type="button" className="cms-remove" onClick={() => remove(index)} aria-label={`Remove ${itemTitle(entry, index)}`}>Remove</button></div>
    </details>) : <p className="cms-empty">No items yet. Use Add to create one.</p>}
  </fieldset>;
}

function ContentNode({ name, value, path, onChange, onAdd, onRemove, onUpload }: {
  name: string; value: JsonValue; path: (string | number)[];
  onChange: (path: (string | number)[], value: JsonValue) => void;
  onAdd: (path: (string | number)[], value: JsonValue) => void;
  onRemove: (path: (string | number)[]) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  if (Array.isArray(value)) return <ArrayContent name={name} value={value} path={path} onChange={onChange} onAdd={onAdd} onRemove={onRemove} onUpload={onUpload} />;
  if (value && typeof value === "object") return <fieldset className="cms-group"><legend>{name}</legend>{Object.entries(value).map(([key, entry]) => <ContentNode key={key} name={key} value={entry} path={[...path, key]} onChange={onChange} onAdd={onAdd} onRemove={onRemove} onUpload={onUpload} />)}</fieldset>;
  const label = name.replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ");
  if (typeof value === "boolean") return <label className="cms-toggle"><input type="checkbox" checked={value} onChange={event => onChange(path, event.target.checked)} /> {label}</label>;
  if (typeof value === "number") return <label className="cms-field"><span>{label}</span><input type="number" value={value} onChange={event => onChange(path, Number(event.target.value))} /></label>;
  const text = value == null ? "" : String(value);
  const isLong = text.length > 90 || ["description", "body", "intro", "summary", "label"].some(word => name.toLowerCase().includes(word));
  const imageField = /(^|\.)(media|image[a-z]*|logo|icon|photo[a-z]*|thumbnail|team|person|doodleOne|doodleTwo|communityCard|main|inset|primary|smallOne|smallTwo)(\.|$)/i.test(path.join("."));
  if (name.toLowerCase() === "icon") return <label className="cms-field"><span>{label}</span><select value={text} onChange={event => onChange(path, event.target.value)}><option value={text}>{lucideIconOptions.includes(text) ? text : "Current icon (matched to Lucide)"}</option>{lucideIconOptions.filter(option => option !== text).map(option => <option key={option} value={option}>{option}</option>)}</select><small className="cms-field-hint">Choose a Lucide icon for this item.</small></label>;
  if (imageField) return <div className="cms-field"><span>{label}</span><CmsImageUpload value={text} onChange={next => onChange(path, next)} onUpload={onUpload} /></div>;
  return <label className="cms-field"><span>{label}</span>{isLong ? <textarea rows={Math.min(7, Math.max(3, Math.ceil(text.length / 90)))} value={text} onChange={event => onChange(path, event.target.value)} /> : <input value={text} onChange={event => onChange(path, event.target.value)} />}{name.toLowerCase() === "slug" && <small className="cms-field-hint">Leave blank to generate the URL from the post title.</small>}</label>;
}

export function AdminEditor() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [content, setContent] = useState<JsonValue | null>(null);
  const [active, setActive] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const sections = useMemo(() => content && typeof content === "object" && !Array.isArray(content) ? Object.keys(content) : [], [content]);

  async function loadContent() {
    const response = await fetch("/api/site-content", { cache: "no-store" });
    const data = await response.json();
    setContent(data);
    setActive(Object.keys(data)[0] ?? "");
  }
  useEffect(() => {
    fetch("/api/admin/session").then(response => response.json()).then(async data => {
      setConfigured(data.configured); setAuthenticated(data.authenticated);
      if (data.authenticated) await loadContent();
    }).catch(() => setMessage("Could not connect to the CMS."));
  }, []);
  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Sign in failed.");
      setAuthenticated(true); setPassword(""); await loadContent();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Sign in failed."); }
    finally { setBusy(false); }
  }
  async function setupPassword(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    if (password.length < 12) { setMessage("Choose a password with at least 12 characters."); return; }
    if (password !== confirmPassword) { setMessage("The passwords do not match."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Password setup failed.");
      setAuthenticated(true); setPassword(""); setConfirmPassword(""); await loadContent();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Password setup failed."); }
    finally { setBusy(false); }
  }
  async function save() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/site-content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed.");
      setMessage("Changes saved. They are live on the website.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Save failed."); }
    finally { setBusy(false); }
  }
  async function uploadImage(file: File) {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Image upload failed.");
    return String(data.url);
  }
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }); setAuthenticated(false); setContent(null); setMessage("");
  }

  if (configured === null) return <main className="cms-loading">Loading the website editor…</main>;
  if (!configured) return <main className="cms-login-wrap"><form className="cms-login" onSubmit={setupPassword}><p className="detail-eyebrow">ROKTECK WEBSITE</p><h1>Set admin password</h1><p>Create the password for this local website editor. It must be at least 12 characters and will be stored as a salted hash.</p><label className="cms-field"><span>New password</span><input type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} required minLength={12} /></label><label className="cms-field"><span>Confirm password</span><input type="password" autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required minLength={12} /></label>{message && <p className="cms-message cms-error">{message}</p>}<button className="detail-button" disabled={busy}>{busy ? "Setting password…" : "Set password"}</button><p className="cms-setup-note">For a deployed website, configure <code>CMS_ADMIN_PASSWORD</code> on the server.</p></form></main>;
  if (!authenticated) return <main className="cms-login-wrap"><form className="cms-login" onSubmit={login}><p className="detail-eyebrow">ROKTECK WEBSITE</p><h1>Content editor</h1><p>Sign in to update the pages and content on your website.</p><label className="cms-field"><span>Admin password</span><input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>{message && <p className="cms-message cms-error">{message}</p>}<button className="detail-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form></main>;
  const current = content && typeof content === "object" && !Array.isArray(content) ? content[active] : null;
  const onChange = (path: (string | number)[], value: JsonValue) => setContent(previous => previous ? setAtPath(previous, path, value) : previous);
  const onRemove = (path: (string | number)[]) => setContent(previous => previous ? removeAtPath(previous, path) : previous);
  const onAdd = (path: (string | number)[], value: JsonValue) => setContent(previous => {
    if (!previous) return previous;
    const read = (root: JsonValue, keys: (string | number)[]): JsonValue => keys.reduce<JsonValue>((node, key) => Array.isArray(node) ? node[Number(key)] : (node as { [key: string]: JsonValue })[String(key)], root);
    const array = read(previous, path);
    if (!Array.isArray(array)) return previous;
    if (path.join(".") === "testimonials.testimonials") {
      if (array.length >= 6) return previous;
      const ids = array.map(item => item && typeof item === "object" && !Array.isArray(item) ? Number(item.id) || 0 : 0);
      const template = value && typeof value === "object" && !Array.isArray(value) ? value : {};
      value = { ...template, id: Math.max(0, ...ids) + 1 };
    }
    let addition = value;
    if (path.join(".") === "blog.posts") {
      const ids = array.map(item => item && typeof item === "object" && !Array.isArray(item) ? Number(item.id) || 0 : 0);
      addition = {
        id: Math.max(0, ...ids) + 1,
        slug: "",
        image: "assets/img/blog/blog-img1.png",
        author: "Rokteck IT Solutions",
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        title: "New blog post",
        excerpt: "Add a short introduction for this article.",
        body: "Write the article content here. Separate paragraphs with a blank line.",
      };
    }
    return setAtPath(previous, path, [...array, addition]);
  });
  return <main className="cms-shell"><header className="cms-topbar"><a className="cms-brand" href="/">ROKTECK <span>CONTENT STUDIO</span></a><div><a href="/" target="_blank" rel="noreferrer">View website <SiteIcon name="ArrowUpRight" size={15} /></a><button onClick={logout}>Sign out</button></div></header><div className="cms-layout"><aside className="cms-sidebar"><p>WEBSITE CONTENT</p>{sections.map(section => <button key={section} className={active === section ? "is-active" : ""} onClick={() => { setActive(section); setMessage(""); }}>{section.replace(/([A-Z])/g, " $1")}</button>)}</aside><section className="cms-editor"><div className="cms-editor-heading"><div><p className="detail-eyebrow">CONTENT MANAGEMENT</p><h1>Edit {active.replace(/([A-Z])/g, " $1")}</h1><p>Changes apply to the public website after you save.</p></div><button className="detail-button" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button></div>{message && <p className={`cms-message ${message.startsWith("Changes saved") ? "cms-success" : "cms-error"}`}>{message}</p>}{current && <div className="cms-fields"><ContentNode name={active} value={current} path={[active]} onChange={onChange} onAdd={onAdd} onRemove={onRemove} onUpload={uploadImage} /></div>}</section></div></main>;
}
