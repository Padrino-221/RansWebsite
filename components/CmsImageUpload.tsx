"use client";

import { useRef, useState } from "react";
import { Image, Upload } from "lucide-react";
import { publicAssetPath } from "@/lib/assets";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const maxBytes = 10 * 1024 * 1024;

export function CmsImageUpload({ value, onChange, onUpload }: {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setMessage("");
    if (!acceptedTypes.includes(file.type)) { setMessage("Choose a JPEG, PNG, WebP, GIF, or AVIF image."); return; }
    if (file.size > maxBytes) { setMessage("Images must be 10 MB or smaller."); return; }
    setUploading(true);
    try { onChange(await onUpload(file)); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Image upload failed."); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ""; }
  }

  return <div className={`cms-upload${dragging ? " is-dragging" : ""}`} onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }} onDrop={event => { event.preventDefault(); setDragging(false); void upload(event.dataTransfer.files[0]); }}>
    <input ref={inputRef} className="cms-upload-input" type="file" accept={acceptedTypes.join(",")} onChange={event => void upload(event.target.files?.[0])} tabIndex={-1} aria-hidden="true" />
    <div className="cms-upload-preview">{value ? <img src={publicAssetPath(value)} alt="Current selected image" /> : <Image aria-hidden="true" size={22} />}</div>
    <div className="cms-upload-copy"><strong>{uploading ? "Uploading image…" : value ? "Image selected" : "No image selected"}</strong><span>Drop an image here or choose a file · up to 10 MB</span></div>
    <button type="button" className="cms-upload-button" onClick={() => inputRef.current?.click()} disabled={uploading}>{uploading ? "Uploading…" : <><Upload aria-hidden="true" size={15} />{value ? "Change image" : "Choose image"}</>}</button>
    {message && <p className="cms-upload-error" role="alert">{message}</p>}
  </div>;
}
