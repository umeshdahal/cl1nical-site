import { useState } from 'react';
import { Copy, Check, Eye, Code } from 'lucide-react';
import { marked } from 'marked';

interface MarkdownEditorProps {
  darkMode: boolean;
}

export default function MarkdownEditor({ darkMode }: MarkdownEditorProps) {
  const [input, setInput] = useState('# Hello World\n\nStart typing **markdown** here...');
  const [preview, setPreview] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);

  const renderMarkdown = () => {
    return { __html: marked(input) };
  };

  const copyHtml = async () => {
    const html = await marked(input);
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setPreview('preview')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
              preview === 'preview'
                ? darkMode ? 'bg-white/[0.12] text-white' : 'bg-indigo-100 text-indigo-700'
                : darkMode ? 'bg-white/[0.04] text-white/50' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={() => setPreview('html')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
              preview === 'html'
                ? darkMode ? 'bg-white/[0.12] text-white' : 'bg-indigo-100 text-indigo-700'
                : darkMode ? 'bg-white/[0.04] text-white/50' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <Code size={14} /> HTML
          </button>
        </div>
        <button
          onClick={copyHtml}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
            darkMode ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
          }`}
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy HTML'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
            Markdown Input
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className={`w-full h-96 p-4 border rounded-xl text-sm font-mono outline-none resize-none ${
              darkMode
                ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
            }`}
            placeholder="# Write markdown here..."
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
            {preview === 'preview' ? 'Preview' : 'HTML Output'}
          </label>
          <div
            className={`w-full h-96 p-4 border rounded-xl overflow-auto text-sm ${
              darkMode
                ? 'bg-white/[0.04] border-white/[0.08] text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            } ${preview === 'html' ? 'font-mono whitespace-pre-wrap' : ''}`}
          >
            {preview === 'preview' ? (
              <div className="markdown-body" dangerouslySetInnerHTML={renderMarkdown()} />
            ) : (
              marked(input)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
