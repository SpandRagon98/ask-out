import { motion } from 'motion/react';
import { Check, Clock, Copy, Eye, MapPin, MessageCircle, Pencil } from 'lucide-react';
import { useState } from 'react';
import { buildReply, whatsappShareUrl, type PlanState, type ScreenId } from '../lib/plan';
import { Modal } from './Modal';

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the old-school way */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

interface Props {
  plan: PlanState;
  onEdit: (screen: ScreenId) => void;
}

export function WhatsAppShare({ plan, onEdit }: Props) {
  const message = buildReply(plan);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [preview, setPreview] = useState(false);
  const [change, setChange] = useState(false);

  const onCopy = async () => {
    const ok = await copyText(message);
    setCopyState(ok ? 'copied' : 'failed');
    window.setTimeout(() => setCopyState('idle'), 3200);
  };

  return (
    <div className="flex flex-col items-center">
      <motion.a
        href={whatsappShareUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full max-w-xs"
        whileTap={{ scale: 0.96 }}
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        Okay, I'll text you :)
        <span className="sr-only">
          (opens WhatsApp so you can pick the chat. Nothing is sent until you press send.)
        </span>
      </motion.a>

      <div className="mt-1 flex items-center justify-center">
        <button type="button" className="btn-link whitespace-nowrap text-[0.85rem]" onClick={() => setPreview(true)}>
          <Eye className="h-4 w-4" aria-hidden="true" />
          Preview
        </button>
        <span aria-hidden="true" className="text-cream/25">
          ·
        </span>
        <button type="button" className="btn-link whitespace-nowrap text-[0.85rem]" onClick={() => setChange(true)}>
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Change something
        </button>
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} title="The message">
        <p className="eyebrow">What it'll say</p>
        <p className="mt-1 text-[0.85rem] text-cream/55">You can still edit it in WhatsApp.</p>
        <div className="relative ml-auto mt-4 w-fit max-w-full rounded-2xl rounded-tr-md bg-[#1F5C4A] px-4 py-3 text-left text-[1rem] leading-relaxed text-cream shadow-glass">
          <p className="select-text whitespace-pre-line">{message}</p>
          <span className="mt-1 block text-right text-[0.7rem] text-[#8FD3C1]" aria-hidden="true">
            ✓✓
          </span>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
          <button type="button" onClick={onCopy} className="btn-glass text-[0.92rem]">
            {copyState === 'copied' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copyState === 'copied' ? 'Copied' : 'Copy it'}
          </button>
          <a href={whatsappShareUrl(message)} target="_blank" rel="noopener noreferrer" className="btn-primary text-[0.95rem]">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Open WhatsApp
          </a>
        </div>
        <p aria-live="polite" className="mt-2 min-h-[1.25rem] text-right text-[0.82rem] text-cream/60">
          {copyState === 'copied'
            ? 'Paste it wherever.'
            : copyState === 'failed'
              ? "Couldn't copy automatically. Long-press the message to copy it."
              : ''}
        </p>
        <p className="hand text-center text-[1.25rem]">Or just text me normally. That works too 😂</p>
      </Modal>

      <Modal open={change} onClose={() => setChange(false)} title="Change something">
        <p className="pr-8 font-display text-[1.7rem] leading-tight">
          No stress. <span className="italic text-glow">What's changing?</span>
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" className="btn-glass flex-col !rounded-2xl py-4" onClick={() => onEdit('food')}>
            <MapPin className="h-5 w-5" aria-hidden="true" />
            The place
          </button>
          <button type="button" className="btn-glass flex-col !rounded-2xl py-4" onClick={() => onEdit('time')}>
            <Clock className="h-5 w-5" aria-hidden="true" />
            The time
          </button>
        </div>
      </Modal>
    </div>
  );
}
