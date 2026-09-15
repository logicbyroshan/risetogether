// frontend/src/components/features/dsa/CreateCodingPostModal.tsx

import React, { useState, useEffect } from 'react';
import { dsaApi } from '../../../api/dsaApi';
import {
  CodingProblemPost,
  DifficultyLevel,
  TimeComplexityChoice,
  LanguageChoice,
} from '../../../types/dsa';
import { useToast } from '../../../context/ToastContext';
import { X, Code2, Sparkles } from 'lucide-react';

interface CreateCodingPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingPost?: CodingProblemPost | null;
}

export const CreateCodingPostModal: React.FC<CreateCodingPostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingPost,
}) => {
  const [title, setTitle] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [timeComplexity, setTimeComplexity] = useState<TimeComplexityChoice>('O(n)');
  const [detectedLang, setDetectedLang] = useState<LanguageChoice>('PYTHON');
  const [loading, setLoading] = useState(false);

  const { success: toastSuccess, error: toastError } = useToast();

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setCodeSnippet(editingPost.code_snippet);
      setDifficulty(editingPost.difficulty);
      setTimeComplexity(editingPost.time_complexity);
      setDetectedLang(editingPost.language);
    } else {
      setTitle('');
      setCodeSnippet('');
      setDifficulty('MEDIUM');
      setTimeComplexity('O(n)');
      setDetectedLang('PYTHON');
    }
  }, [editingPost, isOpen]);

  // Real-time language detection helper
  useEffect(() => {
    if (!codeSnippet) return;
    const cpp = ['#include', 'std::', 'cout', 'cin', 'int main', 'vector<'];
    const java = ['public class', 'System.out.println', 'import java.'];
    const ts = ['interface ', 'type ', ': string', ': number', ': boolean'];
    const js = ['const ', 'let ', 'var ', 'console.log', 'function('];
    const py = ['def ', 'import ', 'print(', 'elif ', 'self.'];

    if (cpp.some((k) => codeSnippet.includes(k))) setDetectedLang('CPP');
    else if (java.some((k) => codeSnippet.includes(k))) setDetectedLang('JAVA');
    else if (ts.some((k) => codeSnippet.includes(k))) setDetectedLang('TYPESCRIPT');
    else if (js.some((k) => codeSnippet.includes(k))) setDetectedLang('JAVASCRIPT');
    else if (py.some((k) => codeSnippet.includes(k))) setDetectedLang('PYTHON');
  }, [codeSnippet]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !codeSnippet.trim()) {
      toastError('Please fill in both title and code snippet.');
      return;
    }

    try {
      setLoading(true);
      if (editingPost) {
        await dsaApi.updateCodingPost(editingPost.id, {
          title,
          code_snippet: codeSnippet,
          difficulty,
          time_complexity: timeComplexity,
          language: detectedLang,
        });
        toastSuccess('Coding problem updated successfully!');
      } else {
        const created = await dsaApi.createCodingPost({
          title,
          code_snippet: codeSnippet,
          difficulty,
          time_complexity: timeComplexity,
          language: detectedLang,
        });
        toastSuccess(`Problem posted! Earned ${created.points_earned} points!`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError(err.customMessage || err.message || 'Failed to submit problem post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#24283b] border border-[#414868] rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#bb9af7] mb-6">
          <Code2 className="w-6 h-6" />
          <h2 className="text-xl font-bold tracking-wide font-rajdhani uppercase">
            {editingPost ? 'Edit Coding Problem' : 'Create a New Post'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Problem Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 217. Contains Duplicate (Hash Set Approach)"
              required
              className="w-full px-4 py-2.5 bg-[#1a1b26] border border-[#414868] rounded-xl text-sm text-[#c0caf5] placeholder-gray-500 focus:outline-none focus:border-[#bb9af7]"
            />
          </div>

          {/* CODE SNIPPET */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Code Snippet / Solution
              </label>
              <div className="flex items-center gap-1.5 text-xs text-[#7dcfff] font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Detected: {detectedLang}</span>
              </div>
            </div>
            <textarea
              rows={8}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder={`def containsDuplicate(nums: list[int]) -> bool:\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False`}
              required
              className="w-full p-4 bg-[#101116] border border-[#414868] rounded-xl font-mono text-xs text-[#c0caf5] placeholder-gray-600 focus:outline-none focus:border-[#bb9af7] resize-y leading-relaxed"
            />
          </div>

          {/* SELECTORS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-4 py-2.5 bg-[#1a1b26] border border-[#414868] rounded-xl text-sm text-[#c0caf5] focus:outline-none focus:border-[#bb9af7]"
              >
                <option value="EASY">Easy (+2 Base Pts)</option>
                <option value="MEDIUM">Medium (+5 Base Pts)</option>
                <option value="HARD">Hard (+10 Base Pts)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Time Complexity
              </label>
              <select
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value as TimeComplexityChoice)}
                className="w-full px-4 py-2.5 bg-[#1a1b26] border border-[#414868] rounded-xl text-sm text-[#c0caf5] focus:outline-none focus:border-[#bb9af7]"
              >
                <option value="O(1)">O(1) - Constant (+10 Pts)</option>
                <option value="O(log n)">O(log n) - Logarithmic (+9 Pts)</option>
                <option value="O(n)">O(n) - Linear (+5 Pts)</option>
                <option value="O(n log n)">O(n log n) - Log-Linear (+6 Pts)</option>
                <option value="O(n^2)">O(n^2) - Quadratic (+7 Pts)</option>
                <option value="O(n^3)">O(n^3) - Cubic (+3 Pts)</option>
                <option value="O(2^n)">O(2^n) - Exponential (+2 Pts)</option>
                <option value="O(n!)">O(n!) - Factorial (+1 Pt)</option>
              </select>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-[#bb9af7] hover:bg-[#a982f5] text-[#1a1b26] shadow-lg transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? 'Processing Problem...'
                : editingPost
                ? 'Save Changes'
                : 'Post Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
